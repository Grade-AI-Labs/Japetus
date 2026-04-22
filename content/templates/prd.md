---
title: PRD Template
description: Product Requirements Document template for Talentech.
owner: product
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Copy this file to `plans/prds/<slug>.md` and fill in each section. Delete
guidance italics as you go. Keep sections even if short — "N/A" is fine.

---

# <Product or Feature Name>

- **Author:** <your name>
- **Status:** Draft | In review | Approved | Shipped | Archived
- **Last updated:** <YYYY-MM-DD>
- **Reviewers:** <names — at least product, eng lead, design>
- **ADO epic:** AB#<id>

## Summary

_Two to four sentences. What is this, who is it for, and why are we doing it?
A reader should know whether to keep reading after this section._

## Problem

_What user or business problem does this solve? Back it with evidence —
support tickets, customer interviews, metrics. If you cannot describe the
problem without referring to a solution, the problem is not clear yet._

## Goals and non-goals

### Goals

- _Specific, measurable outcomes this PRD commits to._
- _..._

### Non-goals

- _Explicit things we are NOT doing. This prevents scope creep in reviews._
- _..._

## Users

_Who is affected? Include primary persona, secondary personas, and any
internal users (CS, ops). Note segment sizes or tiers where relevant._

## Solution overview

_2–3 paragraphs. The happy path end-to-end, in plain language. No
implementation details. A PM in another team should understand this._

## Detailed design

_Break down by surface: API, UI, data model, workflows. Link to design
mocks, ADRs, and architecture diagrams. Call out new infrastructure._

### API changes

### Data model changes

### UI changes

### Migration / backfill

## Rollout

- **Flag:** <flag name and default>
- **Stages:** internal → beta customers → GA.
- **Deprecations:** what old surface is being turned down, and when.
- **Docs:** internal + customer-facing updates needed.

## Success metrics

_How do we know this worked? Name the metric, baseline, target, and window.
Include a counter-metric (what should NOT regress)._

- Primary: <metric>, baseline <x>, target <y> by <date>.
- Counter: <metric> must not regress more than <%>.

## Risks

_Known unknowns. Likelihood + impact + mitigation per risk._

- **Risk:** <description> — _Mitigation:_ <plan>.

## Open questions

_Things to resolve before / during implementation. Assign an owner per
question._

- [ ] <question> — owner: <name>.

## Appendix

_Links to research, earlier proposals, competitive analysis, legal review._
