---
name: pull-from-confluence
description: "Fetch content from Confluence into the session to enrich context: resolve a page the user names (parent or child), let them describe which parts to pull (e.g. 'all child pages', 'the design pages', 'the PRD handoff'), then retrieve and summarise the matching page bodies. Use when the user wants to pull, fetch, read, load, or bring Confluence content into the conversation as context — e.g. 'fetch the DRC handoff', 'pull in the design pages', 'load the Background Checks project pages'. Do NOT use to publish, write, comment on, or modify content (use push-to-confluence for ad-hoc publishing) — this skill only reads."
---

Pull Confluence content into the current session as context. This skill **only reads** — it never creates, appends, comments on, or modifies Confluence. If the request is about publishing or writing, stop and route to `/talentech-core:push-to-confluence` (ad-hoc publishing).

All Atlassian MCP calls use `cloudId: talentechgroup.atlassian.net`. If that fails, call `getAccessibleAtlassianResources` to resolve the current cloudId rather than guessing.

## 1. Resolve the target page

A page URL or ID is required. Look for it in this order — only ask if none is found:

1. The skill invocation (a URL or ID passed alongside the command).
2. Earlier messages in the session (a page already discussed, linked, or fetched).
3. If neither, ask:
   > "Which Confluence page should I pull from? Paste a URL or page ID — it can be the parent of a tree or a single child page."

Extract the page ID:

- Standard URL `…/wiki/spaces/SPACE/pages/{ID}/Title` → `{ID}` is the numeric segment after `/pages/`.
- Tiny link `…/wiki/x/{id}` → pass the encoded `{id}` to `getConfluencePage` as the page ID.

Call `getConfluencePage` (with `contentFormat: markdown`) to confirm it exists and capture its title, space, and body. **Refuse to proceed if** the page can't be read — tell the user the URL/ID didn't resolve and stop. Never invent a page; the user names an existing one.

## 2. Establish what to fetch

If the user didn't already say which parts they want, **ask them to describe the scope** — don't guess. Typical scopes:

- **The page itself only** — just the body fetched in step 1.
- **All child pages / the whole subtree** — everything under the target.
- **A named subset** — "the design pages", "the PRD handoff", "the tech spec" — matched against child-page titles.
- **A keyword / topic** — matched against titles (and, if needed, content) across the subtree.

Resolve the described scope to an actual list of pages — always derive the list from a tool call, never from memory or assumption:

- **Page itself** → reuse the body from step 1; no further listing needed.
- **All children / subtree** → `getConfluencePageDescendants` with the target page ID. Set `depth` to cover the tree (default to the full subtree; cap `limit` sensibly). This returns the candidate pages with their titles and IDs.
- **Named subset / keyword** → list descendants as above, then match their titles case-insensitively against the user's description (e.g. "design" → titles containing "Design"; "prd handoff" → a Handoffs/PRD page). For a space-wide keyword search instead of a single tree, use `searchConfluenceUsingCql` (e.g. `text ~ "..." AND space.key = "innovation" AND type = page`) or `Atlassian:search` (Rovo) and confirm the hits.

If the description matches multiple plausible pages, or matches none, **show the candidate titles and ask which** rather than fetching everything blindly.

## 3. Confirm scope before fetching bodies

If the resolved scope is more than a handful of pages (roughly >5) or is at all ambiguous, **list the matched page titles and confirm before pulling all bodies** — fetching a large tree is slow and floods the session context. For a single obvious page, just fetch it without a round-trip.

## 4. Fetch the bodies

For each in-scope page, call `getConfluencePage` with `contentFormat: markdown`. Keep the `id`, `title`, and web URL alongside each body so they can be cited back later.

If one page fails to fetch, note it and continue with the rest — don't abort the whole pull.

## 5. Deliver into context

Make the pulled content usable, and be explicit about what was loaded:

- Lead with a one-line manifest: *N pages fetched from {target title}*, listing their titles.
- Then either (a) inline the specific content the user asked about, or (b) if it's a large pull, give a structured per-page digest (title → key points) while keeping the full bodies available to draw on for the rest of the session.
- **Preserve facts, names, dates, and numbers exactly as written** — this is source material the user may rely on; don't paraphrase away specifics or invent detail that isn't on the page.
- Note any pages that failed to fetch.

If the user already stated what they intend to do with the content, proceed; otherwise confirm the content is loaded and ask what they want next.

## Refuse to proceed if

- No page URL/ID is available and the user won't provide one.
- The target URL/ID doesn't resolve to a readable page.
- The scope can't be resolved to real pages (no descendants, no search hits) and the user can't clarify.
- The request is actually about writing or publishing — route to `/talentech-core:push-to-confluence` instead.
