# 07 — ETag caching + `resources/list_changed` notifications

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement the caching and change-notification contract from PRD §6.7 so agents can fetch conventions on every relevant turn without tax:

- Every resource read returns `etag` and `lastModified`.
- Server-side cache of rendered resources with a short TTL (~5 min) and ETag revalidation upstream.
- `notifications/resources/list_changed` fires when an adapter reports the curated corpus has changed.
- Each adapter emits change events however it can: filesystem adapter via fswatch or similar; Confluence adapter via webhook if available, poll otherwise.

## Acceptance criteria

- [ ] `etag` and `lastModified` present in every `resources/read` response.
- [ ] Server cache with TTL (configurable, default ~5 min) serves repeat reads without hitting upstream.
- [ ] ETag revalidation against upstream when cache entry expires.
- [ ] Filesystem adapter emits change events on file write; server fires `notifications/resources/list_changed`.
- [ ] Confluence adapter emits change events (webhook or poll — document choice).
- [ ] Integration test: modifying a filesystem-backed resource triggers a `list_changed` notification within the expected window.

## Blocked by

- Blocked by [04-adapter-filesystem-registry.md](04-adapter-filesystem-registry.md)

## User stories addressed

- Supports every use case by making live fetches cheap.
- PRD §6.7 (Caching and change notification).
- PRD §9 risk mitigation: "Latency tax on every turn degrades agent UX."
