# 24 — Static JSON registry config loader (env-aware)

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Replace the hard-coded `MVP_CORPUS` array in `src/seed.ts` with a config-driven loader per PRD §4.5 and §7.2. Each URI is mapped in a JSON file to `(adapter_id, backing_id, owner, topics, priority, aliases?)`; the adapter/backing-id pair lets the same URI point at filesystem fixtures in dev and Confluence pages in production without code changes.

Validate the config with `zod` at startup; reject invalid configs with a clear error before the server begins serving. Provide a `config/registry.dev.json` (filesystem-backed, mirrors today's seed) and a `config/registry.production.example.json` (Confluence-backed, with placeholder page IDs — actual IDs land in slice 30). The active config path is controlled by `REGISTRY_CONFIG` env var.

## Acceptance criteria

- [ ] `config/registry.dev.json` checked in; loads identically to today's `MVP_CORPUS` entries.
- [ ] `config/registry.production.example.json` checked in with placeholder Confluence IDs (e.g. `"<TBD-page-id>"`).
- [ ] `REGISTRY_CONFIG=path/to/file.json` controls which config the server loads at startup; default is `config/registry.dev.json`.
- [ ] Zod schema rejects malformed configs with a clear startup error.
- [ ] Integration test loads a fixture config and verifies the registry exposes its entries.
- [ ] Integration test rejects a malformed config and exits non-zero.
- [ ] `src/seed.ts` is removed or reduced to a thin re-export of the loader.
- [ ] Existing integration tests continue to pass against the dev config.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).
- Blocked by [23-registry-aliases.md](23-registry-aliases.md) (config schema must include `aliases`).

## User stories addressed

- User story 23 (add a new convention URI by editing config, no code change).
- PRD §4.5 (Registry seeding), §7.2.
