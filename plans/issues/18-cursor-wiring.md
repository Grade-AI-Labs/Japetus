# 18 — Cursor client wiring + onboarding docs

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Register `grade-standards` as a remote MCP server in Cursor, validate the OAuth flow works end-to-end, and ship an onboarding doc for engineers covering both Claude Code and Cursor. Per PRD §3, "Works today with Claude Code and Cursor" is a Goal — this closes the Cursor half.

Also document the VS Code Copilot Chat story as partial support (agent chat only, not inline completions) per PRD §6.9. Continue to ship static `.github/copilot-instructions.md` via Mimas for the completion path — this is an explicit product stance, not an accidental gap (PRD §9 risk mitigation).

## Acceptance criteria

- [ ] Cursor registration instructions documented (project and user-level).
- [ ] OAuth consent flow verified in Cursor end-to-end on a real server.
- [ ] A resource attach and a prompt invocation verified in Cursor.
- [ ] Onboarding doc covers: Claude Code setup, Cursor setup, what to expect first time, troubleshooting.
- [ ] Copilot Chat partial support documented with rationale and link to the Mimas static distribution.
- [ ] Doc linked from the server README.

## Blocked by

- Blocked by [03-entra-oauth.md](03-entra-oauth.md)

## User stories addressed

- PRD §3 Goals ("Works today with Claude Code and Cursor").
- PRD §6.9 (Client wiring).
- PRD §7 Phase 2.
