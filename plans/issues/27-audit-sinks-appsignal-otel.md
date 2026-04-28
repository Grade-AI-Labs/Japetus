# 27 — AppSignal and OTEL audit sinks

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement two new `AuditSink` implementations per PRD §4.8: `AppSignalAuditSink` (operational dashboards, error grouping) and `OtelAuditSink` (metrics + tracing export). Both are env-var-controlled and can run alongside the existing `StdoutAuditSink`. Default in dev/test stays stdout.

The existing `AuditSink` interface is already abstract; this slice is purely additive — no changes to the interface, no changes to `audit()` callers. Sinks are composable: the production wiring picks up zero or more sinks from env vars and forwards every entry to all of them.

## Acceptance criteria

- [ ] `src/audit/appsignal.ts` implements `AuditSink` using AppSignal's Node SDK; activated when `APPSIGNAL_PUSH_API_KEY` (or the standard AppSignal env var) is set.
- [ ] `src/audit/otel.ts` implements `AuditSink` emitting OTEL events/metrics; activated when `OTEL_EXPORTER_OTLP_ENDPOINT` is set.
- [ ] A composite `MultiSink` (or equivalent fan-out) forwards every entry to all configured sinks.
- [ ] Sink wiring lives in a single setup function, called once at startup based on env vars.
- [ ] Redaction (slice 26) is applied before any sink sees the entry — verified by an integration test using a stub sink.
- [ ] Failure of one sink does not crash the server or block other sinks.
- [ ] Integration tests use a stub sink that captures entries; AppSignal and OTEL SDK calls are stubbed (no real network calls in CI).
- [ ] `docs/features/auth-and-scopes.md` (or a new `docs/features/audit.md`) documents the sink configuration.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).
- Blocked by [26-audit-redaction.md](26-audit-redaction.md) (redaction must precede sinks).

## User stories addressed

- User story 21 (audit trail).
- User story 28 (OTEL metrics export to AppSignal).
- PRD §4.8.
