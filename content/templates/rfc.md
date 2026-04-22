---
title: RFC Template
description: Request For Comments template for cross-team technical proposals.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Use an RFC when a change affects more than one team, has non-trivial
trade-offs, or sets a precedent. For smaller decisions scoped to a single
team, use an ADR instead.

Copy this file to `plans/rfcs/<NNNN>-<slug>.md`.

---

# RFC NNNN: <Title>

- **Author:** <name>
- **Status:** Draft | In review | Accepted | Rejected | Superseded
- **Last updated:** <YYYY-MM-DD>
- **Review window:** <start> → <end> (aim for 5 business days minimum)
- **Stakeholders:** <list teams and named reviewers>

## Context

_What is the current state? What problem or constraint forces this proposal?
Include only the background a reader needs to evaluate the proposal — link
out for deep dives._

## Proposed change

_What are we proposing, concretely? Be specific: interfaces, data shapes,
ownership, rollout order. If the change has phases, describe each._

## Alternatives considered

For each alternative, capture:

### Alternative A: <name>

- **How it works:** <short description>.
- **Pros:** ...
- **Cons:** ...
- **Why not:** <the reason we are not recommending this>.

### Alternative B: <name>

...

### Do nothing

_Always include this option. What happens if we keep the status quo?_

## Recommendation

_State the preferred alternative and why. Reference the specific pros/cons
above that tipped the decision._

## Risks

_What could go wrong? Likelihood, impact, mitigation._

- **Risk:** <description> — _Mitigation:_ <plan>.

## Impact

- **Teams affected:** <list>.
- **Migration cost:** <qualitative or rough estimate>.
- **Backwards compatibility:** <yes / no / phased>.
- **Operational cost:** <new infra, on-call surface, SLAs>.

## Decision log

_Append each decision as it is taken. Do not edit past entries — add new
ones._

- **YYYY-MM-DD — <name>:** <decision and reasoning>.
- **YYYY-MM-DD — <name>:** <decision and reasoning>.

## Open questions

- [ ] <question> — owner: <name>.

## References

_Links to prior RFCs, ADRs, external docs, prior-art._
