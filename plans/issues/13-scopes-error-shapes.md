# 13 — Scope-based authorization + correct error shapes

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Enforce MCP token scopes per PRD §6.6 and get the error shapes right per PRD §6.8. Agents behave very differently for 401 vs 403 vs 404, and custom `1001`/`1002` drive different client-side fallback behavior — getting this right is a small investment for a large correctness win.

Scopes (from PRD §6.6):

- `standards:read` — curated conventions/runbooks/templates.
- `kb:read:<space>` — pre-approved KB spaces.
- `catalog:read` — ownership/catalog data.

Error codes (from PRD §6.8):

- `-32002` resource not found.
- Custom `1001` authenticated but not entitled to this space/resource.
- Custom `1002` upstream source unavailable; client should use cached copy.
- 401 missing/invalid token; 403 missing scope; 404 unknown URI.

## Acceptance criteria

- [ ] Every tool and resource route declares its required scope.
- [ ] Missing bearer token → 401 with standard shape.
- [ ] Valid token with missing scope → 403 (MCP custom `1001` for entitlement denial at the resource level).
- [ ] Unknown URI → `-32002`.
- [ ] Upstream source failure → `1002`; integration test covers the fallback path.
- [ ] CI token example using `standards:read` only demonstrates narrower tokens work per PRD §6.6.
- [ ] Integration tests cover each error path (401/403/404/1001/1002).

## Blocked by

- Blocked by [03-entra-oauth.md](03-entra-oauth.md)
- Blocked by [04-adapter-filesystem-registry.md](04-adapter-filesystem-registry.md)

## User stories addressed

- PRD §6.6 (Scopes on the MCP token).
- PRD §6.8 (Error shape).
