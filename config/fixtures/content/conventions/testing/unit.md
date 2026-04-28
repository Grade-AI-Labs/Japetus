---
title: Unit Testing
description: Conventions for writing unit tests at Talentech.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `Japetus` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

A unit test exercises a single module in isolation. It is fast (<10ms),
deterministic, and runs in parallel with no shared state.

## Structure

Use Arrange / Act / Assert, with blank lines between phases:

```ts
it('rejects orders below the minimum', () => {
  // Arrange
  const svc = makeOrderService({ minimum: 10 });

  // Act
  const result = svc.place({ amount: 5 });

  // Assert
  expect(result.isErr()).toBe(true);
});
```

## Naming

- Test file: `subject.test.ts` / `test_subject.py`, same directory as the
  subject.
- Test name: describe behaviour, not implementation.
  - Good: `rejects orders below the minimum`.
  - Bad: `test_place_returns_err_when_amount_lt_min`.
- Group with `describe` per method or per scenario, not per class.

## Assertion focus

- One logical assertion per test. Multiple `expect` calls are fine when they
  all check the same outcome (e.g., error result plus error code).
- Do not combine unrelated scenarios in one test. Split them.
- Prefer specific matchers: `toEqual({ foo: 1 })` over `toBe(true)` on a
  derived boolean.

## Mocks and fakes

- Fake at the seam, not inside the subject. Replace collaborators via
  constructor injection or module boundary, not by patching the subject's
  internals.
- Prefer hand-rolled fakes over mocking libraries for anything non-trivial.
- Do not assert on mock call counts unless the interaction is the contract
  you are testing.

## Isolation

- No shared mutable state between tests. Each test constructs what it needs.
- No test order dependencies. Tests pass in any order and in parallel.
- No network, no filesystem, no clock. Inject a clock if you need time.

## Coverage

- Target: 80% line coverage on changed code. Lower is acceptable for glue
  code; higher is required for billing, auth, and data-handling modules.
- Coverage is a floor, not a goal. A module with 100% coverage and weak
  assertions is worse than 70% with meaningful assertions.
- CI enforces coverage on diff, not on the whole repo.

## What not to test

- Framework behaviour (React rendering a `<div>`).
- Private functions directly — test them through the public API.
- Third-party libraries.

## Flaky tests

- Quarantine (skip) and open a work item within 24 hours. Flaky tests that
  stay in rotation train engineers to ignore CI.
- Root-cause before re-enabling. "Retry until green" is not a fix.
