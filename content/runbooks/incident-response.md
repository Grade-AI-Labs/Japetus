---
title: Incident Response
description: How to declare, run, and close incidents at Talentech.
owner: sre
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

An incident is any production event with customer impact or risk of data loss.
When in doubt, declare. Over-declaring is cheap; under-declaring is not.

## Severity ladder

- **SEV1 — Critical.** Production is down, data loss is occurring or imminent,
  or PII is exposed. Page the whole on-call chain. Customer comms within 30 min.
- **SEV2 — Major.** A critical feature is broken for many users or a single
  large customer. Page primary on-call. Customer comms within 2 hours.
- **SEV3 — Minor.** Degraded performance or a bug affecting a subset of users
  with a workaround. Handle during business hours. Customer comms if externally
  visible.

Promote severity if impact grows. Do not demote without the IC's agreement.

## Declaration

Any engineer can declare. Declaration steps:

1. Post in `#incidents` with severity, short summary, and affected surface.
2. Open an incident channel `#inc-<YYYYMMDD>-<slug>`.
3. Page primary on-call if not already engaged.
4. Start the incident doc from `content/templates/postmortem.md` — you fill in
   the timeline as you go, not after.

## Roles

- **Incident Commander (IC).** Coordinates. Not the person fixing the bug.
  Makes severity calls, decides on comms, declares resolution. One IC at a time.
- **Tech lead.** Drives the technical investigation. Delegates to SMEs.
- **Comms lead.** Writes customer-facing updates. Approves with IC.
- **Scribe.** Maintains the timeline and decisions in the incident doc.

On a small incident, IC can cover comms and scribe. On SEV1, split the roles.

## Comms cadence

- SEV1: customer update every 30 minutes until mitigation, then on state change.
- SEV2: customer update every 60 minutes.
- Internal updates in `#incidents` every 15–30 minutes regardless of severity.
- "No change" is a valid update. Silence is not.

## Resolution criteria

Before declaring resolved:

- [ ] Impact has stopped (monitors clean for at least 15 minutes).
- [ ] Root cause is identified or contained (with an owner if unknown).
- [ ] Customer comms sent announcing resolution.
- [ ] Incident doc timeline is current.

Mitigation is not resolution. A hotfix with a known hole is still an open
incident with a scheduled follow-up.

## Post-incident

- Blameless postmortem within 5 business days for SEV1/2, 10 for SEV3.
- Use `content/templates/postmortem.md`.
- Action items have owners and due dates. Tag them with `oncall` in ADO.
- Share the postmortem org-wide. Do not redact beyond what compliance
  requires.

## Do not

- Do not fix and forget. An undeclared incident with customer impact is a
  process violation.
- Do not run the incident in DMs. Keep the channel public.
- Do not blame individuals. Focus on systems, signals, and missing guardrails.
