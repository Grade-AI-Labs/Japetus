# 30 — Identify canonical Confluence pages + publish production registry config

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL

## What to build

Content-ops work item per PRD §7.3: workshop with each domain owner (CTO/CIO and the security, SRE, platform/DX, accessibility, compliance leads) to identify which Confluence pages back each URI in PRD §4.2, and capture the result in `config/registry.production.json` (the file scaffolded in slice 24).

This slice is HITL because it depends on stakeholder conversations — neither the page IDs nor the owner sign-offs can be derived from code. The output is a reviewable PR that flips the registry config from placeholders to real Confluence page IDs, with each entry's `owner` field naming a real person or team.

## Acceptance criteria

- [ ] Every URI listed in PRD §4.2 has a Confluence backing-id in `config/registry.production.json`.
- [ ] Every entry has an `owner` field naming the responsible team or person (no `<TBD>` placeholders).
- [ ] Domain owners (CTO/CIO, security, SRE, platform/DX, accessibility, compliance) have signed off on their slice of the mapping — captured in the PR description or a linked decision record.
- [ ] Smoke test: `REGISTRY_CONFIG=config/registry.production.json` startup against a Confluence test space succeeds; `resources/list` returns the expected URIs; `resources/read` on a sample of URIs returns rendered markdown.
- [ ] No URI in §4.2 left unmapped without an explicit deferral note in the PR.

## Blocked by

- Blocked by [23-registry-aliases.md](23-registry-aliases.md) (config schema must support aliases).
- Blocked by [24-registry-config-loader.md](24-registry-config-loader.md) (loader must accept production config).

## User stories addressed

- User story 19 (CTO/CIO Confluence updates propagate to all agents).
- PRD §4.2, §7.3.
