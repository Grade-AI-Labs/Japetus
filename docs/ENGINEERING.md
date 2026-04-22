# Engineering Standards & Workflows

This document defines shared engineering practices for `talentech-standards`.

---

## Root README.md policy

`README.md` exists to answer:

- what this repo is
- how to run it locally
- where to find canonical documentation

Agents should update `README.md` when dev commands change, ports or startup steps change, or links to docs move.

Agents should not describe feature behavior, list MCP tool/prompt contracts, or include URI namespaces. Canonical documentation lives under `docs/`, `docs/features/`, and the PRD at `plans/prds/MCP.md`.

---

## Testing standards

- **Framework**: Vitest
- **Test suffix**: `*.test.ts`
- **Location**: `tests/integration/` — the server is integration-first. Most behavior cuts through transport → auth → registry → adapter and is best exercised via the MCP `Client` against a running server.
- **Run all**: `npx vitest run`
- **Watch**: `npx vitest`
- **Single file**: `npx vitest run tests/integration/server.test.ts`
- **Coverage**: `npx vitest run --coverage`

Every new tool, prompt, resource adapter, or error path needs a test in `tests/integration/server.test.ts` (or a new file alongside it). Tests must use the `FilesystemAdapter` — never hit Confluence or Entra from CI. The `DevValidator` accepts any bearer and grants all scopes for test runs.

Integration tests use a per-test temp directory seeded with fixture content; tear it down in `afterEach`.

---

## TypeScript standards

- Strict mode enabled, `noUncheckedIndexedAccess` on
- Avoid `any` — use `unknown` and narrow at trust boundaries
- Validate external input with `zod` (tool input schemas, Confluence API responses)
- Prefer `import type` for type-only imports
- Module target is `NodeNext`; use `.js` extensions in relative imports (e.g. `import { Registry } from './registry.js'`)

**Typecheck command:**

```bash
npx tsc --noEmit
```

---

## Naming conventions

- Source files: `snake_case.ts` (e.g. `search_standards.ts`, `write_prd.ts`). This deviates from the TypeScript community default of `kebab-case.ts` — we match the on-the-wire MCP tool/prompt names so file name == registered name, making grep trivial.
- Types / Interfaces / Classes: `PascalCase`
- Functions / variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Test files: `snake_case.test.ts`
- One `register<Thing>(server, ctx)` exported per tool/prompt file

---

## Error handling

Use the MCP error codes from [`src/errors.ts`](../src/errors.ts) consistently, per PRD §6.8:

- `-32002` — resource not found (unknown URI, or backing resource removed upstream)
- `1001` — `notEntitled` — token is valid but lacks the required scope for this URI or tool
- `1002` — `upstreamUnavailable` — adapter's source (Confluence, filesystem) is unreachable; the client should fall back to cached copy if present

Do not swallow errors in adapters. Do not return empty results when the intent was an error. Use typed helpers: `resourceNotFound(uri)`, `notEntitled(scope, uri?)`, `upstreamUnavailable(source, detail?)`.

Log errors via `audit(...)` on the failing path; the audit entry carries the error code for downstream analysis.

---

## Authentication

- **Mechanism**: OAuth 2.0 / OIDC via `jose` (JWKS validation against Entra)
- Authorization code flow for Claude Code / Cursor; client-credentials flow for CI (see [`docs/ci-client-credentials.md`](ci-client-credentials.md))
- Never hardcode tenant IDs or audiences — they come from `ENTRA_TENANT_ID` and `ENTRA_AUDIENCE` env vars
- Validate token signatures and expiry on every request (`src/auth/entra.ts`)
- Enforce scopes on every tool call and resource read (`src/auth/scopes.ts` — `requireScope(principal, scope, uri?)`)
- `AUTH_MODE=dev` bypasses validation and grants all scopes — ONLY for local development; never use in any environment with real data
- Audit logging captures the `sub` claim so every tool/resource access is attributable to a principal

---

## MCP protocol

- Match PRD §6 for every surface: URIs are stable, source-agnostic, unversioned; descriptions on resources/tools/prompts are load-bearing and drive agent fetch decisions
- Every resource read returns `etag` and `lastModified` in `_meta` per PRD §6.7
- Adapter change events invalidate cache entries and fire `notifications/resources/list_changed` — keep this contract when adding a new adapter
- New tools go in `src/tools/`; new prompts in `src/prompts/`; each exports a single `register<Name>(server, ctx)` function called from `src/server.ts`
- Adding a new source adapter: implement `SourceAdapter` from `src/adapters/types.ts` and register it in `buildAdapters()` via env-var config

---

## CI/CD

- CI runs via GitHub Actions — workflow files in `.github/workflows/` (currently `ci.yml`)
- Pipeline: `npm ci` → `npm run lint` → `npm run typecheck` → `npm test`
- Check workflow status: `gh run list`, `gh run view <id>`
- All workflow checks must pass before merging PRs
- Deployment target is Azure Container Apps (per ADR 001). Build image with the included `Dockerfile`. Deploy pipeline is not yet wired — add a workflow when a staging environment exists.

---

## Issue linking

- Reference issues in commits and PRs: `Fixes #123`, `Relates to #123`
- Use `Fixes` to auto-close on merge; use `Relates to` for cross-references
- Create issues via `gh issue create`
- Implementation slices in `plans/issues/*.md` are canonical; when a GitHub issue is opened to track one of them, cross-reference the slice path in the issue body

---

## Commands reference

```bash
npm ci                            # install dependencies
npm test                          # run all tests
npx vitest run <path>             # run a single test file
npm run test:watch                # watch-mode tests
npm run typecheck                 # npx tsc --noEmit
npm run dev                       # dev server (node --watch, native TS)
npm run build                     # tsc -p tsconfig.json → dist/
npm run start                     # node dist/server.js
npm run lint                      # prettier --check . && tsc --noEmit
npm run format                    # prettier --write .
docker build -t talentech-standards . # container image
```

For local dev against the real seed corpus:

```bash
AUTH_MODE=dev CONTENT_DIR=$(pwd)/content npm run dev
```

---

## Completion checklist

Before marking work complete:

- [ ] Tests written before implementation
- [ ] All tests passing (`npx vitest run`)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Naming conventions followed
- [ ] Errors handled with correct MCP error codes
- [ ] Auth scopes enforced on any new tool / resource
- [ ] Audit logging added for any new tool call or resource read
- [ ] Feature docs updated if contract/schema/invariant changed (see `docs/AGENTS_FEATURES.md`)
