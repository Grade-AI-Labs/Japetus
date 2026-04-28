# `config/fixtures/`

**Dev/test/offline fixtures only — NOT production content.**

The markdown files under `content/` are loaded only when the active registry config (`REGISTRY_CONFIG`) is filesystem-backed — i.e. `config/registry.dev.json`. They exist so:

- `npm run dev` works without Confluence credentials.
- Integration tests can exercise the full server through a `FilesystemAdapter` against a tmpdir.
- Engineers offline can still read the corpus locally.

In production (`REGISTRY_CONFIG=config/registry.production.json`) every URI is backed by a Confluence page ID and these files are not read. Per PRD §4.2: "The 21 markdown files currently checked into `content/` are dev/test fixtures, not production content."

If you're editing a Talentech standard for real, edit it in Confluence — the registry config will pick up the change on the next polling interval. Editing files here only affects dev mode.
