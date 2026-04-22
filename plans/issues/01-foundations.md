# 01 — Foundations: language/runtime, deployment target, repo layout

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

HITL

## What to build

Lock in the foundational decisions every subsequent slice depends on: language/runtime for the server, deployment target (where `talentech-standards` runs in production), and repo layout. Capture as a short ADR alongside the PRD so later slices reference a single source rather than re-deciding.

Scope:

- Pick language/runtime (TypeScript/Node vs Python vs other) with a one-paragraph rationale.
- Pick deployment target (Azure Container Apps / AKS / other Talentech-hosted surface) and confirm it can terminate Streamable HTTP with Entra OAuth in front.
- Agree on repo layout: where the server code lives, where source adapters live, where curated content (for the filesystem adapter) lives, where ADRs live.
- Confirm CI surface for the repo (PR checks, container build, deploy pipeline skeleton).

## Acceptance criteria

- [ ] ADR committed under `docs/adr/` (or chosen location) recording language, deployment target, and repo layout with rationale.
- [ ] Repo skeleton exists: top-level directories for server, adapters, content, docs/ADRs, tests.
- [ ] CI workflow runs on PRs (lint + typecheck + tests; no deploy yet).
- [ ] README points at the PRD and the ADR so contributors start in the right place.

## Blocked by

None — can start immediately.

## User stories addressed

Enables all five MVP use cases listed in PRD §4 by unblocking every subsequent slice.
