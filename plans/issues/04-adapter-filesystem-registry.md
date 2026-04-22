# 04 — Source adapter interface + filesystem adapter + URI registry

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Introduce the `SourceAdapter` abstraction from PRD §6.5 and a URI registry that maps slug → `(adapter_id, backing_id)`. Implement a filesystem adapter that reads markdown from a `content/` directory. Migrate the hardcoded resource from slice 02 to flow through the registry → filesystem adapter. Agent-facing behavior is unchanged.

Filesystem adapter is intentionally the first implementation so integration tests can run without Confluence (per PRD §6.5: "Integration tests use a filesystem adapter, keeping CI off Confluence entirely.").

## Acceptance criteria

- [ ] `SourceAdapter` interface matches the contract in PRD §6.5 (`id`, `list`, `fetch`, `search`, optional `onChange`).
- [ ] Filesystem adapter implements the full interface; `fetch` returns `{ content, etag, updated }` from file contents + mtime/hash.
- [ ] URI registry resolves at least `conventions://prs/review-checklist` through the filesystem adapter.
- [ ] Slice-02 resource is no longer hardcoded in the server — its content lives in `content/` on disk.
- [ ] Adding a new resource is a two-step change: drop a markdown file in `content/` + add a registry entry.
- [ ] Integration test suite runs end-to-end using the filesystem adapter (no network deps).

## Blocked by

- Blocked by [02-server-skeleton.md](02-server-skeleton.md)

## User stories addressed

- PRD §6.5 (Source adapters).
- Unblocks use cases 1–5 by making new resources trivial to add.
