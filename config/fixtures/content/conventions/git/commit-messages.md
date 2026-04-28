---
title: Commit Messages
description: How to write commit messages at Talentech.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `Japetus` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Commit messages are read more than they are written. Write them for the person
doing `git blame` in two years.

## Format

```
<type>: <imperative summary, <=72 chars>

<body: why, not what. Wrap at 72 chars.>

Refs AB#12345
```

- Subject line is imperative: "Add retry to queue worker", not "Added" or
  "Adds".
- No trailing period on the subject.
- Blank line between subject and body.
- Body explains motivation, trade-offs, and context. Skip the body only for
  trivial changes (typos, lint fixes).

## Types

Use one of:

- `feat` — user-visible behaviour added.
- `fix` — bug fix.
- `refactor` — no behaviour change.
- `perf` — performance improvement.
- `docs` — documentation only.
- `test` — tests only.
- `chore` — build, deps, tooling.
- `revert` — reverts a prior commit (reference the SHA).

## Body rules

- Explain **why**. The diff shows **what**.
- Call out risky bits: data migrations, feature flags, breaking changes.
- Reference prior commits by SHA when relevant.
- If the change is non-obvious, describe the alternative you rejected.

## Work item links

- Every commit on a feature branch should reference the ADO work item:
  `Refs AB#12345` or `Fixes AB#12345`.
- If there is no work item, the change probably belongs in a different PR —
  ask before merging.

## Examples

Good:

```
fix: release db connection on middleware error

The auth middleware returned early on invalid tokens without releasing the
pooled connection, exhausting the pool under load. Wrap the handler in a
try/finally so release runs on all paths.

Fixes AB#48210
```

Bad:

```
fixed stuff
```

```
WIP
```

```
Update foo.ts, bar.ts, baz.ts
```

## Squashing

- Prefer merge-squash on PRs so `main` has one commit per logical change.
- Rewrite the squash commit to match this format — do not let GitHub
  concatenate your WIP messages.
- On long-running branches, rebase locally and clean up history before
  opening a PR.
