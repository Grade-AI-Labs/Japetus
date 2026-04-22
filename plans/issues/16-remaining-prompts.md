# 16 — Prompts: `write_rfc`, `write_adr`, `incident_postmortem`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Remaining MVP prompts from PRD §6.4. Each composes the corresponding template (and runbook, where relevant) from the seeded corpus.

- `write_rfc({ topic })` — composes `templates://rfc`.
- `write_adr({ decision, context? })` — composes `templates://adr`.
- `incident_postmortem({ incident_id })` — composes `templates://postmortem` and `runbooks://incident-response`.

## Acceptance criteria

- [ ] `write_rfc` registered with argument `topic`; body embeds `templates://rfc`.
- [ ] `write_adr` registered with arguments `decision` and optional `context`; body embeds `templates://adr`.
- [ ] `incident_postmortem` registered with argument `incident_id`; body embeds `templates://postmortem` and `runbooks://incident-response`.
- [ ] All three prompts resolve embedded URIs at invocation.
- [ ] Integration test covers each prompt end-to-end.

## Blocked by

- Blocked by [09-seed-corpus.md](09-seed-corpus.md)

## User stories addressed

- PRD §6.4 (Prompts).
- PRD §7 Phase 2 (GA to engineering).
