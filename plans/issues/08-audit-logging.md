# 08 — Audit logging

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Log every tool call and every resource read with user, URI (or tool name + args), and timestamp, per PRD §6.6. Ship logs to the org-standard sink. Retention follows existing policy.

User identity comes from the validated Entra token claims (slice 03). Per PRD §10 open question #5, logging query strings is probably fine with retention limits — confirm with security and record the decision here.

## Acceptance criteria

- [ ] Every `tools/call` emits an audit log entry: user, tool name, argument summary, timestamp, outcome.
- [ ] Every `resources/read` emits an audit log entry: user, URI, timestamp, cache hit/miss.
- [ ] User is resolved from OAuth token claims and included in every entry.
- [ ] Logs shipped to the org-standard sink (document which one in the repo).
- [ ] Telemetry-privacy decision recorded in the repo (query strings: yes/no, retention limit) with sign-off reference.
- [ ] No sensitive payload content logged (resource bodies, secret tokens).

## Blocked by

- Blocked by [03-entra-oauth.md](03-entra-oauth.md)

## User stories addressed

- PRD §6.6 (Audit logging).
- PRD §10 open question #5 (telemetry privacy).
