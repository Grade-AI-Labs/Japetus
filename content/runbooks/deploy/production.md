---
title: Production Deploy
description: Runbook for deploying changes to production.
owner: sre
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Production deploys are boring by design. If a deploy feels risky, stop and
split it.

## Pre-deploy checks

- [ ] Change is merged to `main` with a green CI run.
- [ ] Release notes draft is ready (auto-generated from commit messages, with
      one-line summary per PR).
- [ ] Feature flags for new behaviour default to **off**.
- [ ] Database migrations are backwards-compatible with the currently-deployed
      code (expand-then-contract).
- [ ] Dependencies that the change relies on (infra, config, sibling services)
      are deployed.
- [ ] On-call is aware. Deploys during incidents are prohibited.

## Freeze windows

- No production deploys: Fridays after 14:00, weekends, the last 2 business
  days of a month, or during an open SEV1/2 incident.
- Exceptions require on-call lead approval and go out as a SEV3 change.

## Canary stage

- Deploy to canary (1–5% of traffic) first.
- Soak for at least 15 minutes.
- Watch these signals during soak:
  - Error rate (5xx + unhandled exceptions) vs previous window.
  - P99 latency per route.
  - Downstream error rates (DB, queues, external APIs).
  - Business metrics relevant to the change (sign-ups, sends, exports).

If any signal regresses beyond the alert threshold, roll back.

## Full rollout criteria

Promote from canary to 100% when:

- [ ] Canary has run ≥ 15 minutes with no regression.
- [ ] No warnings from the deploy job (e.g., pods restarting, migrations
      hanging).
- [ ] Synthetic probes green.

Roll forward in stages: 5% → 25% → 50% → 100%, with ~5 minutes between stages
unless dashboards are clearly clean.

## Rollback triggers

Roll back, do not roll forward, when:

- Error rate exceeds alert threshold after rollout.
- Latency regression is >20% on a critical route.
- A new error signature appears in logs at non-trivial volume.
- Downstream services start erroring because of the new code.

Rollback procedure:

1. Run the deploy pipeline with the prior build SHA as target.
2. Watch the same signals during the roll-back rollout.
3. Open an incident if customer impact occurred — even if short.
4. Post-mortem the cause before re-attempting the deploy.

## Post-deploy verification

- [ ] Synthetic end-to-end test passes on prod.
- [ ] Manual smoke test of the changed surface.
- [ ] Release notes published.
- [ ] ADO work items moved to Closed once verified.
- [ ] Flags for the change have a follow-up item to flip default / remove.

## Data migrations

- Expand (add columns, optionally null), deploy code that reads old + new,
  backfill, then contract.
- Never deploy a code + schema change in a single step if the schema change
  is not backwards-compatible.
- Migrations that take longer than 60 seconds run out-of-band, not during
  deploy.
