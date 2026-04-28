---
title: ADR Template
description: Architecture Decision Record template for team-local decisions.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `Japetus` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Use an ADR to capture a decision that is hard to reverse, specific to one
team or service, and where future maintainers would wonder "why did we pick
this?". Cross-team proposals belong in an RFC.

Copy this file to `<repo>/docs/adr/<NNNN>-<slug>.md`. Numbering is
monotonic per repo.

---

# ADR NNNN: <Title>

- **Status:** Proposed | Accepted | Superseded by ADR NNNN | Deprecated
- **Date:** <YYYY-MM-DD>
- **Deciders:** <names>
- **Supersedes:** ADR NNNN (if any)

## Context

_Describe the forces at play: technical constraints, business goals, team
capacity, existing commitments. Someone reading this in two years should
understand the decision environment without paging in prior meetings._

## Decision

_State the decision in one or two sentences. Use active voice: "We will use
X." Not "X was chosen."_

## Consequences

_What follows from this decision? List good and bad outcomes._

### Positive

- <consequence>
- ...

### Negative / trade-offs

- <consequence>
- ...

### Neutral

- <consequence>
- ...

## Rejected alternatives

### <Alternative 1>

- **Why considered:** <short reason>.
- **Why rejected:** <concrete reason — not just "it was worse">.

### <Alternative 2>

- **Why considered:** <short reason>.
- **Why rejected:** <concrete reason>.

## Follow-ups

- [ ] Work items opened from this decision (link ADO).
- [ ] Documentation updates required.
- [ ] Review date if this decision should be revisited (e.g., "Revisit
      once we exceed 100 tenants").

## References

_Links to RFCs, PRDs, tickets, external sources that informed the decision._
