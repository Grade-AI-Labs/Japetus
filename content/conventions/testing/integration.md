---
title: Integration Testing
description: Conventions for integration tests at Talentech.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Integration tests exercise multiple modules together with their real
dependencies where feasible. They are slower than unit tests and smaller
in number, but catch contract drift.

## Scope

- Include: the service's HTTP/gRPC layer, its database, its queue consumers,
  its filesystem or blob storage access.
- Exclude: third-party SaaS (Stripe, Slack). Mock at that boundary.
- Exclude: other owned services. Use a contract test instead.

## Real dependencies

- Databases: use `testcontainers` to spin up the real engine (Postgres,
  Redis, etc.) per test run. No SQLite stand-ins for a Postgres app.
- Queues: real broker in a container (RabbitMQ, Service Bus emulator).
- HTTP downstreams we own: prefer an in-process fake that we publish from the
  downstream, not a hand-written mock.

## Mocks only at trust boundaries

A "trust boundary" is where the system meets code we do not own and cannot
run in CI: third-party SaaS, payment providers, email delivery. Everywhere
else, use the real thing.

## Hermetic execution

- Each test run starts with a clean database. Use transactions-per-test or
  truncate-between.
- No test reaches the public internet. CI enforces this with a netns/firewall.
- Time is injectable. Tests that depend on "now" use a fake clock.
- Randomness is seeded.

## Test layout

- Separate directory: `tests/integration/` (Python) or `__integration__/` (TS).
- Separate runner target so `npm test` / `pytest` stay fast. Integration runs
  on CI on every PR and locally with `make test-integration`.

## Fixtures

- Build fixtures with factories (factory-boy, test-data-bot). Do not hand-write
  object literals across many tests.
- Keep fixtures minimal: only set fields the test actually needs. Defaults
  come from the factory.
- Share factories across tests; do not share built instances.

## What to assert

- End-to-end outcomes: HTTP response body and status, row written to DB,
  message published.
- Do not assert on intermediate function calls — that is a unit test concern.

## Speed

- Target: the full integration suite runs in under 5 minutes in CI.
- If a suite grows beyond that, parallelize by sharding or split slow paths
  into a separate nightly job.

## Local developer experience

- `docker compose up` (or `make dev-up`) boots every dependency.
- Tests detect a running stack and reuse it, or boot containers on demand.
- Document required ports and env vars in the repo README.
