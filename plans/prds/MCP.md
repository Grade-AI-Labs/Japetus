# PRD: Japetus — Org-wide MCP server for coding agents

**Status:** Draft
**Author:** Olof (Talentech)
**Last updated:** 2026-04-28
**Companion document:** Mimas PRD (separate repo)

---

## 1. Problem Statement

Coding agents at Talentech today get context from two places: files in the repo (`AGENTS.md`, `CLAUDE.md`, skill folders) and whatever the developer pastes into the prompt. Neither works well for organization-wide standards:

- **Static repo files drift.** A PR convention copied into 40 repos ages at 40 different rates. When we update it centrally, the repos don't know.
- **Canonical docs live behind auth.** Coding conventions, PR checklists, incident runbooks, and the service catalog sit in Confluence behind Entra SSO. Agents can't reach them directly.
- **Mimas solves distribution, not surfacing.** The repo-onboarding tool is good at shipping files that travel with code; it's the wrong layer for content that changes weekly and needs live auth.
- **Per-tool configuration doesn't compose.** `AGENTS.md`, `.cursor/rules`, `.github/copilot-instructions.md` — each tool has its own way. Every new standard becomes three PRs across every repo.

Result: agents give outdated advice, conventions are inconsistently applied in generated code, and maintainers spend time on copy-paste work that should be one source of truth.

---

## 2. Solution

Japetus is a remote MCP server that surfaces Talentech's coding standards, runbooks, templates, and service ownership to any MCP-capable coding agent (Claude Code, Cursor, VS Code Copilot Chat, and others as MCP support matures). It authenticates developers via Microsoft Entra and projects curated content from the org's knowledge sources — Confluence at launch, pluggable by design — through stable, cache-friendly MCP primitives: resources for reference material, tools for search and lookup, prompts for canonical workflows.

Japetus does **not** store standards. It curates and projects them from existing systems of record. Org-wide conventions are authored and maintained by their owners (CTO/CIO, security, SRE, platform/DX) in Confluence; Japetus exposes them under a stable URI namespace so every agent reads the latest version on every relevant turn.

The product split with adjacent tooling:

| Layer | Purpose | Distribution | Lifecycle |
|---|---|---|---|
| **Repo (`AGENTS.md`, skills)** | Repo-specific conventions, per-project tooling | Mimas, git | Changes with the code |
| **Japetus (MCP)** | Org-wide standards, curated docs, catalog | Remote MCP server | Changes weekly; server returns current |
| **Upstream KB / ADO / catalog** | Systems of record (Confluence at launch) | As today | Owned by content authors |

**High-level architecture:**

```
Agent (Claude Code, Cursor, …)
        │  Streamable HTTP, MCP
        ▼
┌────────────────────────────┐
│  Japetus server            │◀── Entra OAuth 2.1 (per-user token)
│   ├── Resources            │
│   ├── Tools                │
│   ├── Prompts              │
│   ├── Registry (URI ↔      │
│   │   adapter routing)     │
│   └── Source adapters      │
└──────────┬─────────────────┘
           │
   ┌───────┼────────┬──────────────┐
   ▼       ▼        ▼              ▼
 Confluence  Filesystem  Service     (future)
 (production) (dev/test  catalog     Git mirror,
              + fallback) (read-only) Notion, …
```

---

## 3. User Stories

1. As a Talentech engineer using Claude Code, I want a single MCP server registered in my agent so that I can pull org-wide coding standards into any prompt without copy-paste.
2. As a Talentech engineer using Cursor, I want the same MCP server registered so that my conventions stay consistent across tools.
3. As a Talentech engineer, I want my agent to fetch the current Talentech Python style guide before generating Python code so that the output matches house style.
4. As a Talentech engineer, I want my agent to fetch the current Talentech TypeScript style guide before generating TypeScript code so that the output matches house style.
5. As a Talentech engineer, I want my agent to consult the React component-patterns convention before generating React components so that I follow our composition rules.
6. As a Talentech engineer reviewing a PR, I want my agent to consult `conventions://prs/review-checklist` so that my review covers all required checks.
7. As a Talentech engineer drafting a PR description, I want my agent to invoke the canonical PR-description workflow so that the description follows the Talentech template.
8. As a Talentech engineer writing a PRD, I want my agent to invoke the `write_prd` prompt so that the PRD follows the canonical Talentech structure.
9. As a Talentech engineer writing an RFC, I want my agent to invoke the `write_rfc` prompt so that the RFC follows the canonical structure.
10. As a Talentech engineer writing an ADR, I want my agent to invoke the `write_adr` prompt so that the ADR follows the canonical structure.
11. As a Talentech engineer running a postmortem, I want my agent to invoke the `incident_postmortem` prompt so that the postmortem follows the blameless template.
12. As a Talentech engineer touching candidate data, I want my agent to consult `conventions://compliance/gdpr-pii-handling` so that my code respects GDPR rules.
13. As a Talentech engineer adding a third-party dependency, I want my agent to consult `conventions://security/dependency-policy` so that I follow the approval, scanning, and SBOM process.
14. As a Talentech engineer writing commits, I want my agent to consult `conventions://git/commit-messages` so that messages follow the imperative-mood and work-item-linking convention.
15. As a Talentech engineer searching for "PII candidate data" guidance, I want `search_standards("PII candidate data")` to return the right URI so that I find the canonical doc on the first try.
16. As a Talentech engineer asking "who owns service X", I want `who_owns({ path: "talentech-ats-core" })` to return team, primary contact, Slack channel, and repos so that I can route my question correctly.
17. As a Talentech engineer searching pre-approved Confluence spaces for a topic, I want `search_docs({ space: "ENG", query: "..." })` to return relevant doc URIs so that I can read the source material.
18. As a Talentech engineer onboarding a new repo via Mimas, I want my generated `AGENTS.md` to reference `conventions://` URIs rather than inlining standards so that the repo always reflects the latest org rules.
19. As a CTO/CIO maintaining a coding convention in Confluence, I want my edits to propagate to all agents within minutes so that engineers use the latest version without me filing PRs across repos.
20. As a security reviewer, I want only authenticated Talentech engineers to read curated content so that we maintain a clear trust boundary.
21. As an operator, I want every tool call and resource read logged with the user's `sub`, the URI, and a redacted query summary so that we have an auditable trail.
22. As a CI agent, I want a narrow-scoped client-credentials flow so that build pipelines can fetch conventions without user OAuth.
23. As a platform owner, I want to add a new convention URI by updating a registry config and pointing it at a Confluence page so that I do not have to ship code for every content change.
24. As a platform owner, I want to retire or rename a convention URI without breaking consumers, using a `supersedes` redirect so that AGENTS.md references in onboarded repos keep working.
25. As a platform owner, I want to add a new content area (e.g. `LEGAL`) by adding a config-only routing label so that I do not have to reissue auth tokens.
26. As an operator, I want every resource read to return `etag` and `lastModified` so that clients can cache aggressively and avoid refetching unchanged content.
27. As an operator, I want Confluence updates to invalidate cached resources via change notifications so that engineers never see stale content beyond the polling interval.
28. As an SRE, I want metrics on adoption (distinct active users, tool calls/week, distinct client × version) emitted via OTEL so that I can dashboard usage in AppSignal.
29. As an SRE, I want a clear MCP error code (`1002`) when upstream Confluence is unavailable so that clients can fall back to cached copies cleanly.
30. As an SRE, I want a clear MCP error code (`1001`) when a token lacks the required scope so that clients give the user actionable feedback.
31. As an MCP-capable agent without skills support (e.g. Codex), I want `AGENTS.md` files generated by Mimas to reference Japetus URIs so that I have authoritative pointers even if I cannot dereference them live.

---

## 4. Implementation Decisions

### 4.1 URI scheme

URIs are stable, **unversioned**, and **source-agnostic**. Agents never encode the backing system in their references. If content moves between Confluence, a git-backed mirror, or another KB, the URI is unchanged; history lives upstream.

```
conventions://<domain>/<slug>      # opinionated standards (CTO/CIO/security/SRE-owned)
runbooks://<slug>                  # operational procedures
templates://<slug>                 # PRD/RFC/ADR/postmortem skeletons
catalog://services/<service-name>  # ownership, on-call, repo links
docs://<space>/<slug>              # curated passthrough to upstream KB
```

Aliases and redirects (`supersedes`) are resolved at the registry layer, not by a separate tool.

### 4.2 Resources and content corpus

Resources are the preferred surface — they're addressable, cacheable, and clients auto-attach them based on `annotations.priority`.

**The URI namespace is owned by Japetus; the content is not.** Production-grade conventions are authored and maintained by their owners in Confluence:

- `conventions://*` — owned by CTO/CIO and domain leads (security, platform/DX, accessibility, compliance)
- `runbooks://*` — owned by SRE / on-call leads
- `templates://*` — owned by platform/DX
- `docs://*` — curated passthrough; ownership lives with the original space owner
- `catalog://services/*` — ownership data; replaces the static stub at Phase 3

The 21 markdown files currently checked into `content/` are **dev/test fixtures**, not production content. Production registry seeds map URIs to Confluence page IDs; the filesystem adapter remains for local development, integration tests, and offline fallback.

Resource metadata shape (load-bearing — drives the agent's fetch decision):

```jsonc
{
  "uri": "conventions://python/style",
  "name": "Python style guide",
  "description": "Talentech Python conventions: formatting, typing, imports, error handling. Supersedes PEP 8 where they conflict.",
  "mimeType": "text/markdown",
  "annotations": {
    "audience": ["assistant"],
    "priority": 0.9,
    "lastModified": "2026-04-15T09:12:00Z"
  }
}
```

**Initial URI namespace** (stable across content moves):

- Conventions: `python/style`, `typescript/style`, `react/component-patterns`, `git/commit-messages`, `git/branch-naming`, `prs/review-checklist`, `prs/description-template`, `security/secrets-handling`, `security/dependency-policy`, `testing/unit`, `testing/integration`, `ado/work-item-conventions`, `accessibility/wcag-baseline`, `compliance/gdpr-pii-handling`
- Runbooks: `incident-response`, `deploy/production`, `rotate-secrets`
- Templates: `prd`, `rfc`, `adr`, `postmortem`

### 4.3 Tools

Three tools. Every tool is a latency cost and a decision the model has to make; the surface stays small on purpose.

| Tool | Purpose |
|---|---|
| `search_standards({ query, scope?, limit? })` | Lexical full-text search over the curated corpus (MiniSearch with field boosts, fuzzy, and prefix matching). Returns URIs and snippets, not full content. `scope` narrows to one corpus kind (`conventions`, `runbooks`, `templates`). Semantic search is not in scope; revisit if corpus exceeds ~200 documents or evidence shows lexical misses on synonym/intent mismatch. |
| `search_docs({ space, query, limit? })` | Search pre-approved KB spaces only. `space` is an enum (`ENG`, `PRODUCT`, `SEC`, extensible) that maps to whatever the current source uses; agents never see the backend. |
| `who_owns({ path })` | Resolve path/service/package to `{ team, primary_contact, slack_channel, repos[] }`. |

**Tools dropped from scope:**

- `current_standard` — its only differentiator was redirect/supersedes resolution; that belongs at the registry layer (URI aliasing), not as a separate tool.
- `get_resource` — the protocol-native `resources/read` covers it; adding a tool alias was speculative.

**Explicitly deferred:** generic `fetch_url(any_url)` (kills curation regardless of backend). Any write tool (scope creep, auth complexity, easy to do badly). Per-repo lookups (belongs in the repo).

### 4.4 Prompts

Prompts are how we replace today's `write-a-prd-irecommend` Mimas skill with something server-provided and centrally versioned. Prompts compose with resources — the prompt body embeds resource URIs that the client resolves at invocation time, so every call gets current templates.

| Prompt | Arguments |
|---|---|
| `write_prd` | `topic`, `product?`, `ticketing?` |
| `review_pr` | `pr_url`, `focus?` (security / performance / accessibility / all) |
| `write_rfc` | `topic` |
| `write_adr` | `decision`, `context?` |
| `incident_postmortem` | `incident_id` |

**Prompts dropped from scope:** `onboard_repo`. Repo scaffolding belongs in Mimas (filesystem write, per-repo intelligence, offline-capable). The implementation in `src/prompts/onboard_repo.ts` is removed as part of this PRD's adoption.

### 4.5 Source adapters and registry

The server is deliberately agnostic about content sources. Every external content source plugs in through a small adapter interface; the agent-facing surface (URIs, tools, prompts) does not change when a source is swapped or added.

**Adapter contract (minimal):**

```ts
interface SourceAdapter {
  id: string;                                  // "filesystem", "confluence", …
  list(scope?: string): Promise<ResourceHandle[]>;
  fetch(id: string): Promise<{ content: string; etag: string; updated: string }>;
  search(query: string, scope?: string): Promise<SearchHit[]>;
  onChange?(cb: (handle: ResourceHandle) => void): Unsubscribe;
}
```

Each adapter normalizes on the way out: content is rendered to markdown, and the `space` enum agents see (`ENG`, `PRODUCT`, `SEC`) is mapped from the backend's native grouping (Confluence space key, etc.).

**Registry seeding.** Each URI resolves through a small registry that maps slug → `(adapter_id, backing_id, owner, topics, priority)`. The registry is seeded from a **static JSON config file checked into the repo**, environment-aware:

- In production, the config maps each URI to `(adapter: "confluence", backing_id: <page-id>)`. Example: `"conventions://python/style"` → Confluence page ID `12345678`.
- In dev / CI / offline, the config maps each URI to `(adapter: "filesystem", backing_id: <relative-path>)`.

PRs against the registry config are the governance gate: adding, retiring, or rerouting a URI is a reviewable code change. Migrating a single resource between sources (Confluence → git mirror, etc.) is a config change; the URI and every consumer stay the same. Confluence-page-label discovery was considered and rejected — it pushes URI ownership to anyone with Confluence write access, weakening the governance model.

The registry layer also resolves **aliases and `supersedes` redirects** — when a convention is renamed or merged, the old URI continues to resolve to the new canonical entry. This replaces the role the dropped `current_standard` tool would have played.

**Per-source concerns inside the adapter:**

- Auth plumbing (Confluence service principal at launch; future adapters bring their own credentials)
- Content-format translation (Confluence storage format → markdown; the current implementation in `src/adapters/confluence.ts` is a minimal regex pipeline and needs hardening before pointing at the full production corpus — flagged as a known gap)
- Change notification mechanism (Confluence: 60-second poll today; webhook later)

### 4.6 Authentication and authorization

- **Transport:** Streamable HTTP.
- **Server auth:** OAuth 2.1 with Entra as the upstream IdP. Claude Code and Cursor handle the browser-based consent flow natively. CI agents use client-credentials.
- **Trust model:** the server holds its own upstream credentials; developers authenticate to Japetus, not to each backend. Org standards are uniformly visible to all authenticated employees, so per-user upstream tokens add friction without buying anything. Japetus is the trust boundary; audit lives here.
- **Confluence auth:** service principal with read access to curated spaces only. Confirmed over on-behalf-of for MVP; revisit only if we ever expose anything with per-user entitlements.
- **Catalog auth:** server-to-server, read-only.
- **MCP token scopes:** `standards:read`, `kb:read`, `catalog:read`. **All authenticated employees who have `kb:read` get access to all approved spaces** — the per-space scope (`kb:read:<space>`) was dropped because the differentiation does not match policy: the curated spaces are exactly the org-wide ones, and we do not need per-space gating today.
- **Adding a new content area** (e.g. `LEGAL`): config-only change — env var + registry-config entry + space enum extension. No token reissue, because the scope is `kb:read`, not `kb:read:<space>`.
- **Audit logging:** every tool call and resource read logged with user `sub`, URI, outcome, latency, cache-hit, and a redacted query summary (see §4.8).

### 4.7 Caching and change notification

- Every resource read returns `etag` and `lastModified` in `_meta`. Clients cache aggressively.
- Server-side cache of rendered resources with a 5-minute TTL and ETag revalidation upstream.
- Adapter `onChange` events invalidate cache entries and fire `notifications/resources/list_changed`. The Confluence adapter polls every 60 seconds today; webhook-based change events are a future improvement.
- When upstream is unavailable, `1002` upstream-unavailable lets clients fall back to a cached copy if present.

### 4.8 Telemetry, audit, and privacy

- **Sinks.** Stdout JSON in dev. Production: AppSignal (operational dashboards, error grouping) and OTEL (metrics export, distributed tracing where relevant). The `AuditSink` interface stays stable; production deploys configure both sinks.
- **Query logging policy.** For tool calls that include user-supplied free text (`search_standards`, `search_docs`):
  - Truncate query to **80 characters** before write.
  - **Regex-strip emails** and obvious-PII patterns at ingest, before the entry leaves the in-process redaction step.
  - **Retention: 90 days**, after which audit entries roll off.
  - **Pre-GA security review** required before opening to a broader audience.
- **What is logged.** Per-event: ISO timestamp, user `sub` (or `anonymous` when auth is off), event kind (`tool_call` / `resource_read`), target (URI or tool name), outcome, latency, cache-hit, error code, redacted query summary.
- **Adoption metrics emitted alongside audit:**
  - Distinct active users over rolling 30 days (distinct `sub`).
  - Tool calls per user per week.
  - First-seen `sub` count per week (net-new adopters).
  - Distinct `sub × clientName × clientVersion` from MCP `clientInfo` captured at `initialize` — proxies install/upgrade tracking without a true install hook.

### 4.9 Error shape

MCP error codes used meaningfully:

- `-32002` — resource not found.
- `1001` — `notEntitled`: token is valid but lacks the required scope.
- `1002` — `upstreamUnavailable`: adapter source is unreachable; client should use cached copy if present.

### 4.10 Client wiring

- **Claude Code:** native remote MCP support. Mimas registers Japetus in `.mcp.json` / `.claude/mcp.json` as part of repo onboarding; OAuth on first use.
- **Cursor:** native remote MCP support. Same Mimas-driven registration into `.cursor/mcp.json`.
- **VS Code Copilot Chat:** MCP supported in agent chat, not in inline completions. Documented as partial support; static `.github/copilot-instructions.md` continues to ship via Mimas for the completion path.
- **CI agents:** narrow-scoped client credentials; do not use user OAuth.
- **Agents without skills support (e.g. Codex):** Mimas still emits `AGENTS.md` files referencing Japetus URIs as authoritative pointers, even if the agent cannot dereference them live.

### 4.11 Deep modules introduced or hardened by this PRD

Three modules carry most of the new behavior and are testable in isolation:

1. **Registry with alias support** (`src/registry.ts`) — encapsulates URI → (adapter, backing_id) routing plus `supersedes` redirect resolution. Stable interface; testing in isolation requires only a config fixture and a stub adapter. Replaces the dropped `current_standard` tool.
2. **Audit redaction** (`src/audit/logger.ts`) — pure transformation from raw audit entry to safe-to-emit entry. Strips emails and obvious-PII patterns, truncates query summaries. Stable interface; tests are table-driven over input/output pairs.
3. **Audit metrics derivation** (new module, e.g. `src/audit/metrics.ts`) — pure function over the audit stream that derives distinct-sub MAU, tool-call counts, first-seen-sub counts, and `sub × clientName × clientVersion` distinct counts. Exposed through OTEL counters / AppSignal-compatible exporters. Tested as a pure reduction over a sequence of audit entries.

Existing modules hardened (no interface changes):

- `src/auth/scopes.ts` — collapse `kb:read:<space>` to `kb:read`; `kbScopeFor` removed; `Space` enum stays as a routing label only.
- `src/server.ts` `scopeForEntry` — drop per-space mapping for `docs://`, return `kb:read`.
- `src/seed.ts` — replace hard-coded list with a config loader; environment-aware (filesystem in dev, Confluence in production).

Modules deleted:

- `src/tools/current_standard.ts`
- `src/tools/get_resource.ts`
- `src/prompts/onboard_repo.ts`

### 4.12 Naming and identity

- **Server name:** `Japetus` (replaces `talentech-standards` in `package.json`, `buildServer({ name })`, README, AGENTS.md, audit log identifiers, MCP `serverInfo`).
- **Repo path:** existing `Japetus` directory; no rename required.

---

## 5. Testing Decisions

A good test for this server exercises **external behavior over the MCP protocol** — what an agent sees on the wire — and avoids coupling to internal data structures. Existing integration tests in `tests/integration/` use the MCP `Client` against a running server with a `FilesystemAdapter` and `DevValidator` (per `docs/ENGINEERING.md`); new tests follow the same shape.

**Tests written for the three deep modules in §4.11:**

1. **Registry with alias support.** Integration-style: given a registry config with `conventions://prs/checklist` aliased to `conventions://prs/review-checklist`, `resources/read` on the alias returns the canonical entry's content with the canonical URI in `_meta`. Covers correctness of redirect, cache key consistency under aliasing, and behavior when an alias target is missing (`-32002`).
2. **Audit redaction.** Unit-level, table-driven: given an entry with an email, a multi-email string, a long query that exceeds 80 chars, and edge cases (no `argsSummary`, only safe content), the redacted entry has the expected shape. Asserts the redaction is applied before any sink sees the entry.
3. **Audit metrics derivation.** Unit-level, pure function: given a sequence of audit entries with mixed `sub` values, kinds, and `clientInfo` annotations, the derived counters (distinct-sub MAU, tool calls per user per week, first-seen-sub per week, distinct `sub × client × version`) are exact.

**Existing tests preserved:**

- All integration tests that exercise tool/prompt registration, scope enforcement, error codes, cache behavior, and change notifications.
- The Confluence adapter has a unit test boundary at the API client; integration tests do not call Confluence (CI requirement).

**Prior art in the codebase:**

- `tests/integration/server.test.ts` — exercises tool/resource flow through the MCP `Client`.
- The `DevValidator` accepts any bearer and grants all scopes for tests; new tests rely on the same.

**Out of scope for testing this PRD:**

- End-to-end tests against a real Confluence tenant (CI must not call Confluence).
- Load testing — deferred until production traffic is observable.
- Browser-based OAuth flow tests for Claude Code / Cursor — those are integration concerns of the agent products, not of Japetus.

---

## 6. Out of Scope

- **Repo scaffolding and `AGENTS.md` generation.** Mimas owns it. The `onboard_repo` prompt is removed as part of this PRD's adoption.
- **Writing back to Confluence or any system of record.** Read-only by design.
- **Replacing CODEOWNERS, the service catalog, or Confluence itself.** Japetus is a curation surface, not a system of record.
- **Arbitrary search across the upstream KB.** Only pre-approved curated spaces.
- **Per-repo or per-project conventions.** Those stay in `AGENTS.md` and Mimas-managed files.
- **Copilot inline completion path.** MCP is not consumed there; Mimas continues to ship static `.github/copilot-instructions.md`.
- **Talentech CLI dependency.** A separate planned PRD; Japetus does not require it. Mimas alone is sufficient for cross-agent registration in this PRD's scope.
- **Semantic search.** Lexical search via MiniSearch is sufficient for the current corpus size and for hand-written, description-rich entries. Revisit if the corpus exceeds ~200 documents or evidence shows lexical misses.
- **Per-space scoping in tokens.** A single `kb:read` covers all approved spaces. No `kb:read:<space>` granularity today.
- **Product-specific convention namespaces** (`conventions://varbi/...` etc.). No product divergence in conventions today; revisit when divergence emerges.
- **`current_standard` and `get_resource` tools.** Behavior absorbed by the registry layer and `resources/read` respectively.

---

## 7. Implementation Status (re-baselined)

This PRD is written against partial implementation. The phases below reflect what's already shipped, what's stubbed, and what's outstanding.

### 7.1 Already shipped

- MCP server with full capability set (resources, tools, prompts, logging, `list_changed`).
- Streamable HTTP transport.
- Filesystem adapter and Confluence adapter (real REST + minimal storage→markdown + 60-second polling for change events).
- Registry with URI → `(adapter, backing_id)` routing.
- Resource cache with 5-minute TTL + ETag revalidation.
- Entra OAuth (jose / JWKS) with `dev`, `off`, `entra` modes.
- Scope enforcement and MCP error codes (`-32002`, `1001`, `1002`).
- Audit logging (stdout JSON; current behavior already truncates query summaries to 80 chars).
- Tools: `search_standards`, `get_resource`, `current_standard`, `search_docs`, `who_owns`.
- Prompts: `write_prd`, `review_pr`, `write_rfc`, `write_adr`, `incident_postmortem`, `onboard_repo`.
- Static catalog stub at `catalog/services.json`.
- 21 markdown fixtures in `content/`.
- Staleness dashboard (separate port).
- 20 implementation slices in `plans/issues/01-foundations.md` … `20-staleness-dashboard.md`.

### 7.2 Hardening / refactor required by this PRD

- Delete `src/tools/current_standard.ts`, `src/tools/get_resource.ts`, `src/prompts/onboard_repo.ts` (and their wiring in `src/server.ts`).
- Add registry alias / `supersedes` resolution (replaces `current_standard`).
- Replace hard-coded `src/seed.ts` with environment-aware config loading; production config maps URIs to Confluence page IDs.
- Collapse `kb:read:<space>` → `kb:read` in `src/auth/scopes.ts` and `src/server.ts` `scopeForEntry`.
- Add email / PII regex stripping to `src/audit/logger.ts` redaction step.
- Add AppSignal and OTEL audit sinks alongside `StdoutAuditSink`.
- Add adoption-metrics module derived from the audit stream; capture MCP `clientInfo` at `initialize`.
- Rename `talentech-standards` → `Japetus` across `package.json`, `buildServer`, README, AGENTS.md, audit identifiers.
- Harden Confluence storage→markdown converter beyond the current minimal regex pipeline.

### 7.3 Outstanding before production rollout

- Identify canonical Confluence pages for each URI in §4.2 with their owners (CTO/CIO and domain leads). Content-ops dependency.
- Publish the production registry config mapping URIs → Confluence page IDs.
- Deploy to **Clever Cloud as a Docker container** using the existing `Dockerfile`. Clever Cloud runs OCI images directly; the same image can be redeployed to any other container host (Azure Container Apps, AWS ECS, Fly.io, a Kubernetes cluster) without rebuild if hosting needs to change later. ADR 001 currently records Azure Container Apps as the deployment target — supersede it with a new ADR that captures the Clever Cloud decision and the Docker-portability rationale.
- Pre-GA security review of audit / telemetry policy.
- Replace static `catalog/services.json` with a real catalog source (system of record TBD).

---

## 8. Rollout

Phasing reflects current state, not greenfield. The original "Phase 0 spike" described in the previous PRD has effectively happened — auth, transport, registry, and a working tool/resource set are running.

**Phase 1 — Hardening (≈3 weeks).** Apply §7.2 deltas. Land the registry config loader, scope collapse, prompt/tool deletions, audit redaction, AppSignal/OTEL sinks, adoption metrics, naming. Keep filesystem adapter as default in dev/CI. End of phase: a Japetus build that, given a production config and Confluence credentials, serves canonical pages.

**Phase 2 — Content migration and internal dogfood (≈4 weeks).** Identify Confluence canonical pages with content owners; publish the production registry config; deploy to **Clever Cloud** as a Docker container with Entra production credentials; dogfood within platform/DX. Validate that Confluence updates propagate within polling interval and that descriptions are load-bearing for agent fetch decisions.

**Phase 3 — Pilot team (4 weeks).** Onboard one named engineering team. Ship Mimas integration (auto-registration of Japetus + URI-referencing `AGENTS.md`). Collect quarterly survey + adoption metrics. The pilot is a hard commitment, not "available but unused" — adoption owner identified explicitly.

**Phase 4 — Org-wide and expand.** Open to all engineering with named owners per resource. Add additional resources, replace `who_owns` static stub with a real catalog source, validate Copilot Chat, ship CI client-credentials flow, evaluate a second source adapter (git mirror) if content owners want PR-reviewed conventions.

---

## 9. Success Metrics

All metrics are derivable from the audit stream and emitted via OTEL to AppSignal — no client-side instrumentation required.

- **Active users (MAU).** Distinct `sub` claims over rolling 30 days. Target: 70 % of engineering by end of Phase 4.
- **Net-new adopters per week.** First-seen `sub` count.
- **Tool / resource calls per active user per week.** Target: ≥ 5.
- **Distinct `sub × clientName × clientVersion`** from MCP `clientInfo` at `initialize`. Proxies installs and tracks client/version distribution (Claude Code, Cursor, etc.).
- **Content freshness.** Median age of most-read resources (computed from `lastModified` weighted by read count). Target: < 90 days.
- **Displacement.** Reduction in repos shipping full conventions inline in `AGENTS.md` vs. linking to Japetus URIs. Proxy for "single source of truth" working; tracked via Mimas-emitted `AGENTS.md` patterns.
- **Pilot signal (Phase 3).** Quarterly survey from the pilot team — does AI-generated code feel more aligned with house style, and would they recommend the platform to other teams.

---

## 10. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Content owners (CTO/CIO and domain leads) don't keep Confluence conventions current → agents quote stale guidance. | Ownership labels on every URI in the registry config; staleness dashboard; quarterly review cadence. Identify owners *before* Phase 2, not after. |
| Latency tax on every turn degrades agent UX. | Aggressive caching; prefer resources over tools; budget every addition against a latency SLO. |
| Curation becomes a bottleneck. | Lightweight contribution flow (PR against the registry config); delegate URI domains to content owners. |
| Copilot's limited MCP support fragments the experience. | Keep static distribution via Mimas for the completion path; explicit product stance, not an accidental gap. |
| Entra or Confluence auth regressions block all agents. | Circuit breaker returns cached content with a clear "stale" indicator (1002); monitored on-call alert. |
| Scope creep — every team wants their thing exposed. | Out-of-scope section is normative. New surfaces require written justification against the curation principle. |
| Server compromise exposes curated content. | Confluence service principal limited to curated spaces; read-only; credential rotation; anomaly monitoring on `tool_call` / `resource_read` rates. Blast radius bounded to content already chosen to be org-visible. |
| "Available but unused" — the common failure mode for internal platform tools. | Named pilot team commitment in Phase 3 before Phase 4 broad rollout; adoption owner identified explicitly, not implicitly. Adoption metrics (§9) inspected weekly during pilot. |
| Confluence storage→markdown converter is minimal regex; production pages may render poorly. | Hardening flagged in §7.2; ship Phase 1 with a known-good fixture set, expand corpus only as conversion quality is verified. |
| Query strings leak sensitive context (active incidents, candidate names). | §4.8 redaction (truncation, email regex-strip, 90-day retention, security review pre-GA). Tightening to hash-only available if security pushes back. |

---

## 11. Open Questions

Resolved during PRD authoring (kept here for traceability):

- Service principal vs. on-behalf-of for Confluence — **service principal**, revisit only if per-user entitlements appear.
- Per-space scopes in tokens — **collapsed** to a single `kb:read`; everyone with KB access gets all approved spaces.
- Product-specific convention namespaces — **not needed**; revisit when divergence emerges.
- `current_standard` and `get_resource` tools — **dropped** (registry aliases + `resources/read`).
- `onboard_repo` prompt — **dropped** (Mimas owns repo scaffolding).
- Audit / telemetry policy — **truncated query (80 chars), 90-day retention, email regex-strip, security review pre-GA**.
- Hosting — **Clever Cloud as a Docker container**, using the existing `Dockerfile`. Image is host-agnostic; portable to any OCI-compatible runtime if hosting needs to change. Supersedes ADR 001's Azure Container Apps decision; a follow-up ADR will record this.
- Registry config strategy — **static JSON config file in repo**. Confluence-label discovery rejected (governance lives with platform owners through PR review, not with anyone who has Confluence write access).

Still open, not blocking Phase 1:

1. **Adapter set at GA.** Confluence only, or Confluence + git-backed mirror for content that benefits from PR-reviewed changes? Adapter model makes this cheap to defer.
2. **`write_prd` ADO handoff.** Should the prompt file the work item itself via the Azure DevOps MCP server, or only produce the text? Leaning text-only for MVP; ADO handoff is a Phase 4 composition.
3. **Catalog system of record at Phase 4.** What replaces the static `catalog/services.json` stub? Backstage, a CMDB, a Confluence page, or something custom? Likely a separate small PRD.
4. **Specific Confluence page IDs per URI.** Content-ops work item for Phase 2; bottlenecked on identifying canonical pages and their owners.

---

## 12. Relationship to Mimas

Japetus and Mimas serve different developer-facing jobs and live in separate repositories, but they compose into one onboarding experience. This PRD assumes a working Mimas (Mimas itself is partially built; gaps are addressed in the Mimas PRD).

The handshake:

1. **Mimas is the entry point** for adding a repo to agentic workflows. The Talentech CLI may eventually invoke the same logic, but it is not on this PRD's critical path.
2. **Mimas registers Japetus** in the agent tools it detects (`.mcp.json` / `.claude/mcp.json` / `.cursor/mcp.json`), so the developer never configures MCP manually.
3. **Generated `AGENTS.md` files reference `conventions://` URIs** instead of inlining standards text. When a convention changes centrally in Confluence, every onboarded repo sees the update on the next agent turn — no PR required.
4. **Mimas reads org defaults from Japetus** during scaffolding (via `conventions://` resources, best-effort with offline fallback to Mimas-bundled defaults), so the files it generates reflect current Talentech standards.
5. **Prompt migrations are one-way:** skills whose job is applying live org standards (e.g. `write-a-prd-irecommend`) migrate to Japetus prompts. Skills whose job is producing or updating static repo files stay in Mimas.

### Other systems

- **Azure DevOps MCP server** (already integrated via Mimas) remains the execution surface for ticketing. Japetus prompts can hand off to it rather than duplicating that capability.
- **`AGENTS.md` convention** stays the primary config mechanism inside repos. It can reference Japetus resources by URI for anything that should be pulled live.
- **Talentech CLI** (separate planned PRD) will handle cross-agent registration and shared bootstrap concerns when built. This PRD does not depend on it.
