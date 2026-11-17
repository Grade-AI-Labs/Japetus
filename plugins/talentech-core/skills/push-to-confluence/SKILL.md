---
name: push-to-confluence
description: "Publish ad-hoc content to Confluence: either create a new child page under a parent page the user supplies, or append content to that page. Verifies what content to push before writing, and offers to summarise the current session's key takeaways when no explicit content is given. Use when the user wants to push, publish, save, or send content / notes / a summary to Confluence under a specific page, or says 'put this into Confluence'. Do NOT use for formal phase-transition handoff artifacts or Productboard briefs (those have their own workflows) — those write structured, templated pages into a Feature's Handoffs container."
---

Push ad-hoc content to Confluence under a page the user names. Two modes: **create** a new child page under that page, or **append** content into that page's body. This skill is for general, one-off publishing — not structured phase-handoff artifacts or Productboard briefs, which have their own workflows. If the request is clearly one of those, stop and say so.

All Atlassian MCP calls use `cloudId: talentechgroup.atlassian.net`. If that fails, call `getAccessibleAtlassianResources` to resolve the current cloudId rather than guessing.

## 1. Resolve the target page

The user supplies a Confluence URL or page ID. Extract the page ID:

- Standard URL `…/wiki/spaces/SPACE/pages/{ID}/Title` → `{ID}` is the numeric segment after `/pages/`.
- Tiny link `…/wiki/x/{id}` → pass the encoded `{id}` to `getConfluencePage` as the page ID.

Call `getConfluencePage` to confirm it exists and to capture its title and space. **Refuse to proceed if** the page can't be read — tell the user the URL/ID didn't resolve and stop. Never create the target page yourself; the user names an existing page.

## 2. Decide what content to push

Establish exactly what's being published *before* asking where:

- If the user pointed at something specific (a draft, a section, "the table above", a named artifact), use that and show it back so they can confirm.
- If the content is ambiguous or none was given, **offer to summarise the key takeaways of the current session** — propose the summary and show it.
- Never invent facts, quotes, names, dates, or numbers that weren't in the conversation. If a needed detail is missing, write `TODO: [what's needed]` rather than filling the gap.

Confirm the content with the user before moving on. This is the verification step — do not skip it.

## 3. Decide create vs append

Default to **create a new child page** — it's non-destructive. Ask the user explicitly:

> "Create a new child page under *{target title}*, or append this to *{target title}* itself?"

For **create**, also confirm the new page's title (suggest one from the content if the user doesn't give one).

## 4. Write — only after explicit confirmation

Publishing modifies Confluence. Confirm the final action in one line ("Creating child page *X* under *Y*" / "Appending to *Y*") and wait for a clear yes before any write call.

**Create (preferred):**
`createConfluencePage` with `parentId` = the target page ID, the confirmed title, and the body as `contentFormat: markdown`. New page in the same space as the parent. Non-destructive — no round-trip risk.

**Append (use with care — destructive by replacement):**
`updateConfluencePage` replaces the *entire* body; it is not a delta. To append safely:

1. `getConfluencePage` with `contentFormat: markdown` to get the current body.
2. Concatenate: existing body + a separator (`\n\n---\n\n`) + the new content.
3. `updateConfluencePage` with the **full combined body**, `contentFormat: markdown`.

Warn the user before doing this: the page is rewritten in full, and the markdown round-trip can degrade existing rich formatting (panels, layouts, complex tables). If the existing page has rich content worth preserving, recommend creating a child page instead. Never write back only the new content — that destroys the page.

## 5. Report

Return the page URL (`https://talentechgroup.atlassian.net/wiki/…`) and one line on what was done: created child *X* under *Y*, or appended N lines to *Y*. List any `TODO:` markers left in the content.

## Refuse to proceed if

- The target URL/ID doesn't resolve to a readable page.
- The content is empty and the user declines the session-summary offer.
- The user hasn't confirmed both the content and the create/append choice.
- The request is actually a structured handoff or Productboard brief — route to the correct skill instead.
