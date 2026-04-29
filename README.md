# Japetus

Org-wide MCP server that surfaces Talentech's coding standards, runbooks, templates, and service ownership to any MCP-capable coding agent (Claude Code, Cursor, VS Code/Copilot Chat agent, …). Renamed from `talentech-standards`.

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
│   ├── filesystem.ts         # reads markdown from CONTENT_DIR (default config/fixtures/content/)
│   └── confluence.ts         # Confluence REST + storage-format → markdown
├── tools/                    # search_standards, get_resource, …
├── prompts/                  # write_prd, review_pr, …
├── auth/
│   ├── entra.ts              # OAuth 2.1 / Entra token validation
│   └── scopes.ts             # standards:read, kb:read:*, catalog:read
└── audit/logger.ts

config/                       # registry configs (dev + production example)
└── fixtures/content/         # DEV/TEST/OFFLINE fixtures only — not production content
catalog/                      # who_owns MVP stub (replaced in issue 33)
docs/                         # ADRs, onboarding guides
tests/                        # integration + unit tests
```

## Deployment

Target: Clever Cloud as a Docker container (per PRD §7.3 / §11). The same image is OCI-portable to any other container host. Build image with the included Dockerfile; the app accepts config via env vars. ADR [docs/adr/001-foundations.md](docs/adr/001-foundations.md) is being superseded by a follow-up ADR capturing the Clever Cloud decision.

CI/CD lives in [`.github/workflows/japetus-ci-cd.yml`](.github/workflows/japetus-ci-cd.yml): `Test`, `Lint`, and `Build` run on every push and PR; `Deploy` to Clever Cloud fires on push to `master`. Required repo secrets: `CLEVER_TOKEN`, `CLEVER_SECRET`, `JAPETUS_PRODUCTION_APP_ID`. Per-environment Clever env vars (Entra, Confluence, AppSignal, OTEL, `REGISTRY_CONFIG`) are configured on the Clever app itself.
