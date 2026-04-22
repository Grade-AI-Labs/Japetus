---
title: 'PR review checklist'
description: 'Talentech AI Labs review checklist; cover these on every review.'
owner: 'platform-dx'
---

# PR review checklist

> **Placeholder content — slice 09 HITL review pending.** Content owners: please replace with the authoritative list. See [plans/issues/09-seed-corpus.md](../../../plans/issues/09-seed-corpus.md).

Apply every time, in this order:

## 1. Correctness

- Does the PR do what its description says it does?
- Edge cases handled (nulls, empty collections, permission denied, upstream failure)?
- No accidental behaviour change outside the stated scope?

## 2. Tests

- New behaviour has at least one automated test that would have failed before this change.
- Integration tests hit real dependencies or documented stubs — not mocks that paper over reality.
- Flaky tests addressed, not silenced.

## 3. Security

- No secrets in the diff, in tests, or in logs.
- Input from outside the trust boundary is validated before use.
- Dependencies added follow the dependency policy.

## 4. Observability

- Errors are logged with enough context to debug from logs alone.
- New code paths are traceable (structured log, metric, or trace).
- Feature flags documented if used.

## 5. Accessibility (UI changes)

- Matches the WCAG 2.1 AA baseline.
- Keyboard navigation works.
- Screen-reader labels present on interactive elements.

## 6. Description and rollback

- Description matches the template and explains the _why_.
- Rollback plan is clear and cheap.
