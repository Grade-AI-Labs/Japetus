# 19 — CI client-credentials flow

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Support OAuth 2.1 client-credentials flow for CI agents so they can authenticate without a browser consent step. CI tokens get narrow scopes (typically `standards:read` only) to enforce the principle from PRD §6.6: "Enables narrower tokens for CI jobs than for humans."

Per PRD §6.9: "CI agents: narrow-scoped client credentials; do not use user OAuth."

## Acceptance criteria

- [ ] Server accepts client-credentials tokens from Entra alongside user-auth-code tokens.
- [ ] Tokens are validated with the same middleware; scopes enforced identically to user tokens.
- [ ] Documented procedure for issuing a CI client credential with specified scopes.
- [ ] Sample CI job (GitHub Actions or Azure DevOps, matching Talentech's stack) exercises a tool call using client credentials.
- [ ] Sample job uses the narrowest scope needed (typically `standards:read`).
- [ ] Runbook entry for rotating CI credentials.

## Blocked by

- Blocked by [13-scopes-error-shapes.md](13-scopes-error-shapes.md)

## User stories addressed

- PRD §6.6 (Scopes on the MCP token — narrower for CI).
- PRD §6.9 (CI agents).
- PRD §7 Phase 3.
