# Audit, Redaction & Telemetry

> **Area:** audit
> **Status:** Active
> **Last updated:** 2026-04-28

## Overview

Every tool call and every resource read in Japetus produces an audit entry. The entry is passed through a **pure redaction step** before any sink sees it (PRD §4.8): emails are regex-stripped, free-text query summaries are truncated to 80 characters, and the redacted shape is what downstream sinks (stdout in dev, AppSignal + OTEL in production) emit. Adoption metrics — distinct active users (MAU), tool calls per user per week, first-seen-`sub` adopters per week, and distinct `sub × clientName × clientVersion` — are derived as a pure reduction over the same audit stream.

## Responsibilities

- Emit one audit entry per tool call and per resource read, on both ok and error paths
- Apply the redaction policy in a pure, table-driven step **before** any sink sees the entry
- Forward redacted entries to all configured sinks (stdout, AppSignal, OTEL) without one sink's failure crashing the others
- Capture the MCP `clientInfo` (name + version) at `initialize` so adoption metrics can derive `sub × client × version`
- Track read counts on the staleness dashboard (process-local; multi-instance deployments undercount)

What this feature does NOT own:

- Token validation or scope enforcement (`auth-and-scopes`)
- Resource fetch / cache / change notifications (`adapter-layer`)
- The 90-day retention policy itself — retention is enforced at the sink backend (AppSignal / OTEL), not in code

## Key concepts

- **AuditEntry**: `{ ts, user, kind, target, outcome, latencyMs?, cacheHit?, errorCode?, argsSummary?, clientName?, clientVersion? }`. `kind` is `tool_call` | `resource_read` | `session_start`.
- **redact(entry)**: pure function `AuditEntry → AuditEntry`. Replaces emails (`\b[\w.+-]+@[\w-]+\.[\w.-]+\b`) with `<email>`, truncates `argsSummary` to 80 characters. Truncation runs **after** redaction so a trailing email is still scrubbed before truncation.
- **AuditSink**: `{ emit(entry: AuditEntry): void }`. The pluggable interface for sinks. Stdout is the default; AppSignal + OTEL are layered on in production.

---

## Redaction policy

Per PRD §4.8, the redaction step:

1. Replaces email addresses with the literal `<email>`.
2. Truncates `argsSummary` to **80 characters** (after redaction).
3. Is applied to every audit entry before any sink sees it.

The function lives in [`src/audit/redact.ts`](../../src/audit/redact.ts) and is invoked from [`src/audit/logger.ts`](../../src/audit/logger.ts) inside `audit()`. Tests are table-driven over `(input, expected)` pairs; see [`tests/unit/audit_redact.test.ts`](../../tests/unit/audit_redact.test.ts).

The 90-day retention is **enforced at the sink backend**, not by client-side rotation. Confirm AppSignal and OTEL retention configuration before going GA (see slice 31 — pre-GA security review).

---

## Configuration

### Environment Variables

- (none for redaction itself; redaction is unconditional)
- `APPSIGNAL_PUSH_API_KEY`, `APPSIGNAL_APP_NAME` — activate the AppSignal sink when set.
- `OTEL_EXPORTER_OTLP_ENDPOINT` — activates the OTEL meter sink. Standard OTEL env vars (`OTEL_EXPORTER_OTLP_HEADERS`, etc.) are honoured by the underlying SDK.

### Sinks

- **`StdoutAuditSink`** — always on; writes a single JSON line per entry to stdout.
- **`AppSignalAuditSink`** ([`src/audit/appsignal.ts`](../../src/audit/appsignal.ts)) — increments `japetus.audit.<kind>` and `japetus.audit.errors`; records `japetus.audit.<kind>.latency_ms` distributions. Activated only when `APPSIGNAL_PUSH_API_KEY` is set. **Note:** `@appsignal/nodejs` is not in `dependencies` because its postinstall script hangs inside Clever Cloud's build sandbox. To turn AppSignal on, `npm install @appsignal/nodejs` and set the env var; the sink falls back to a no-op with a warning if the key is set but the package is absent.
- **`OtelAuditSink`** ([`src/audit/otel.ts`](../../src/audit/otel.ts)) — emits `japetus.audit.calls`, `japetus.audit.errors` counters and a `japetus.audit.latency_ms` histogram via the global OTEL meter. Activated only when `OTEL_EXPORTER_OTLP_ENDPOINT` is set.
- **`MultiSink`** — composite fan-out; one sink failing does not crash the server or block other sinks (PRD §4.8 requirement).
- **`MetricsAuditSink`** — in-memory ring buffer of recent entries; backs the adoption-metrics observable gauges. Always part of the fan-out so derivation works whether or not OTEL is wired.
- Setup happens once at startup in [`src/audit/setup.ts`](../../src/audit/setup.ts) (`setupAuditSinks()`). Tests get the stdout sink only and stub AppSignal/OTEL through the typed interfaces above — no network calls in CI.

---

## Adoption metrics

Per PRD §4.8 + §9, four metrics are derived as a pure reduction over the audit stream — see [`src/audit/metrics.ts`](../../src/audit/metrics.ts):

- **Distinct active users (MAU)** — distinct `sub` over a rolling 30-day window.
- **Tool calls per user per ISO week** — `kind=tool_call` grouped by `(week, user)`.
- **First-seen `sub` per ISO week** — net-new adopters per week.
- **Distinct `sub × clientName × clientVersion`** — derived from the `session_start` audit event emitted on every MCP `initialize`. Captures install/upgrade signal without a real install hook.

When `OTEL_EXPORTER_OTLP_ENDPOINT` is set, [`src/audit/otel.ts`](../../src/audit/otel.ts) registers four observable gauges that read these counters on each export: `japetus.users.active`, `japetus.calls.total`, `japetus.users.firstseen`, `japetus.clients.distinct`.

---

## Testing

### Unit Tests

- **Location**: [`tests/unit/audit_redact.test.ts`](../../tests/unit/audit_redact.test.ts) and [`tests/unit/audit_pipeline.test.ts`](../../tests/unit/audit_pipeline.test.ts)
- **Key scenarios**:
  - No PII passes through unchanged
  - Single email replaced with `<email>`
  - Multiple emails replaced
  - 80-char truncation enforced
  - Truncation runs after redaction (trailing email still scrubbed)
  - Missing / empty `argsSummary` handled
  - Pure function — input is not mutated

### Integration Tests

- The MCP integration tests in [`tests/integration/server.test.ts`](../../tests/integration/server.test.ts) implicitly exercise the audit pipeline on every tool call and resource read.

---

## Security Considerations

- The redaction step is a defence-in-depth layer; tool authors should also avoid putting raw user-typed text into `argsSummary` when something narrower will do.
- Email regex is lossy by design (false positives on email-shaped strings are acceptable; false negatives would leak PII).
- Pre-GA security review (slice 31) is required before opening Japetus to a broader audience.

## Related Features

- **auth-and-scopes**: principal `sub` is the user identifier in every audit entry
- **mcp-surface**: every tool invocation produces one audit entry; missing or wrong audit calls in a new tool fail review

## Changelog

| Date       | Change                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------- |
| 2026-04-28 | Initial documentation; redaction (email regex-strip + 80-char truncation) landed.             |
| 2026-04-28 | Added `AppSignalAuditSink`, `OtelAuditSink`, `MultiSink`; setup via env vars.                 |
| 2026-04-28 | Added adoption-metrics derivation + observable gauges; clientInfo captured at MCP initialize. |
