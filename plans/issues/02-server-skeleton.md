# 02 — MCP server skeleton with one hardcoded resource (no auth)

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Stand up a minimal MCP server over Streamable HTTP that exposes exactly one resource, `conventions://prs/review-checklist`, with hardcoded markdown content. No authentication, no adapter abstraction, no tools, no prompts — just enough to validate the MCP primitive layer end-to-end from Claude Code. Corresponds to Phase 0 Spike in PRD §7 (minus the auth and search bits, which arrive in slices 3 and 6).

The point is to prove the transport and resource surface work before layering any plumbing on top.

## Acceptance criteria

- [ ] Server starts locally and serves MCP over Streamable HTTP.
- [ ] `resources/list` returns exactly one resource with the full metadata shape from PRD §6.2 (`uri`, `name`, `description`, `mimeType`, `annotations` including `audience`, `priority`, `lastModified`).
- [ ] `resources/read` on `conventions://prs/review-checklist` returns non-empty markdown.
- [ ] Resource description is load-bearing per PRD §6.2 — written to drive fetch decisions, not just labelling.
- [ ] Claude Code can register the server (local/dev) and attach the resource in a conversation turn.
- [ ] Integration test exercises `resources/list` and `resources/read` against the running server.

## Blocked by

- Blocked by [01-foundations.md](01-foundations.md)

## User stories addressed

- Use case 1 (PR description/review) — first concrete resource that feeds it.
- PRD §7 Phase 0 Spike.
