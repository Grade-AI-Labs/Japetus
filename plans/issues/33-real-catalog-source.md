# 33 — Replace static `catalog/services.json` with a real source of record

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL

## What to build

Phase 4 work per PRD §7.3 and §11 open question 3. The MVP `who_owns` tool is backed by a hand-maintained `catalog/services.json` stub. Production needs a real source of record so ownership data stays current as teams reorganize.

This slice is HITL because the system-of-record decision is upstream of any code: Backstage, an internal CMDB, a Confluence catalog page, or something custom. Likely warrants a separate small PRD before implementation begins. This issue tracks the decision plus the integration once the source is chosen.

## Acceptance criteria

- [ ] Catalog source-of-record selected; rationale captured (PRD or ADR).
- [ ] Adapter (or extension of an existing adapter) reads ownership data from the chosen source.
- [ ] `who_owns({ path })` returns the same shape as today (`{ team, primary_contact, slack_channel, repos[] }`).
- [ ] Integration test against a fixture / mock of the chosen source.
- [ ] Static `catalog/services.json` retired or repurposed as a fallback for offline dev.
- [ ] On-call / refresh-cadence behavior documented in `docs/features/`.

## Blocked by

- Likely blocked by a separate small PRD on catalog system-of-record selection.

## User stories addressed

- User story 16 (`who_owns` for routing questions).
- PRD §7.3, §11 open question 3.
