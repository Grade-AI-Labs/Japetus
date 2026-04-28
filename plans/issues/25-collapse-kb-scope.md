# 25 — Collapse `kb:read:<space>` → `kb:read`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Drop the per-space scope dimension per PRD §4.6 and §7.2. The differentiation does not match policy — all authenticated employees with KB access get all approved spaces. Adding a new content area (e.g. `LEGAL`) becomes config-only: no token reissue.

The `Space` enum stays as an internal routing label (Confluence space-key mapping); it just no longer drives auth. Supersedes the per-space scope decision in ADR 001.

## Acceptance criteria

- [ ] `src/auth/scopes.ts`: `Scope` type is `'standards:read' | 'kb:read' | 'catalog:read'`. `kbScopeFor` is removed.
- [ ] `src/server.ts` `scopeForEntry` returns `'kb:read'` for any `docs://` URI (not `kb:read:ENG` etc.).
- [ ] Existing integration tests for `docs://` reads updated to use `kb:read`.
- [ ] Integration test: token with `kb:read` reads from any approved space; token without is rejected with `1001`.
- [ ] `npx tsc --noEmit` and `npx vitest run` pass.
- [ ] `docs/features/auth-and-scopes.md` updated to reflect the collapsed scope set.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).

## User stories addressed

- User story 17 (`search_docs` against any approved space).
- User story 25 (add a new content area without reissuing tokens).
- User story 30 (clear `1001` on missing scope).
- PRD §4.6.
