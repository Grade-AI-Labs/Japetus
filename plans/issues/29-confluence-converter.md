# 29 — Harden Confluence storage→markdown converter

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Replace the minimal regex-based `storageToMarkdown` in `src/adapters/confluence.ts` with a proper HTML/Confluence-storage parser. The current implementation handles only headings, paragraphs, lists, inline code, and pre blocks via regex — production Confluence pages contain tables, panels, callouts, nested lists, image macros, code blocks with language hints, and Confluence-specific structured macros that the regex pipeline mangles or drops.

Pick a parser-based approach: e.g. `parse5` or `cheerio` for HTML walking, then either hand-render to markdown or use `turndown` with custom rules for Confluence-specific elements. Cover common Confluence-storage constructs against a fixture suite drawn from real (or representative) page samples.

## Acceptance criteria

- [ ] Dependency added (parser + markdown renderer); justified in the PR description.
- [ ] `storageToMarkdown` rewritten to use the parser; old regex pipeline removed.
- [ ] Fixture suite in `tests/integration/confluence-converter.test.ts` (or unit-level under `tests/`) covers: headings, paragraphs, ordered + unordered lists, nested lists, tables (simple), inline code, code blocks with language hints, Confluence panel/info/note macros (rendered as blockquotes or skipped cleanly), inline emphasis, images (rendered as markdown image syntax with alt text), links.
- [ ] No regressions on the smoke-test conversion currently exercised by integration tests.
- [ ] Unsupported constructs degrade gracefully (best-effort plain text) rather than emitting raw HTML.
- [ ] `docs/features/adapter-layer.md` notes the converter scope and known limitations.

## Blocked by

- Blocked by [21-rename-to-japetus.md](21-rename-to-japetus.md) (sequencing).

## User stories addressed

- User story 19 (CTO/CIO Confluence updates propagate cleanly to agents).
- PRD §4.5 (per-source format translation), §7.2.
