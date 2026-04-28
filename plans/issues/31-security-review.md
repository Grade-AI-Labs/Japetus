# 31 — Pre-GA security review of audit and telemetry policy

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL

## What to build

Run the security sign-off required by PRD §4.8 before opening Japetus to a broader audience. Walk security through:

- Redaction policy and the `redact()` implementation (email regex-strip, 80-char truncation, where it sits in the pipeline).
- 90-day audit retention; how it is enforced for AppSignal and OTEL backends (retention may live at the backend rather than in code — confirm with security).
- AppSignal data residency and contractual handling.
- OTEL exporter destinations and what they can see.
- Confluence service principal scope (read-only, curated spaces).
- MCP token scopes and the trust boundary.

Address any tightening security requires (e.g. drop to hash-only query summaries, shorter retention, additional PII patterns).

## Acceptance criteria

- [ ] Security review session held; outcomes captured in a written record (PR description, ADR, or linked doc).
- [ ] Required tightening (if any) implemented as follow-up PRs and merged before GA.
- [ ] Sign-off recorded — named approver, date, scope of approval.
- [ ] If retention is enforced at the AppSignal/OTEL backend rather than in code, the backend configuration is documented.

## Blocked by

- Blocked by [26-audit-redaction.md](26-audit-redaction.md) (redaction must be implemented to review).
- Blocked by [27-audit-sinks-appsignal-otel.md](27-audit-sinks-appsignal-otel.md) (sink destinations must be chosen).
- Blocked by [28-adoption-metrics.md](28-adoption-metrics.md) (metrics surface must be reviewable).

## User stories addressed

- User story 21 (audit trail with redaction).
- PRD §4.8, §7.3.
