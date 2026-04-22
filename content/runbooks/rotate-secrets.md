---
title: Secret Rotation
description: How to rotate a secret safely, on schedule or on exposure.
owner: security
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Rotate on exposure immediately. Rotate on schedule per
`content/conventions/security/secrets-handling.md`.

## 1. Identify blast radius

Before touching anything, answer:

- What is the secret used for? (Service-to-service auth, signing, DB access,
  external API.)
- Which services consume it? Which environments?
- Who holds copies outside the secret store? (CI variable groups, local
  `.env.local` files, laptops of offboarded folks.)
- Can we rotate live, or does it require downtime?

Document this on an incident channel or a rotation ticket. Do not rotate in
silence — at least one other engineer needs to know.

## 2. Generate new secret

- Generate from the authoritative source (the provider's UI, CLI, or Key Vault
  `az keyvault secret set --generate-query`).
- Do not reuse values. Do not increment old values (`prod-key-v2`).
- Length and character class: follow the provider's maximum.
- Store the new value in Key Vault **before** deploying consumers to use it.

## 3. Deploy new consumers

- If the upstream system supports two active credentials (most modern ones
  do), add the new one as a second valid credential. This is the preferred
  path — zero downtime.
- Roll out consumer deploys referencing the new secret version. Watch for:
  - Auth errors spiking (rollback target).
  - Deploy pods picking up the new secret (confirm via app-level healthcheck
    or a logged secret-version fingerprint, not the value itself).
- If the upstream only supports one credential at a time, schedule a brief
  maintenance window and coordinate cutover.

## 4. Decommission old secret

- Only after all consumers are confirmed on the new secret.
- Revoke the old secret at the provider. Do not merely unreference it.
- Delete the old version from Key Vault (soft-delete keeps it recoverable for
  90 days per policy).
- If copies existed in CI variables, local `.env` files, or tickets, purge
  them. Notify anyone who had a local copy.

## 5. Post-rotation audit

- [ ] Confirm no service is still using the old credential (provider's access
      logs, zero auth attempts in last 24h).
- [ ] Confirm Key Vault only has the current version referenced.
- [ ] Update the rotation log: who rotated, when, why, blast radius.
- [ ] Schedule next rotation per cadence.

## On exposure

- Skip step 3's coordination — revoke first, stand up new, accept brief
  downtime. Exposure is strictly worse than downtime.
- Open a SEV2 (or SEV1 for high-blast-radius secrets). See
  `content/runbooks/incident-response.md`.
- Audit provider access logs for the exposure window. Capture indicators of
  use.

## Common pitfalls

- Rotating the secret in Key Vault but forgetting that CI variable groups
  are a separate copy.
- Deploying consumers before the new secret is actually readable by them
  (RBAC lag).
- Rotating without telling on-call — monitors fire, on-call assumes
  compromise, double incident.
