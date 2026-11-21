# Stage 2: PRD

Builds on the confirmed problem statement; do not re-interrogate it. The bar: a designer and a developer can start work from the PRD without coming back to ask what was meant. No implementation detail (code, schemas, API design, module breakdowns): that belongs to the build.

## Checklist

Every topic is a required branch. Settle it, or agree with the user to defer it as Open with a reason.

- **Goals**: what success looks like, measurable.
- **Non-goals and out of scope**: what we are not doing, with a reason where it matters.
- **Users and personas**: primary, secondary and anti-persona (who it is explicitly not for); internal stakeholders who can block it (sales, support, legal, compliance, DPO, security).
- **Use cases**: the happy path, and at least three edge cases per primary story.
- **Functional requirements**: what the product must do.
- **Non-functional requirements**: performance, compliance (GDPR, EU AI Act classification), accessibility, localisation, observability.
- **Scope**: the MVP (the smallest thing that proves the bet), and what comes after, written down so it is not smuggled into the MVP. Must-have against nice-to-have, each with its reason.
- **Constraints and dependencies**: technical, business (budget, timeline), legal, organisational, external.
- **Edge cases and failure modes**: bad data, 10x scale, adversarial input, AI fallback, audit and explainability (see `context.md`).
- **Success metrics**: leading and lagging indicators, counter-metrics (what must not get worse), and the "we got this wrong" signal, defined before launch.
- **Trade-offs**: what we are not optimising for; build, buy or partner.
- **Risks**: the top three by probability × impact, each with a mitigation.
- **Assumptions**: each one written down; mark the ones that can be tested cheaply before building.

## Template

Write every section. If one has no answer, write `Open — <reason>` or `N/A — <reason>`.

```markdown
# PRD: <title>

## Problem statement
<the confirmed Stage 1 statement, condensed to one paragraph>

## Goals
## Non-goals
## Users and personas
## Current state and evidence
<source per claim>

## Use cases
<happy path; at least three edge cases per primary story>

## Functional requirements
## Non-functional requirements
## Scope
<MVP; later versions; must-have against nice-to-have, with reasons>

## Constraints and dependencies
## Edge cases and failure modes
## Success metrics
<leading, lagging, counter-metrics, "we got this wrong" signal>

## Trade-offs
## Risks and mitigations
## Assumptions
<mark the cheaply testable ones>

## Out of scope
## Open questions
<topic — reason — who could answer>
```
