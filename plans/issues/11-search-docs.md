# 11 — `search_docs` tool over pre-approved spaces

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement `search_docs({ space, query, limit? })` per PRD §6.3. The `space` argument is an opaque enum (`ENG`, `PRODUCT`, `SEC`) that adapters map to their native grouping — agents never see the backend (Confluence space key, etc.).

Unlike `search_standards` (which searches the curated corpus of conventions/runbooks/templates), this searches pre-approved KB spaces through the `docs://` URI scheme. Still curated — not a generic KB search.

## Acceptance criteria

- [ ] Tool registered with arguments `space`, `query`, optional `limit`.
- [ ] `space` enum is backend-neutral; validated against a fixed allowlist.
- [ ] Confluence adapter maps `ENG`/`PRODUCT`/`SEC` to configured Confluence space keys.
- [ ] Returns `{ uri, snippet, score }[]` with `docs://<space>/<slug>` URIs.
- [ ] Unknown `space` returns a clear error (not a silent empty result).
- [ ] Tool description is explicit that this searches pre-approved spaces only — not the whole KB.

## Blocked by

- Blocked by [05-confluence-adapter.md](05-confluence-adapter.md)
- Blocked by [09-seed-corpus.md](09-seed-corpus.md)

## User stories addressed

- PRD §6.3 (Tools).
- Supports use case 5 when the target doc lives in a KB space rather than the curated corpus.
