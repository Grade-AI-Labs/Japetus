---
title: Azure DevOps Work Item Conventions
description: How to write, link, and tag ADO work items at Talentech.
owner: eng-ops
---

> **Placeholder content.** Seeded for the `Japetus` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Work items are the unit of coordination across teams. A good work item is
readable without Slack context and survives a reassignment.

## Types

- **Epic** — a quarter-sized outcome. Owned by a PM.
- **Feature** — a shippable increment within a quarter. Owned by a PM or
  engineering lead.
- **User Story** — user-visible behaviour, fits in one sprint.
- **Task** — engineering sub-work. Sized in hours.
- **Bug** — regression or defect. Title starts with the observed symptom.

## Title format

- Imperative or declarative. No question marks.
- Short — fits in a sprint-board card.
- For bugs, include the affected surface: `Login: spinner persists after 2FA
failure`.

Good:

- `Send signed URLs for inbound webhooks`
- `Candidate export returns 500 when tenant has no locale`

Bad:

- `webhook stuff`
- `why is the login page broken??`

## Description structure

Every work item has three sections:

### Context

Why does this exist? What is the user or system state today? Link the Epic,
ADR, or incident that motivated it.

### Acceptance criteria

Bulleted, testable. Each item should map to a check in the PR test plan.

- [ ] Criterion one.
- [ ] Criterion two.
- [ ] ...

### Notes

Non-binding: implementation hints, prior art, open questions. Reviewers may
update this section as they learn more.

## Linking

- Link child PRs to the work item by including `AB#12345` in commit messages
  and PR titles. ADO picks this up automatically.
- Link related work items with typed links: Parent / Child, Predecessor /
  Successor, Related. Do not leave orphans.
- When a work item is closed by a PR, the PR should say `Fixes AB#12345`.

## Tagging

Use tags for cross-cutting views. Agreed-upon tags:

- `release:2026.04` — targeted release window.
- `oncall` — bug found on-call.
- `tech-debt` — repayment work.
- `security` — requires security review.
- `customer:<name>` — specific customer escalation.
- `needs-design` — blocked on design.

Do not invent per-team tags without adding them to this list.

## States

- **New** — triaged but not scheduled.
- **Active** — being worked on. One active item per engineer.
- **Resolved** — PR merged, awaiting verification.
- **Closed** — verified in target environment.
- **Removed** — decided not to do. Always add a comment explaining why.

## Anti-patterns

- Acceptance criteria that restate the title.
- Work items without a parent. Create an Epic or file under "Operational".
- Long-running "catch-all" items. Split into concrete tasks.
