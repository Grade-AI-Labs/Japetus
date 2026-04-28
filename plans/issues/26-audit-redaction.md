# 26 — Audit query redaction (email regex-strip + 80-char truncation)

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Formalize the audit privacy policy per PRD §4.8: every audit entry passes through a redaction step before any sink sees it. The 80-character truncation is already in place for tool-call `argsSummary`; this slice adds **email regex-stripping** and centralizes the redaction so future PII patterns drop in cleanly.

The redaction step is one of the three deep modules called out in PRD §4.11 — a pure transformation from raw entry to safe-to-emit entry, table-driven testable in isolation.

## Acceptance criteria

- [ ] New `redact(entry)` function in `src/audit/logger.ts` (or a sibling module) — pure function, no side effects.
- [ ] Email regex (`\b[\w.+-]+@[\w-]+\.[\w.-]+\b`) is replaced with `<email>` in `argsSummary` and any other free-text field.
- [ ] 80-character truncation is documented and enforced on `argsSummary` (current behavior, formalized).
- [ ] `audit()` calls `redact()` before passing the entry to any sink.
- [ ] Table-driven unit tests cover: no PII, single email, multiple emails, email plus normal text, query exceeding 80 chars, missing `argsSummary`, edge cases (empty string, very long single token).
- [ ] Existing audit-aware integration tests still pass.
- [ ] `docs/features/auth-and-scopes.md` (or a new `docs/features/audit.md`) documents the redaction policy.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).

## User stories addressed

- User story 21 (every tool call / resource read logged with redacted query summary).
- PRD §4.8, §4.11.
