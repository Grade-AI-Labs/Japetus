# 21 — Rename `talentech-standards` → `Japetus`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Full rename sweep across the codebase per PRD §4.12 and §7.2. Lands first so subsequent slices in this phase do not have to fight rename churn in parallel branches.

## Acceptance criteria

- [ ] `package.json` `name` and `description` updated.
- [ ] `buildServer({ name: 'Japetus', ... })` in `src/server.ts`; MCP `serverInfo` reports `Japetus` on `initialize`.
- [ ] Server startup log identifies as `Japetus`.
- [ ] `README.md` and `AGENTS.md` describe the project as `Japetus` (single-line "renamed from `talentech-standards`" note acceptable).
- [ ] `Dockerfile` labels (if any reference the old name) updated.
- [ ] `grep -ri "talentech-standards"` returns no hits outside historical PRD/ADR copy and `plans/issues/01-20-*.md` (existing slice files preserved as historical record).
- [ ] All existing tests pass (`npx vitest run`, `npx tsc --noEmit`, `npm run lint`).
- [ ] Repo path on disk (`Japetus/`) is unchanged — no directory rename required.

## Blocked by

- None — can start immediately.

## User stories addressed

- PRD §4.12 (Naming and identity).
- Cosmetic; no specific user story directly affected.
