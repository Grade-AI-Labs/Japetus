---
title: Python Style
description: Python coding conventions for Grade AI Labs services and libraries.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `grade-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Target: Python 3.12+. Apply to all new code. Legacy code migrates opportunistically.

## Formatting

- Use `ruff format` (Black-compatible). No manual formatting debates.
- Line length 100. No exceptions for URLs or long strings — wrap or extract.
- One statement per line. No semicolons.
- Run `ruff check --fix` on save. CI fails on lint errors.

## Typing

- Full annotations on every public function, method, and module-level constant.
- `mypy --strict` must pass. No `# type: ignore` without a comment explaining why.
- Prefer `TypedDict`, `Protocol`, and `dataclass` over ad-hoc dicts.
- Use `from __future__ import annotations` in every module.
- No `Any` at API boundaries. Internally, use sparingly and justify.

## Imports

Group imports in three blocks, separated by a blank line:

1. Standard library.
2. Third-party.
3. First-party / local.

Within each block, sort alphabetically. `ruff` enforces this. No relative
imports across package boundaries — use absolute paths rooted at the package.

## Error handling

- Catch the narrowest exception class that makes sense. Never `except:` or
  `except Exception:` without re-raising or logging with context.
- Define domain exceptions in a `errors.py` module per package.
- Do not use exceptions for control flow.
- Re-raise with `raise` (bare) to preserve the traceback. Use `raise X from e`
  when translating.

## Logging

- Use the stdlib `logging` module with a structured handler (JSON in prod).
- Never use f-strings in log calls. Use `%`-style so the logger can defer
  formatting and so log aggregation can group by template:
  ```python
  logger.info("user login", extra={"user_id": user_id, "tenant": tenant})
  ```
- Do not log secrets, tokens, or PII. See
  `content/conventions/compliance/gdpr-pii-handling.md`.
- Log levels: DEBUG internal trace, INFO business events, WARNING recoverable,
  ERROR requires attention, CRITICAL page someone.

## Concurrency

- Prefer `asyncio` for I/O-bound code. Do not mix threads and asyncio in the
  same module.
- No bare `asyncio.create_task` — always hold the reference and `await` or
  track in a task group.

## Testing

- See `content/conventions/testing/unit.md` and `.../integration.md`.
- Use `pytest`. No `unittest.TestCase` in new code.
