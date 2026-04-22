# 05 — Confluence adapter with service principal

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL + AFK

## What to build

Implement a Confluence source adapter that conforms to the `SourceAdapter` contract and register at least one real resource served from Confluence (e.g. `conventions://python/style`). The HITL portion is provisioning a Confluence service principal with read access to curated spaces only; the AFK portion is the adapter code.

Per PRD §6.6, service principal is the right call for MVP — revisit only if we ever expose anything with per-user entitlements (PRD §10 open question #1, already resolved).

Content-format translation lives inside the adapter (Confluence storage format → markdown per §6.5).

## Acceptance criteria

- [ ] Confluence service principal provisioned with read-only access to curated spaces only.
- [ ] Confluence adapter implements `SourceAdapter` (list/fetch/search).
- [ ] Storage format → markdown rendering produces clean output for representative pages (headings, code blocks, lists, tables).
- [ ] At least one resource served from Confluence via the registry; indistinguishable from filesystem-backed resources to the agent.
- [ ] Service-principal credentials managed via the deployment target's secret store (not checked in).
- [ ] Adapter handles Confluence auth and network failures without crashing the server.

## Blocked by

- Blocked by [04-adapter-filesystem-registry.md](04-adapter-filesystem-registry.md)

## User stories addressed

- Use case 2 ("Add a new Python module here" → `conventions://python/style`).
- Use case 5 (compliance guidance lookup — once the compliance doc lives in Confluence).
- PRD §6.5, §6.6.
