# 23 — Registry alias / `supersedes` resolution

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Add alias support to `src/registry.ts` per PRD §4.1 and §4.5: a URI can resolve to another URI's canonical entry, so renaming or merging conventions does not break consumers in onboarded repos.

Schema addition: each `ResourceEntry` may declare `aliases: string[]` (URIs that should resolve to this entry). The registry maintains a reverse map; `resolve(uri)` returns the canonical entry whether `uri` is canonical or an alias. `_meta` on resource reads always carries the canonical URI, never the alias, so cache keys stay consistent. This module is one of the three deep modules called out in PRD §4.11 — testable in isolation with a stub adapter.

## Acceptance criteria

- [ ] `ResourceEntry` accepts an optional `aliases: string[]`.
- [ ] `Registry.resolve(canonicalUri)` and `Registry.resolve(aliasUri)` return the same entry.
- [ ] `resources/read` on an alias URI returns the canonical content with the canonical URI in `_meta`.
- [ ] Cache key normalizes to canonical URI (no double-cached entries).
- [ ] Alias collision (two entries claiming the same alias) throws at registry seed time.
- [ ] Resolving an unknown URI still throws `-32002`.
- [ ] Integration test: register `conventions://prs/checklist` aliased to `conventions://prs/review-checklist`, read alias, assert canonical URI returned.
- [ ] Unit test: alias collision detection.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).

## User stories addressed

- User story 24 (retire/rename URI without breaking consumers via `supersedes`).
- PRD §4.5 (Registry seeding), §4.11 (Deep modules).
