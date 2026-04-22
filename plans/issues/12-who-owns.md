# 12 — `who_owns` tool backed by stub catalog

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement `who_owns({ path })` per PRD §6.3. Returns `{ team, primary_contact, slack_channel, repos[] }` for a given path, service name, or package. For MVP, back this with a static JSON catalog committed to the repo so the tool shape ships now; wiring to the real service catalog is deferred to Phase 3 (PRD §7).

The tool shape is the contract — the MVP stub and the Phase 3 real catalog return identical response structures.

## Acceptance criteria

- [ ] Tool registered with argument `path` (accepts repo path, service name, or package name).
- [ ] Static JSON catalog committed to the repo covers at least five representative services/paths.
- [ ] Returns `{ team, primary_contact, slack_channel, repos[] }` for catalog matches.
- [ ] Returns a clear not-found response for unknown paths (not an empty object).
- [ ] Tool description notes MVP uses a static catalog; response shape is stable across MVP and Phase 3.
- [ ] Structure of the stub makes a later swap-in of the real catalog a localized change.

## Blocked by

- Blocked by [02-server-skeleton.md](02-server-skeleton.md)

## User stories addressed

- Use case 3 ("Who owns `talentech-ats-core`?").
- PRD §6.3 (Tools), PRD §7 Phase 3 (real catalog wiring deferred).
