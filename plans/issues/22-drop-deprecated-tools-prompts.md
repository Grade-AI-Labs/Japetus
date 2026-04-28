# 22 — Drop `current_standard`, `get_resource`, `onboard_repo`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Remove the three surfaces that fell out of scope per PRD §4.3, §4.4, and §6:

- `src/tools/current_standard.ts` — its supersedes/redirect role moves to the registry layer (slice 23).
- `src/tools/get_resource.ts` — `resources/read` is the protocol-native equivalent.
- `src/prompts/onboard_repo.ts` — Mimas owns repo scaffolding.

Strip the `register*` calls from `src/server.ts` and any references in tests. Confirm the surface from an MCP `Client` shows three tools (`search_standards`, `search_docs`, `who_owns`) and five prompts (`write_prd`, `review_pr`, `write_rfc`, `write_adr`, `incident_postmortem`).

## Acceptance criteria

- [ ] Three deleted files no longer exist.
- [ ] `src/server.ts` no longer imports or registers them.
- [ ] `tools/list` returns exactly: `search_standards`, `search_docs`, `who_owns`.
- [ ] `prompts/list` returns exactly: `write_prd`, `review_pr`, `write_rfc`, `write_adr`, `incident_postmortem`.
- [ ] No dangling references in tests (`grep -r "current_standard\|get_resource\|onboard_repo" src/ tests/` returns no hits).
- [ ] `npx tsc --noEmit` and `npx vitest run` pass.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing — avoid rename churn).

## User stories addressed

- PRD §6 "Out of Scope" — formalizes the surface reduction.
- Indirectly supports stories 8–11, 15, 16, 17 by keeping the tool/prompt surface focused.
