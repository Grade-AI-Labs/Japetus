# 17 — Prompt: `onboard_repo`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement the `onboard_repo({ repo_url })` prompt from PRD §6.4. Generates an `AGENTS.md` draft from repo inspection plus org defaults, composing the relevant conventions from the corpus (language-specific style, git conventions, testing conventions, PR conventions). This is the Phase 3 prompt per PRD §7.

The prompt embeds enough conventions that the resulting `AGENTS.md` draft references `grade-standards://` URIs for anything that should be pulled live (per PRD §11: "`AGENTS.md` can reference `grade-standards` resources by URI for anything that should be pulled live").

## Acceptance criteria

- [ ] Prompt registered with argument `repo_url`.
- [ ] Prompt body composes language-appropriate convention URIs (detected from repo or provided).
- [ ] Prompt guides the agent to produce an `AGENTS.md` draft that links to `grade-standards` URIs rather than duplicating content.
- [ ] Integration test exercises the prompt against a sample repo URL and validates the shape of the referenced URIs.

## Blocked by

- Blocked by [09-seed-corpus.md](09-seed-corpus.md)
- Blocked by [14-write-prd-prompt.md](14-write-prd-prompt.md)

## User stories addressed

- PRD §6.4 (Prompts).
- PRD §7 Phase 3.
- PRD §8 success metric: "Displacement — reduction in repos shipping full conventions in `AGENTS.md` vs linking to `grade-standards`."
