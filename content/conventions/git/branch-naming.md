---
title: Branch Naming
description: Conventions for Git branch names at Talentech AI Labs.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Branch names are metadata. They show up in CI dashboards, release notes, and
PR titles. Keep them short, mechanical, and informative.

## Format

```
<type>/<work-item>-<short-slug>
```

- `<type>`: one of `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`.
- `<work-item>`: ADO ID when one exists, e.g. `ab12345`. Omit if there is
  genuinely no tracking item (rare).
- `<short-slug>`: kebab-case, 2–5 words, describe the change.

## Examples

- `feat/ab12345-signed-webhook-urls`
- `fix/ab48210-middleware-connection-leak`
- `chore/ab50001-bump-node-24`
- `docs/update-oncall-rotation`

## Rules

- Lowercase only. No underscores, no camelCase.
- No personal prefixes. Do not use `olof/feat-xyz` or `@username/...`.
  Ownership lives in the PR, not the branch name.
- No ticket-only branches (`fix/ab12345`). Always include a slug so the name
  is scannable without opening ADO.
- Keep slugs under ~40 chars. Truncate, do not pad.
- Do not reuse branch names after merge. Create fresh branches for follow-ups.

## Long-running branches

- `main` is the only long-running branch.
- Release branches (`release/2026.04`) are allowed for multi-sprint stabilization
  and must be approved by the release captain.
- No `dev` or `develop` branch. Feature branches merge directly to `main`.

## Deletion

- Delete branches on merge (auto-delete enabled in GitHub repo settings).
- Stale branches (>30 days, no commits, no open PR) are pruned monthly.
