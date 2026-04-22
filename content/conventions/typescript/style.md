---
title: TypeScript Style
description: TypeScript coding conventions for Grade AI Labs applications and libraries.
owner: platform-eng
---

> **Placeholder content.** Seeded for the `grade-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Target: TypeScript 5.4+, Node 24+ (latest LTS). Apply to all new packages.

## Compiler

Enable in every `tsconfig.json`:

- `"strict": true`
- `"noUncheckedIndexedAccess": true`
- `"noImplicitOverride": true`
- `"exactOptionalPropertyTypes": true`
- `"noFallthroughCasesInSwitch": true`

Do not ship code with `// @ts-ignore` or `// @ts-expect-error` without a linked
issue and a date to remove it.

## Module layout

- One concept per file. Export from `index.ts` at the package root.
- Prefer named exports. Default exports only for React components and Next.js
  route handlers where the framework requires them.
- Co-locate tests: `foo.ts` and `foo.test.ts` in the same directory.
- Do not import across package boundaries via relative paths. Use the
  workspace alias.

## Types

- Prefer `type` aliases for unions and primitives; `interface` for object
  shapes that may be extended.
- No `any`. If you truly need an escape hatch, use `unknown` and narrow.
- Use `readonly` aggressively for arrays, tuples, and object fields that are
  not mutated after construction.

## Error handling

- Use a Result type (neverthrow, or a local `Result<T, E>`) at module
  boundaries. Do not throw across packages.
- Exceptions are acceptable inside a module for truly exceptional cases
  (programmer errors, invariant violations).
- Never swallow errors. `catch (e) { /* ignore */ }` is a bug.
- Narrow caught values: `catch (e) { if (e instanceof MyError) ... }`.

## Async

- No floating promises. Every `Promise` is either `await`ed, returned, or
  explicitly handed to a tracked task.
- Enable `@typescript-eslint/no-floating-promises` — error, not warn.
- Prefer `Promise.all` for independent work. Do not serialize awaits by accident.
- Cancellation: pass `AbortSignal` through any function that does I/O.

## Validation at trust boundaries

- Parse all external input (HTTP bodies, queue messages, env vars, file
  contents) with `zod` schemas. Do not trust `as SomeType` for inbound data.
- Define the schema once; derive types with `z.infer<typeof Schema>`.
- Fail closed: reject unknown fields by default (`.strict()`).

## Logging

- Use `pino` with structured JSON output. No `console.log` in production code.
- No secrets or PII in logs. See
  `content/conventions/compliance/gdpr-pii-handling.md`.

## Formatting & lint

- Prettier with repo defaults. Do not override per-file.
- ESLint with `@typescript-eslint` strict config. CI fails on warnings.
