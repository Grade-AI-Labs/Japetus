# 14 — Prompt: `write_prd`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement the `write_prd` prompt from PRD §6.4 with arguments `topic`, `product?` (Varbi/ReachMee/Jobtip/Talmund), `ticketing?`. The prompt body embeds resource URIs (e.g. `templates://prd` plus any relevant conventions) that the client resolves at invocation — so every call picks up current templates without the prompt needing redeployment.

This is the first prompt and the one that replaces the Mimas `write-a-prd-irecommend` skill per PRD §11. Per PRD §10 open question #3, MVP produces text only — ADO delegation is Phase 3 composition.

## Acceptance criteria

- [ ] Prompt registered with arguments `topic`, optional `product`, optional `ticketing`.
- [ ] Prompt body embeds `templates://prd` via resource URI; client resolves at invocation.
- [ ] `product` argument influences output (product-specific conventions attached if present in corpus).
- [ ] MVP does not file ADO work items (text-only per PRD §10 #3).
- [ ] Mimas `write-a-prd-irecommend` skill is marked for deprecation with a documented migration path (`AGENTS.md` guidance: use the server-provided prompt).
- [ ] Integration test: invoking the prompt resolves embedded URIs and returns a prompt that references the current template.

## Blocked by

- Blocked by [09-seed-corpus.md](09-seed-corpus.md)

## User stories addressed

- Use case 4 ("Draft a PRD for feature X").
- PRD §6.4 (Prompts), §11 (relationship to existing work).
