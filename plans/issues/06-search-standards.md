# 06 — `search_standards` tool

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement `search_standards({ query, scope?, limit? })` as defined in PRD §6.3. Returns URIs and snippets (not full content), across all registered adapters' curated corpus. Semantic search (embeddings + vector index, or a good BM25 fallback) over the curated corpus — not the full upstream KB.

This is the first tool-shaped primitive and completes the MCP surface triad (resources + tools + prompts-later).

## Acceptance criteria

- [ ] Tool registered with arguments matching PRD §6.3: `query`, optional `scope`, optional `limit`.
- [ ] Tool description written to drive selection — explains it searches curated standards, not the whole KB.
- [ ] Returns `{ uri, snippet, score }[]` — URIs only, not full content.
- [ ] Searches across every adapter registered in the registry.
- [ ] `scope` parameter narrows results (e.g. `conventions`, `runbooks`, `templates`).
- [ ] Integration test: query for "PII" returns `conventions://compliance/gdpr-pii-handling` in top results (use case 5).
- [ ] Latency budget met (resources preferred over tools per PRD §6.3, but this still needs to feel snappy).

## Blocked by

- Blocked by [04-adapter-filesystem-registry.md](04-adapter-filesystem-registry.md)

## User stories addressed

- Use case 5 ("What's the latest guidance on handling candidate PII?").
- PRD §6.3 (Tools).
