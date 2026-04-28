# 28 — Adoption-metrics derivation + capture MCP `clientInfo`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Derive the adoption metrics defined in PRD §4.8 and §9 from the audit stream — distinct active users (MAU), tool calls per user per week, first-seen-`sub` adopters per week, and distinct `sub × clientName × clientVersion`. Capture MCP `clientInfo` (name + version sent by the client at `initialize`) and emit one audit event per session so the client × version dimension is computable.

The metrics derivation is one of the three deep modules called out in PRD §4.11 — a pure reduction over a sequence of audit entries, testable in isolation. Counters are exported via the OTEL counter API so AppSignal can dashboard them.

## Acceptance criteria

- [ ] New `src/audit/metrics.ts` module: pure function(s) over an audit-entry stream that produce the four counter sets.
- [ ] Transport / server `initialize` handler captures `clientInfo` from the request; stores per-session in the request context.
- [ ] One audit event per session emitted at `initialize` with `kind: 'session_start'` and `clientName`, `clientVersion`.
- [ ] OTEL counters incremented from the metrics module: `japetus.users.active`, `japetus.calls.total`, `japetus.users.firstseen`, `japetus.clients.distinct` (exact metric names TBD per OTEL conventions).
- [ ] Counters visible via the configured OTEL exporter (verified via stub exporter in tests).
- [ ] Unit test: given a sequence of audit entries with mixed `sub` values, kinds, and `clientInfo`, the derived counters are exact.
- [ ] Integration test: `initialize` from a stub MCP client populates `clientInfo`; subsequent tool calls increment the right counters.
- [ ] `docs/features/audit.md` (or equivalent) documents the metrics surface.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).
- Blocked by [26-audit-redaction.md](26-audit-redaction.md) (entries must already be redacted).
- Blocked by [27-audit-sinks-appsignal-otel.md](27-audit-sinks-appsignal-otel.md) (OTEL exporter must exist).

## User stories addressed

- User story 28 (SRE wants adoption metrics emitted via OTEL).
- PRD §4.8, §4.11, §9.
