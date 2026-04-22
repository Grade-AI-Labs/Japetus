# ADR 001 — Foundations: language, runtime, deployment, repo layout

**Status:** Accepted
**Date:** 2026-04-22
**Supersedes:** n/a
**PRD reference:** [plans/prds/MCP.md](../../plans/prds/MCP.md), slice [plans/issues/01-foundations.md](../../plans/issues/01-foundations.md)

## Context

`talentech-standards` is an MCP server that must speak Streamable HTTP to MCP-capable agents, validate OAuth 2.1 tokens from Entra, project content from Confluence (and later other sources) through a curated surface, and run as a long-lived service. The choice of language, runtime, deployment target, and repo layout propagates through every later slice.

## Decisions

### Language/runtime: TypeScript on Node.js ≥ 24 (latest LTS)

- Official MCP SDK (`@modelcontextprotocol/sdk`) is first-class in TypeScript; most ecosystem examples and tutorials target it, keeping contributor ramp-up short.
- JS-native JSON and schema tooling (`zod`) makes the MCP request/response shape easy to type against.
- Node 24 entered Active LTS in October 2025 and is the latest LTS at the time of writing. Azure Container Apps ships up-to-date Node base images. Pin the minimum to 24 so contributors don't ship code that passes locally but breaks on older runtimes.

### Deployment target: Azure Container Apps

- Talentech already runs workloads on Azure (confirmed by existing ADO MCP integration referenced in the PRD).
- ACA terminates HTTPS, supports long-lived Streamable HTTP connections, and can front Entra auth via the platform's managed identity + app registration.
- Horizontal scaling is built in, which matters once every developer agent is hitting the server on most turns.
- Alternative considered: Azure App Service (rejected — less first-class for OCI images), AKS (rejected — operational overhead not justified for a single service).

### Transport: Streamable HTTP (per PRD §6.6)

- Matches MCP client expectations in Claude Code and Cursor (both natively speak Streamable HTTP).
- SSE is the legacy fallback; not needed at launch.

### Auth: OAuth 2.1 with Entra as upstream IdP

- Matches PRD §6.6 directly.
- Token validation uses JWKS (`jose` library) rather than bespoke crypto.
- Three scopes: `standards:read`, `kb:read:<space>`, `catalog:read`.

### Repo layout

```
src/
├── server.ts                 MCP server entry: registers resources/tools/prompts
├── transport.ts              Streamable HTTP handler
├── registry.ts               URI → (adapter, backing_id)
├── cache.ts                  ETag + TTL cache (PRD §6.7)
├── errors.ts                 MCP error codes (PRD §6.8)
├── adapters/
│   ├── types.ts              SourceAdapter contract (PRD §6.5)
│   ├── filesystem.ts
│   └── confluence.ts
├── tools/                    one file per tool; each exports register(server)
├── prompts/                  one file per prompt; each exports register(server)
├── auth/                     Entra validation, scope enforcement
└── audit/                    audit log emitter

content/                      markdown backing the filesystem adapter
catalog/                      static who_owns JSON (MVP)
docs/                         ADRs, onboarding docs
tests/                        integration tests (use filesystem adapter per PRD §6.5)
plans/                        PRDs + issue slices (pre-existing)
```

One file per tool/prompt so new surfaces are additive and reviewable in isolation. Adapters are behind a single interface so source swaps are localized to one module.

### CI

- GitHub Actions workflow runs on every PR: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`.
- No deploy step in CI yet — added in a later slice once a staging environment exists.

## Consequences

- All subsequent slices write TypeScript.
- All tool/prompt authors pattern-match on the `register(server)` shape.
- Integration tests run against a filesystem adapter and do not require Confluence or Entra — CI stays cheap and hermetic (PRD §6.5).
- Migrating to a different deployment target later is contained to Dockerfile + ops config, not source code.

## Rejected alternatives

- **Python / FastMCP**: MCP SDK exists but the TypeScript SDK has broader client parity in our stack. Rejected.
- **Monorepo with separate packages per adapter**: premature given there are only two adapters at launch. Revisit if we add a third non-trivial adapter.
