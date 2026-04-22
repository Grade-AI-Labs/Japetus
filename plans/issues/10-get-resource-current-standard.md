# 10 — `get_resource` + `current_standard` tools

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Two small tools from PRD §6.3:

- `get_resource({ uri })` — tool-shaped alias for `resources/read` that returns content + `etag`. Some clients prefer tool-shaped access.
- `current_standard({ topic })` — resolves a topic to "the canonical doc for X right now," handling redirects when standards move or merge. Backed by `supersedes` metadata in the registry (PRD §6.1).

## Acceptance criteria

- [ ] `get_resource` registered; returns `{ content, etag }` for a valid URI.
- [ ] `get_resource` returns the same content/etag as `resources/read` for the same URI.
- [ ] `current_standard` registered with argument `topic`.
- [ ] Registry supports a `supersedes` field: URI A superseded by URI B resolves to B.
- [ ] Integration test covers a supersedes chain (at least one redirect).
- [ ] Tool descriptions explain when to use `current_standard` vs `search_standards`.

## Blocked by

- Blocked by [09-seed-corpus.md](09-seed-corpus.md)

## User stories addressed

- PRD §6.3 (Tools).
- PRD §6.1 (`supersedes` metadata handles redirects).
