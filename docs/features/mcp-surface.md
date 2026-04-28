# MCP Surface — Tools & Prompts

> **Area:** mcp-surface
> **Status:** Active
> **Last updated:** 2026-04-22

## Overview

The MCP surface is what coding agents see: a set of named tools and named prompts, registered on the `McpServer` and reachable over Streamable HTTP. Tools are narrow, opinionated RPCs with load-bearing descriptions that drive the agent's decision about when to call them. Prompts are reusable workflows that embed curated resource URIs, resolved at invocation time — the prompt body picks up today's templates without needing redeployment. Together they form the "tools + prompts" half of the MCP primitive triad; resources (the other half) are covered by `adapter-layer`.

## Responsibilities

- Register every tool and prompt on the `McpServer` high-level API
- Enforce auth scopes on every tool call before doing work
- Emit an audit entry (`ok` or `error`) for every tool call
- Keep tool input schemas tight via `zod`
- Keep descriptions load-bearing (what it does, when to use it, what NOT to use it for) per PRD §6.2
- Resolve embedded resource URIs inside prompts at invocation time

What this feature does NOT own:

- Resource/source content — that's `adapter-layer`
- Token validation — that's `auth-and-scopes` (this feature just calls `requireScope`)
- The Streamable HTTP wiring — that's `src/transport.ts`

## Key concepts

- **Tool**: a callable RPC with a typed input schema and a description; agents pick tools by reading descriptions, so descriptions are part of the contract
- **Prompt**: a named template taking arguments; returns a sequence of `PromptMessage`s, some of which embed `resource` URIs the client resolves
- **Embedded resource**: a prompt content item of type `resource` with a URI; the client fetches it when rendering the prompt, so updates to the backing resource take effect without re-registering the prompt
- **Structured content**: tools return both human-readable `content` (JSON text) and machine-readable `structuredContent` so both classes of consumer work
- **Load-bearing description**: descriptions are written as targeting copy — they must say what the tool covers, when to use it, and what to use instead; otherwise agents pick the wrong tool

---

## Tool inventory

| Tool               | File                                                                   | Scope            | Purpose                                                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_standards` | [`src/tools/search_standards.ts`](../../src/tools/search_standards.ts) | `standards:read` | Lexical search over the curated corpus (conventions + runbooks + templates); returns URIs + snippets, not bodies. Read full content via the protocol-native `resources/read`. |
| `search_docs`      | [`src/tools/search_docs.ts`](../../src/tools/search_docs.ts)           | `kb:read`        | Search pre-approved KB spaces (`ENG`, `PRODUCT`, `SEC`); backend-neutral                                                                                                      |
| `who_owns`         | [`src/tools/who_owns.ts`](../../src/tools/who_owns.ts)                 | `catalog:read`   | Resolve a path/service/package to owning team, contact, Slack channel, repos                                                                                                  |

> **Removed in PRD §4.3 / §6**: `get_resource` (replaced by the protocol-native `resources/read`) and `current_standard` (its supersedes/redirect role moved into the registry layer as alias resolution).

## Prompt inventory

| Prompt                | File                                                                             | Args                              | Embedded URIs                                                           |
| --------------------- | -------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `write_prd`           | [`src/prompts/write_prd.ts`](../../src/prompts/write_prd.ts)                     | `topic`, `product?`, `ticketing?` | `templates://prd`, `conventions://ado/work-item-conventions`            |
| `review_pr`           | [`src/prompts/review_pr.ts`](../../src/prompts/review_pr.ts)                     | `pr_url`, `focus?`                | review-checklist, description-template, plus focus-specific conventions |
| `write_rfc`           | [`src/prompts/write_rfc.ts`](../../src/prompts/write_rfc.ts)                     | `topic`                           | `templates://rfc`                                                       |
| `write_adr`           | [`src/prompts/write_adr.ts`](../../src/prompts/write_adr.ts)                     | `decision`, `context?`            | `templates://adr`                                                       |
| `incident_postmortem` | [`src/prompts/incident_postmortem.ts`](../../src/prompts/incident_postmortem.ts) | `incident_id`                     | `templates://postmortem`, `runbooks://incident-response`                |

> **Removed in PRD §4.4 / §6**: `onboard_repo` — repo scaffolding is owned by Mimas, not Japetus.

---

## Contracts

Every tool file exports:

```ts
export function register<Name>(server: McpServer, ctx: AppContext): void;
```

Every prompt file exports:

```ts
export function register<Name>(server: McpServer): void;
```

Both are called from `buildServer(ctx)` in [`src/server.ts`](../../src/server.ts). Registration order doesn't matter; the MCP SDK builds a flat map.

### Tool call lifecycle

```
tools/call { name, arguments }
  → zod validates arguments (throws InvalidParams -32602 if shape is wrong)
  → principalFromExtra(extra) → Principal | undefined
  → requireScope(principal, scope, target?) → throws 1001 if missing
  → business logic (registry / adapter / cache / catalog lookup / …)
  → audit({ kind: tool_call, outcome: ok|error, latencyMs, argsSummary })
  → return { content: [{ type: 'text', text: JSON }], structuredContent }
```

### Prompt invocation lifecycle

```
prompts/get { name, arguments }
  → McpServer validates args against the prompt's argsSchema
  → the prompt function composes messages, embedding resource URIs
  → return { messages: [...] }
  → client resolves embedded resource URIs at render time
```

---

## Adding a new tool

1. Create `src/tools/<snake_case_name>.ts` exporting `register<Name>(server, ctx)`.
2. Inside, call `server.registerTool(name, { description, inputSchema: { ... zod ... } }, handler)`.
3. In the handler: call `principalFromExtra(extra)` → `requireScope(principal, scope)` before any work.
4. Emit an `audit(...)` entry on both ok and error paths.
5. Return `{ content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }], structuredContent: payload }`.
6. Wire `register<Name>(server, ctx)` into `buildServer` in `src/server.ts`.
7. Add an integration test exercising the new tool in `tests/integration/server.test.ts`.

## Adding a new prompt

1. Create `src/prompts/<snake_case_name>.ts` exporting `register<Name>(server)`.
2. Inside, call `server.registerPrompt(name, { description, argsSchema: { ... zod ... } }, ({ ...args }) => ({ messages: [...] }))`.
3. Use `userText(text)` and `embed(uri)` from `src/prompts/shared.ts` to build messages.
4. Wire into `buildServer` in `src/server.ts`.
5. Add a prompt integration test (mirror the `write_prd` test pattern).

---

## Descriptions as contract

The description string on every tool/prompt is targeting copy — the agent decides whether to call it based on this text alone. Two rules (PRD §6.2):

1. **Positive framing**: "Use this when you want X; returns Y."
2. **Negative framing**: "Do NOT use this for Z — see other_tool instead."

Never leave the description blank; never write a description that just restates the name. Reviewers should push back on PRs that do either.

---

## Testing

### Integration Tests

- **Location**: [`tests/integration/server.test.ts`](../../tests/integration/server.test.ts)
- **Covered tools**: `search_standards`, `who_owns` (both hit and miss paths). Resource reads are exercised via the protocol-native `resources/read`.
- **Covered prompts**: `write_prd` — verifies embedded URIs are present in the returned messages
- **Setup**: `DevValidator` grants all scopes; `FilesystemAdapter` on a per-test tmpdir seeded with fixture markdown

### Gaps (explicit TODOs)

- `search_docs`: no integration test yet — add when a `docs://`-scoped resource is added to the seed
- `review_pr`, `write_rfc`, `write_adr`, `incident_postmortem`: no integration tests yet
- Scope denial (`1001`) on a tool call — test covers resource path implicitly; add an explicit tool-level test

---

## Error Handling & Edge Cases

### Common Errors

- **Invalid tool input**: zod rejection → MCP error `-32602` (InvalidParams)
- **Missing scope**: `notEntitled` → MCP error `1001`
- **Unknown URI argument** (resources/read with an unknown URI): `resourceNotFound` → MCP error `-32002`
- **Upstream unavailable during a tool call** (adapter throws): `upstreamUnavailable` → MCP error `1002`
- **`who_owns` not-found**: returned as `isError: true` + `{ found: false, path }` structured content rather than an MCP error — tools don't throw for "no match" cases, they return a null-result shape

### Edge Cases

- **`search_standards` with an empty query**: zod schema enforces `min(1)`; `-32602` on empty string
- **`search_docs` with an unknown space**: enum validation fails at the zod layer; `-32602`
- **Alias URI in `resources/read`**: the registry resolves to the canonical entry; `_meta` always carries the canonical URI (cache key is the canonical URI, not the alias)

---

## Security Considerations

- Every tool + prompt argument is validated at the zod boundary before it reaches adapters, auth, or audit logic
- Tool descriptions must not leak internal system details (hostnames, table names, secret paths) — they are shown to every authenticated agent
- `who_owns` static catalog at MVP contains no PII; if the Phase 3 real catalog adds personal data, revisit retention and masking

## Performance Considerations

- `search_standards` rebuilds its `minisearch` index lazily with a 5-minute TTL; first call after TTL expiry pays the rebuild cost
- Tool latency budget: most tools complete in < 20 ms; `search_standards` first call is dominated by adapter fetch for each corpus entry; subsequent calls serve from cache
- Prompts are free — they're just message-list construction; latency is entirely in the agent-side resource resolution of embedded URIs

## Known Issues and Limitations

1. **Prompt embed placeholder text is empty.** We set `text: ''` in `EmbeddedResource` because clients resolve the URI themselves; some strict clients may not like the empty string. Observed to work with Claude Code and Cursor; flag if a client misbehaves.
2. **No streaming tool responses.** All tools return a single JSON payload. If we add long-running operations (e.g. multi-page Confluence search), introduce a streaming variant.
3. **Index rebuild is full.** Incremental updates from `onChange` events would be cheaper; currently any change triggers a full rebuild on the next query after TTL expires.

## Related Features

- **adapter-layer**: tools + prompts route through the registry and adapters to reach backing content
- **auth-and-scopes**: every tool hooks through `requireScope`; prompts inherit auth from the transport layer
- **Mimas `write-a-prd-irecommend` skill**: PRD §11 migration path — `write_prd` is the server-provided replacement

## Changelog

| Date       | Change                |
| ---------- | --------------------- |
| 2026-04-22 | Initial documentation |
