# `src/` Instructions

This directory contains the `Japetus` MCP server — a TypeScript/Node service that speaks the Model Context Protocol over Streamable HTTP, validates Entra OAuth tokens, and projects curated content from pluggable source adapters to MCP-capable coding agents. (Renamed from `talentech-standards`.)

You MUST follow:

- Root TDD and TypeScript correctness rules (see [`/AGENTS.md`](../AGENTS.md))
- [`docs/ENGINEERING.md`](../docs/ENGINEERING.md) standards
- PRD contracts in [`plans/prds/MCP.md`](../plans/prds/MCP.md) — especially §6 (API surface), §6.5 (adapters), §6.6 (auth/scopes), §6.7 (caching), §6.8 (error shapes)

## Layout

Code is organized **by kind**, not by feature:

- `server.ts` — MCP server entry; composes registry, cache, adapters, tools, prompts; exposes `buildServer()` and `main()`
- `transport.ts` — Streamable HTTP wiring; resolves bearer → `AuthInfo` before delegating to the SDK transport
- `registry.ts` — URI → `(adapter, backing_id)` resolver; supports `aliases` so renamed/merged URIs keep resolving to the canonical entry
- `cache.ts` — ETag + TTL cache of `FetchResult`s
- `errors.ts` — MCP error code constants and typed helpers (`resourceNotFound`, `notEntitled`, `upstreamUnavailable`)
- `seed.ts` — the MVP corpus registry entries; edit here to add/remove a resource
- `staleness.ts` — HTTP dashboard for resource age + read counts
- `adapters/` — `SourceAdapter` contract + filesystem and Confluence implementations
- `tools/` — one file per MCP tool; each exports `register<Name>(server, ctx)`
- `prompts/` — one file per MCP prompt; each exports `register<Name>(server)`
- `auth/` — Entra JWKS validator, dev validator, scope types and enforcement
- `audit/` — audit sink and `audit(entry)` helper

## Focus here on

- **MCP contracts over implementation cleverness.** Resource URIs, tool/prompt shapes, scope names, and error codes are the contract with every agent on the planet. Never change them without updating `docs/features/<area>.md` and noting the break in a PR description.
- **Descriptions are load-bearing.** Tool/prompt/resource descriptions drive the agent's fetch decisions (PRD §6.2). When adding one, write it like a tool description — what it covers, when to use it, what it supersedes.
- **Adapter symmetry.** Every adapter implements the same `list/fetch/search/onChange` contract. Agents must not be able to tell which backend served a resource — keep the surface uniform.
- **Auth + audit on every path.** New tools and resource reads call `requireScope(...)` and emit an `audit(...)` entry on both ok and error paths. Tests must cover the 401/403/-32002/1001/1002 cases.
- **Filesystem-only integration tests.** Never reach for Confluence, Entra, or external network in `tests/`. Use the filesystem adapter and `DevValidator`.
- **Registry-first.** New resources are added in `seed.ts`; new adapters are registered in `buildAdapters()` via env-var config. Don't scatter registrations across files.

If a change introduces or modifies a feature area (tool surface, URI namespace, adapter contract, auth scope, error code), follow [`docs/AGENTS_FEATURES.md`](../docs/AGENTS_FEATURES.md).
