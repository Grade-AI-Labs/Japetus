# 15 — Prompt: `review_pr`

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Implement the `review_pr` prompt from PRD §6.4 with arguments `pr_url` and `focus?` (`security`/`performance`/`accessibility`/`all`). The prompt body composes `conventions://prs/review-checklist` and `conventions://prs/description-template`, plus focus-specific conventions from the corpus depending on the `focus` argument.

## Acceptance criteria

- [ ] Prompt registered with arguments `pr_url`, optional `focus`.
- [ ] Prompt body embeds `conventions://prs/review-checklist` and `conventions://prs/description-template`.
- [ ] `focus=security` additionally includes `conventions://security/secrets-handling` and `conventions://security/dependency-policy`.
- [ ] `focus=accessibility` additionally includes `conventions://accessibility/wcag-baseline`.
- [ ] `focus=performance` includes relevant conventions if present in corpus (otherwise degrades gracefully).
- [ ] `focus=all` (default) includes the full set.
- [ ] Integration test exercises each `focus` value and verifies the expected URIs are referenced.

## Blocked by

- Blocked by [09-seed-corpus.md](09-seed-corpus.md)

## User stories addressed

- Use case 1 ("Write a PR description for this change").
- PRD §6.4 (Prompts).
