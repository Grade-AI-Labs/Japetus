# 09 — Seed the MVP corpus (~15 resources)

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL

## What to build

Populate the registry with the full Phase 1 corpus listed in PRD §6.2, authored with content owners. Exact slugs are TBD with owners per the PRD — this slice is where that conversation happens. Each resource needs a load-bearing description (PRD §6.2: "Descriptions are load-bearing. Write them like tool descriptions — what it covers, when to use it, what it supersedes.").

Every resource gets an ownership label (PRD §9 risk mitigation: "Ownership labels on every resource") so slice 20 (staleness dashboard) can key off it.

## Acceptance criteria

Conventions registered and populated:

- [ ] `conventions://python/style`
- [ ] `conventions://typescript/style`
- [ ] `conventions://react/component-patterns`
- [ ] `conventions://git/commit-messages`
- [ ] `conventions://git/branch-naming`
- [ ] `conventions://prs/review-checklist`
- [ ] `conventions://prs/description-template`
- [ ] `conventions://security/secrets-handling`
- [ ] `conventions://security/dependency-policy`
- [ ] `conventions://testing/unit`
- [ ] `conventions://testing/integration`
- [ ] `conventions://ado/work-item-conventions`
- [ ] `conventions://accessibility/wcag-baseline`
- [ ] `conventions://compliance/gdpr-pii-handling`

Runbooks:

- [ ] `runbooks://incident-response`
- [ ] `runbooks://deploy/production`
- [ ] `runbooks://rotate-secrets`

Templates:

- [ ] `templates://prd`
- [ ] `templates://rfc`
- [ ] `templates://adr`
- [ ] `templates://postmortem`

Per resource:

- [ ] Description is load-bearing: covers what it is, when to use, what it supersedes (if anything).
- [ ] Ownership label set (team + primary contact).
- [ ] Space mapping set (for Confluence-backed resources).
- [ ] Content owner has reviewed and signed off.
- [ ] Per-product handling resolved (PRD §10 open question #4 — leaning `product` annotation rather than sub-namespace).

## Blocked by

- Blocked by [05-confluence-adapter.md](05-confluence-adapter.md)

## User stories addressed

- Use cases 1, 2, 4, 5 — each cites one of these resources.
- PRD §6.2 (MVP corpus).
- PRD §7 Phase 1.
