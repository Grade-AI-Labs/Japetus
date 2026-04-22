---
title: Pull Request Description Template
description: Canonical PR description template for Grade AI Labs repositories.
owner: platform-eng
---

> **Placeholder content.** This document is seeded for the `grade-standards` MCP
> server. HITL review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Copy the block below into every PR description. Keep sections even when empty —
write "N/A" rather than deleting them.

## Template

```markdown
## Summary

One or two sentences. What does this PR change?

## Motivation

Why now? Link the ADO work item or incident. If this unblocks other work, say so.

## Change list

- File or subsystem: what changed and why.
- Keep each bullet scoped to a single idea.
- Call out generated or vendored code explicitly.

## Test plan

- [ ] Unit tests added or updated.
- [ ] Integration tests run locally (`<command>`).
- [ ] Manual verification steps (screenshots or recordings for UI work).
- [ ] Rollout gate checks (flags, migrations, feature toggles).

## Rollback

How do we revert if this breaks production? Include:

- Safe revert: `git revert <sha>` is sufficient / not sufficient.
- Data migrations: reversible? migration id?
- Feature flags: kill switch name and default.

## Risk & blast radius

Who is affected if this is wrong? Internal only? A single tenant? All users?
```

## Rules

- Do not merge with an empty section. Fill or write "N/A".
- One PR, one logical change. Split refactors from behaviour changes.
- Link the ADO work item in the title or the Motivation section — not only in
  the branch name.
- Screenshots go under Test plan, not Summary.
- If the PR touches secrets, auth, or PII, tag `@security` and note it under
  Risk & blast radius.

## Reviewer expectations

- Read Summary and Motivation first. If those are unclear, request changes
  before reading the diff.
- Confirm Test plan matches the diff. A PR that changes behaviour without a
  test is a request-changes by default.
- Check Rollback is real, not aspirational.

## Anti-patterns

- "Minor refactor" with 40 files changed. Split it.
- "See ADO" with no summary. Reviewers should not need another tab to know
  what this PR does.
- Test plan that says "tested locally" with no steps. List the steps.
