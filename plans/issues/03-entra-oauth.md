# 03 — Entra OAuth 2.1 end-to-end

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL + AFK

## What to build

Add Entra as the upstream IdP for OAuth 2.1 on the MCP server so that the single resource from slice 02 requires a valid token. Validate that Claude Code's native browser-based consent flow completes against the real Entra app. The HITL portion is the Entra app registration (requires admin); the AFK portion is wiring the server code.

Per PRD §6.6: MCP token scopes are backend-neutral (`standards:read`, `kb:read:<space>`, `catalog:read`). Scope definitions land here but enforcement is deferred to slice 13.

## Acceptance criteria

- [ ] Entra app registered with redirect URI(s) for the deployment target and for local dev.
- [ ] Scope definitions (`standards:read`, `kb:read:<space>`, `catalog:read`) exist in the app registration.
- [ ] Server validates bearer tokens on every MCP request and rejects missing/invalid tokens with the correct error.
- [ ] Claude Code completes the browser consent flow end-to-end against a deployed (or tunneled) server on first use.
- [ ] Token claims (user id, scopes) are extractable for downstream use by audit and authz slices.
- [ ] README/ADR documents the Entra app configuration so it can be reproduced in a second environment.

## Blocked by

- Blocked by [02-server-skeleton.md](02-server-skeleton.md)

## User stories addressed

- PRD §6.6 (Authentication and authorization).
- PRD §7 Phase 0 Spike.
