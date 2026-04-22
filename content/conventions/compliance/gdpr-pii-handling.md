---
title: GDPR & PII Handling
description: How to handle personally identifiable information at Grade AI Labs.
owner: compliance
---

> **Placeholder content.** Seeded for the `grade-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Grade handles candidate and employee data across EEA jurisdictions. GDPR is
the floor, not the ceiling.

## What counts as PII at Grade

- **Direct identifiers:** name, email, phone, national ID, passport,
  photograph, video, voice recording.
- **Employment data:** current employer, position, salary, performance notes,
  interview feedback.
- **Indirect identifiers:** IP address, device ID, user agent, precise
  geolocation.
- **Sensitive categories** (Art. 9 GDPR): health, union membership, race,
  political views, sexuality, religion. Never collect without explicit legal
  basis and compliance sign-off.

When in doubt, treat it as PII.

## Collection

- Collect only what the feature requires. "Nice to have" is not a lawful basis.
- Document the lawful basis per field in the data inventory before shipping
  a new field.
- User-facing consent text is written by compliance, not by engineering.

## Retention

- Default retention: duration of the candidate relationship plus 2 years,
  unless the customer configures otherwise.
- Hard-delete on retention expiry. Soft-delete flags do not satisfy GDPR.
- Backups: document the backup retention window. A deletion request is
  satisfied when primary + backups have purged within the documented window.

## Erasure (Right to be forgotten)

- Every system storing PII must support deletion by subject.
- Erasure path is tested end-to-end with an integration test.
- Tombstone records (for foreign-key integrity) may retain a pseudonymous
  ID only — no original PII.

## Pseudonymization

- For analytics, replace direct identifiers with stable hashes keyed per
  environment. Hash inputs include a per-tenant pepper from Key Vault.
- Pseudonymous IDs are not anonymous: treat them as PII when combined with
  other data in the same system.

## Logging rules

- Never log direct identifiers. Never log sensitive categories.
- Log stable internal IDs (user_id, tenant_id) so operators can join with
  the identity store when legally necessary.
- Do not log request bodies containing PII. Strip or redact at the ingest edge.
- Structured logs: use a schema that marks PII fields. Log shippers can then
  drop or redact at rest.

## Transfers

- Data stays in the EEA by default. Cross-border transfer requires an
  approved transfer mechanism (SCCs, adequacy decision) and a DPIA update.
- No PII in tickets, screenshots, or shared spreadsheets. Use tenant IDs.

## Access control

- Access to production data is audited. Ad-hoc queries against PII require
  a documented ticket and named approver.
- Developers work with synthetic or masked data in lower environments.

## Incident response

- Any confirmed PII exposure is a SEV1. The DPO is on the notification list
  regardless of severity.
- See `content/runbooks/incident-response.md`.
