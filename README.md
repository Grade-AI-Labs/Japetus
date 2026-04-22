# talentech-standards

Org-wide MCP server that surfaces Talentech AI Labs' coding standards, runbooks, templates, and service ownership to any MCP-capable coding agent (Claude Code, Cursor, VS Code/Copilot Chat agent, …).

**Status:** in development.

- **PRD:** [plans/prds/MCP.md](plans/prds/MCP.md)
- **Implementation plan:** [plans/issues/](plans/issues/)
- **Foundations ADR:** [docs/adr/001-foundations.md](docs/adr/001-foundations.md)

## Quick start (local dev)

```
npm install
npm run dev
```

The server listens on `http://localhost:3333/mcp` by default. See [docs/client-setup.md](docs/client-setup.md) for wiring Claude Code, Cursor, and CI agents.

## Architecture

See PRD §5 for the three-layer model. The server itself is a thin, opinionated surface over pluggable source adapters (filesystem at launch + Confluence; add more through the `SourceAdapter` contract in [`src/adapters/types.ts`](src/adapters/types.ts)).

## Layout

```
src/
├── server.ts                 # MCP server entry
├── transport.ts              # Streamable HTTP wiring
├── registry.ts               # URI → (adapter, backing_id) resolver
├── cache.ts                  # ETag / TTL cache
├── errors.ts                 # MCP error codes (PRD §6.8)
├── adapters/
│   ├── types.ts              # SourceAdapter interface (PRD §6.5)
│   ├── filesystem.ts         # reads markdown from content/
│   └── confluence.ts         # Confluence REST + storage-format → markdown
├── tools/                    # search_standards, get_resource, …
├── prompts/                  # write_prd, review_pr, …
├── auth/
│   ├── entra.ts              # OAuth 2.1 / Entra token validation
│   └── scopes.ts             # standards:read, kb:read:*, catalog:read
└── audit/logger.ts

content/                      # filesystem-adapter-backed markdown
catalog/                      # who_owns static JSON (MVP stub)
docs/                         # ADRs, onboarding guides
tests/                        # integration tests
```

## Deployment

Target: Azure Container Apps (ADR [docs/adr/001-foundations.md](docs/adr/001-foundations.md)). Build image with the included Dockerfile; the app accepts config via env vars.
