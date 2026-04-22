# AGENTS.md

Read these files at the start of every session before doing any work:

1. `docs/AGENT_WORKFLOW.md` — workflow and operating rules
2. `docs/AGENTS_FEATURES.md` — when and how to update feature docs
3. `docs/FEATURES.md` — feature index
4. `docs/ENGINEERING.md` — engineering standards

When working inside `src/`, also read `src/AGENTS.md`.

---

`talentech-standards` is a TypeScript/Node.js MCP server that surfaces Talentech AI Labs' coding standards, runbooks, templates, and service ownership to any MCP-capable coding agent (Claude Code, Cursor, VS Code Copilot Chat). It speaks Streamable HTTP, authenticates via Microsoft Entra OAuth 2.1, and projects curated content from pluggable source adapters (filesystem + Confluence today) through stable URI namespaces. The product intent lives in [`plans/prds/MCP.md`](plans/prds/MCP.md); the foundational decisions in [`docs/adr/001-foundations.md`](docs/adr/001-foundations.md).

## CRITICAL — Non-negotiable rules for all agents

### Test-Driven Development (MANDATORY)

**Write tests before implementation code.**

When creating or changing anything:

1. STOP — do not write implementation first
2. Write failing tests (RED)
3. Run tests and confirm failure: `npx vitest run <path>`
4. Write minimal code to pass tests (GREEN)
5. Refactor while keeping tests green

This applies to all code — tools, prompts, adapters, registry routing, auth, caching, and audit. Integration tests live under `tests/integration/` and exercise the server through an MCP `Client`.

### TypeScript correctness (MANDATORY)

Before completing any task:

1. Run `npx tsc --noEmit`
2. Fix all TypeScript errors
3. Do not consider work complete until it exits with code 0

### Formatting (MANDATORY)

Before completing any task:

1. Run `npm run lint` (runs `prettier --check .` plus `tsc --noEmit`)
2. Run `npm run format` to fix formatting drift if needed
3. Do not consider work complete until lint exits with code 0

## Most important rule

After any change that affects API contracts, URI namespaces, tool/prompt shapes, auth scopes, adapter contracts, or error codes: update the relevant `docs/features/<slug>.md` as part of the same task — not as a follow-up. New feature area → create `docs/features/<slug>.md` and add an entry to `docs/FEATURES.md` (alphabetical).

## Structure of further instructions

- **Agent workflow & operating rules:** `docs/AGENT_WORKFLOW.md`
- **Engineering standards:** `docs/ENGINEERING.md`
- **Feature documentation contract:** `docs/AGENTS_FEATURES.md`
- **Feature index:** `docs/FEATURES.md`
- **Feature docs:** `docs/features/`
- **Source instructions:** `src/AGENTS.md`
- **Product PRD:** `plans/prds/MCP.md`
- **Implementation slices:** `plans/issues/01-foundations.md` … `20-staleness-dashboard.md`
- **Foundational ADR:** `docs/adr/001-foundations.md`

Keep this file minimal. Do not duplicate detailed rules here.

## Completion checklist

Before marking work complete:

- [ ] Tests written before implementation
- [ ] All tests passing (`npx vitest run`)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Naming conventions followed (snake_case files, PascalCase types, camelCase values)
- [ ] Errors handled with the right MCP error code (`-32002` not-found, `1001` not-entitled, `1002` upstream-unavailable)
- [ ] Feature docs updated if contract/schema/invariant changed (see `docs/AGENTS_FEATURES.md`)
- [ ] PR opened with summary and linked issues
- [ ] CI checks passing
