# Adapter Layer

> **Area:** adapter-layer
> **Status:** Active
> **Last updated:** 2026-04-22

## Overview

The adapter layer is the seam between the MCP-facing contract and the systems of record that hold content. Every source of curated material — filesystem at launch, Confluence, potentially Notion or a git-backed mirror later — plugs in through a single `SourceAdapter` interface. Agents see stable URIs (`conventions://python/style`, `templates://prd`) and never learn which backend served them; migrating a single resource from Confluence to a git-backed mirror is a registry change, not a client change.

## Responsibilities

- Define the `SourceAdapter` contract every source implements
- Resolve agent-facing URIs to `(adapter_id, backing_id)` via the URI registry
- Keep reads cheap with an ETag + TTL cache
- Normalize upstream content (e.g. Confluence storage format) to markdown before it reaches the MCP surface
- Surface upstream changes via `notifications/resources/list_changed` and matching cache invalidation
- Handle upstream failure uniformly as `upstreamUnavailable` (`1002`)

What this feature does NOT own:

- Token validation or scope enforcement (that's `auth-and-scopes`)
- MCP tool and prompt shapes (that's `mcp-surface`)
- Content authoring — adapters project existing content; they never create or edit it
- Per-user entitlements — source-level auth is a service principal at launch (PRD §6.6)

## Key concepts

- **SourceAdapter**: the minimal contract every backend implements — `id`, `list`, `fetch`, `search`, optional `onChange`
- **Registry**: single in-memory map `uri → (adapter_id, backing_id)` plus `supersedes` chains
- **ResourceEntry**: what the registry stores per URI (name, description, owner, product, space, topics, priority)
- **FetchResult**: `{ content, etag, updated }` — the common output shape of every `adapter.fetch(...)`
- **Canonical URI**: the end of an alias / `supersedes` chain; the registry returns the canonical entry for any alias URI passed to `resolve`
- **Scope**: which corpus kind the URI belongs to (`conventions`, `runbooks`, `templates`, `docs`, `catalog`)

---

## Contract

```ts
interface SourceAdapter {
  readonly id: string;
  list(scope?: string): Promise<ResourceHandle[]>;
  fetch(backingId: string): Promise<FetchResult>;
  search(query: string, scope?: string): Promise<SearchHit[]>;
  onChange?(cb: (handle: ResourceHandle) => void): Unsubscribe;
}
```

Defined in [`src/adapters/types.ts`](../../src/adapters/types.ts).

Semantics:

- `list(scope?)` returns handles (metadata only — no body) for the resources the adapter knows about. `scope` is the filesystem subdirectory for `FilesystemAdapter`, or the Confluence space key lookup for `ConfluenceAdapter`.
- `fetch(backingId)` returns content plus an `etag` and `updated` timestamp. Implementations throw `upstreamUnavailable(...)` on failure rather than returning empty.
- `search(query, scope?)` returns hits with a short snippet and score. Adapters may return an empty array — agents do not treat empty as an error.
- `onChange(cb)` is optional. If present, the adapter fires `cb(handle)` whenever a backing resource changes; the server invalidates the cache entry and emits `notifications/resources/list_changed`.

## Data flow

```
Agent → resources/read(uri)
     → Registry.resolve(uri)           → canonicalize via supersedes chain
     → Cache.get(uri)                  → hit: return cached
                                        miss: continue
     → Adapter.fetch(backingId)        → upstream read + markdown normalization
     → Cache.set(uri, FetchResult)
     → audit({kind: resource_read})
     → { contents: [...] }             with etag + lastModified in _meta
```

---

## Technical Implementation

### Registry

- **Location**: [`src/registry.ts`](../../src/registry.ts)
- **Key methods**:
  - `registerAdapter(a)` — register a `SourceAdapter` by its `id`
  - `register(entry)` — add a `ResourceEntry`; `supersedes` links are recorded
  - `resolve(uri)` — canonicalize + look up; throws `resourceNotFound` (`-32002`) for unknown URIs
  - `canonical(uri)` — follow alias / `supersedes` links to the current canonical URI
  - `findByTopic(topic)` — topic keyword resolver used by search-style consumers

### Adapters

- **FilesystemAdapter** ([`src/adapters/filesystem.ts`](../../src/adapters/filesystem.ts))
  - Walks a root dir, reads markdown, emits ETags derived from SHA-1 of the file buffer.
  - `onChange` uses Node's recursive `fs.watch`.
  - Primary adapter for integration tests per PRD §6.5 — tests stay off Confluence.
- **ConfluenceAdapter** ([`src/adapters/confluence.ts`](../../src/adapters/confluence.ts))
  - Uses the Confluence Cloud v2 API (`/wiki/api/v2/…`) with basic auth (email + API token).
  - Normalizes Confluence storage format to markdown via [`src/adapters/storage_to_markdown.ts`](../../src/adapters/storage_to_markdown.ts) — a parser-based pipeline (turndown + GFM tables plugin) with custom rules for Confluence-specific structured macros (`code`, `info`/`note`/`warning`/`tip`/`panel`, `ac:image`/`ri:attachment`). Unsupported macros degrade gracefully: inner content survives, the wrapper is dropped, no raw `<ac:` tags leak.
  - `onChange` implemented as a polling loop at a configurable `pollIntervalMs`.
  - Returns `upstreamUnavailable` (`1002`) on any network or non-2xx response.

### Cache

- **Location**: [`src/cache.ts`](../../src/cache.ts)
- TTL-based (`5 * 60_000` ms by default), indexed by URI (not backing id), returns cached `FetchResult` on hit.
- Invalidated on `onChange` events from any adapter.

### Key types

- `SourceAdapter` — the contract above
- `ResourceHandle` — `{ backingId, title, description?, updated, space? }`
- `FetchResult` — `{ content, etag, updated }`
- `SearchHit` — `{ backingId, snippet, score }`
- `ResourceEntry` — registry row; shape in `src/registry.ts`

---

## Configuration

### Environment Variables

- `CONTENT_DIR` — root for `FilesystemAdapter`. Default `./config/fixtures/content` (dev/test/offline fixtures; production deployments use Confluence-backed entries via `REGISTRY_CONFIG=config/registry.production.json` and don't read this directory).
- `CONFLUENCE_BASE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN` — required together to activate `ConfluenceAdapter`. Omit all three to run filesystem-only.
- `CONFLUENCE_SPACE_ENG`, `CONFLUENCE_SPACE_PRODUCT`, `CONFLUENCE_SPACE_SEC` — Confluence space keys mapped to the `ENG`, `PRODUCT`, `SEC` opaque enum agents see.

### Feature flags

None.

---

## Testing

### Integration Tests

- **Location**: [`tests/integration/server.test.ts`](../../tests/integration/server.test.ts)
- **Setup**: per-test `tmpdir` seeded with a couple of markdown fixtures; the test registers a `FilesystemAdapter` over that tmpdir and starts the full server with `DevValidator`.
- **Covered**: `resources/list` surfaces registry entries, `resources/read` returns content plus ETag and lastModified, `-32002` is raised for unknown URIs, the search tools that route through the adapter layer (`search_standards`, `search_docs`) behave correctly.
- **Mocking**: Confluence is not exercised in CI per PRD §6.5. Add a dedicated unit test for `ConfluenceAdapter` with an HTTP mock when extending it.

---

## Error Handling & Edge Cases

### Common Errors

- **Unknown URI**: `Registry.resolve(uri)` throws `resourceNotFound(uri)` → MCP error `-32002`. Low-level handlers in [`src/server.ts`](../../src/server.ts) propagate directly — we deliberately do NOT use the SDK's `McpServer.registerResource`, which would map unknown URIs to `-32602`.
- **Upstream failure**: adapters throw `upstreamUnavailable(source, detail?)` → MCP error `1002`. The client is expected to fall back to cached content when present (PRD §6.7).
- **Adapter not registered**: `ctx.registry.getAdapter(entry.adapterId)` returns `undefined` → treated as `resourceNotFound`. Indicates a misconfiguration; surfaces in startup logs.

### Edge Cases

- **Supersedes chain cycle**: `Registry.canonical` guards against cycles by tracking visited URIs; breaks out rather than looping.
- **Empty content directory**: filesystem adapter returns empty `list()`; server still starts, no resources surfaced.
- **Concurrent `fetch` during invalidation**: cache set/get is not locked; a racing read may briefly serve stale content until the next TTL boundary. Acceptable for curated standards; not acceptable for anything transactional — don't put transactional content behind an adapter.

---

## Security Considerations

- Service-principal auth for Confluence (PRD §6.6) — never per-user for MVP. Credentials are stored in the deployment target's secret store, never in the repo.
- Filesystem adapter is constrained to `CONTENT_DIR`; `backingId` values are relative paths joined onto `root` — future work: validate no `..` traversal if we ever accept `backingId` from untrusted input (currently only from the registry).
- Adapters never log resource bodies, only metadata (URI, backingId, etag).

## Performance Considerations

- Every read flows through the ETag cache; cache hit serves in microseconds.
- Cache TTL is 5 minutes by default — tuned so agents pulling on every turn don't tax upstreams while staying within the PRD's freshness window.
- Confluence `list()` is called on every `search_standards` index rebuild (also 5-minute TTL). Large spaces → consider pagination (TODO: verify `limit=250` handles Talentech's current Confluence size).
- `minisearch` index is rebuilt lazily from all adapters' content; rebuild cost is linear in corpus size. Fine at 20–100 resources; revisit at 1000+.

## Known Issues and Limitations

1. **Storage-format → markdown translator is parser-based but limited.** Headings, paragraphs, lists (incl. nested), simple tables, inline emphasis, links, images, fenced code with language hints, and the common Confluence panels (`info`/`note`/`warning`/`tip`/`panel`) render correctly. Layout macros (multi-column, tab groups), the Atlassian-specific link macro variants, and rich embeds are best-effort plain text. Replace with `@atlaskit/editor-common` if higher faithfulness is needed.
2. **Confluence `onChange` uses polling.** Webhook support would be cheaper; add when we want sub-minute change propagation.
3. **No per-resource TTL override.** Some resources change daily, others yearly; a uniform 5-minute TTL is a coarse approximation.
4. **Read count tracking in the staleness dashboard is process-local.** Multi-instance deployments will undercount.

## Related Features

- **auth-and-scopes**: scope enforcement runs before any adapter call
- **mcp-surface**: `search_standards` and `search_docs` invoke adapter methods; `resources/read` (protocol-native) goes through the registry → cache → adapter path

## Changelog

| Date       | Change                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------- |
| 2026-04-22 | Initial documentation                                                                          |
| 2026-04-28 | Confluence storage→markdown converter rewritten over turndown + GFM; added registry `aliases`. |
