# 32 — Deploy to Clever Cloud as Docker container + follow-up ADR

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL

## What to build

Production deployment per PRD §7.3 and §8 Phase 2. Push the Docker image (built from the existing `Dockerfile`) to Clever Cloud, wire production env vars (Entra credentials, Confluence service principal, AppSignal/OTEL endpoints, `REGISTRY_CONFIG=config/registry.production.json`), and verify the OAuth callback flow from Claude Code.

Write a follow-up ADR superseding the relevant decisions in `docs/adr/001-foundations.md`:

- Deployment target: Azure Container Apps → **Clever Cloud (Docker)** with portability rationale.
- Token scopes: `kb:read:<space>` → `kb:read` (collapse).

HITL because credential setup, Entra app-registration callback URLs, and DNS need human action outside the codebase.

## Acceptance criteria

- [ ] Docker image built from the existing `Dockerfile` runs cleanly on Clever Cloud.
- [ ] Production env vars set: `AUTH_MODE=entra`, `ENTRA_TENANT_ID`, `ENTRA_AUDIENCE`, `CONFLUENCE_BASE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_*`, `REGISTRY_CONFIG=config/registry.production.json`, AppSignal + OTEL credentials.
- [ ] Entra app registration includes the Clever Cloud callback URL.
- [ ] OAuth flow from Claude Code (or another remote-MCP client) succeeds against the deployed instance.
- [ ] `resources/list` and `resources/read` against the production registry return Confluence-backed content.
- [ ] Cache + change-notification verified: editing a Confluence page reflects in the served resource within the polling interval.
- [ ] AppSignal and OTEL receive audit entries from the running instance.
- [ ] `1002` upstream-unavailable observed correctly when Confluence is intentionally unreachable.
- [ ] New ADR (e.g. `docs/adr/002-deployment-and-scopes.md`) checked in, superseding the ADR 001 decisions; `Supersedes` field updated on ADR 001 if needed.
- [ ] On-call ownership for the Clever Cloud deploy named.

## Blocked by

- Blocked by [22-drop-deprecated-tools-prompts.md](22-drop-deprecated-tools-prompts.md), [23-registry-aliases.md](23-registry-aliases.md), [24-registry-config-loader.md](24-registry-config-loader.md), [25-collapse-kb-scope.md](25-collapse-kb-scope.md), [26-audit-redaction.md](26-audit-redaction.md), [27-audit-sinks-appsignal-otel.md](27-audit-sinks-appsignal-otel.md), [28-adoption-metrics.md](28-adoption-metrics.md), [29-confluence-converter.md](29-confluence-converter.md) (Phase 1 hardening must land first).
- Blocked by [30-confluence-page-mapping.md](30-confluence-page-mapping.md) (production config must be real).
- Blocked by [31-security-review.md](31-security-review.md) (security sign-off before exposure).

## User stories addressed

- User story 1 (engineer using Claude Code reaches the MCP server).
- User story 2 (engineer using Cursor reaches the MCP server).
- PRD §7.3, §8.
