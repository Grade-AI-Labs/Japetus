---
title: Secrets Handling
description: How to store, access, and rotate secrets at Grade AI Labs.
owner: security
---

> **Placeholder content.** Seeded for the `grade-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Secrets are credentials, API keys, connection strings, signing keys, and any
token that grants access to a system or data.

## Rules

- Never commit a secret. Ever. Not even temporarily.
- Never paste a secret in chat, ADO comments, or PR reviews.
- If a secret is exposed, treat it as compromised. Rotate immediately. See
  `content/runbooks/rotate-secrets.md`.

## Where secrets live

- **Production:** Azure Key Vault. One vault per environment per tenant
  boundary. Access via managed identity — no static credentials in the app.
- **Shared test environments:** Azure Key Vault, separate vault from prod.
- **Local development:** `.env.local` (gitignored). Never `.env` — that is
  too easy to commit.
- **CI:** ADO variable groups backed by Key Vault. Mark as secret so values
  are masked in logs.

## Access patterns

- Prefer managed identity + RBAC over shared secrets wherever the target
  platform supports it (Azure services, GitHub OIDC to Azure, etc.).
- When a shared secret is unavoidable, scope it to one service and one
  purpose. No "org master key" reuse.
- Applications fetch secrets at startup, cache in memory, and refresh on a
  known cadence (or on 401 from downstream).

## Rotation

- Rotate on exposure: immediate.
- Rotate on schedule: every 90 days for long-lived secrets; 30 days for
  high-blast-radius keys (signing keys, DB admin).
- Rotate on personnel changes: within 24 hours of offboarding for anyone who
  had access.

## Local dev checklist

- [ ] `.env.local` is in `.gitignore`.
- [ ] A `.env.example` exists with keys but no values.
- [ ] Pre-commit hook (`detect-secrets` or `gitleaks`) is enabled.
- [ ] Editor plugins do not sync `.env.local` to cloud backups.

## CI / CD

- CI logs mask values from variable groups automatically. Do not `echo` a
  secret into the log to verify it — it will bypass masking if you transform it.
- Build artifacts must not contain secrets. Fetch at runtime from Key Vault.

## Incident response

If a secret may have been exposed (leaked log, public repo, screenshot):

1. Rotate it now. Do not wait to confirm exposure.
2. Open a SEV2 incident (or SEV1 if the secret is high-blast-radius).
3. Audit access logs for the exposure window.
4. See `content/runbooks/incident-response.md`.
