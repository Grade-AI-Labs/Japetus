---
name: design-handoff
description: Write or update a Talentech product design handoff page for the team that builds the feature. Use when a design is ready to build and needs a short handoff covering the decision, flow, design decisions, components, UX copy, states, accessibility, open questions and a change log. Not for status updates, PRDs, research plans or scope and timeline planning.
---

# Talentech design handoff

A handoff tells the people building the feature what the design decided and what to build, and links every source. It is short. It is not a PRD, a spec sheet or a project plan.

## Principles

1. **Explain decisions, not specs.** State what the design settled, in minimal detail. Point to components, tokens and the prototype instead of repeating values.
2. **Link, never duplicate.** Figma, prototype, states page, PRD, ticket and copy doc are linked from the header. If something exists elsewhere, link it.
3. **Product Design owns behavior; Product Management owns business.** The handoff contains behavior, flow, states and copy. It does not contain scope trade-offs, dates, priorities, success metrics or release plans. Do not ask product managers to confirm behavior details.
4. **Aim for one page**, roughly two screens of reading. Anything longer moves to a child page.
5. **Plain text for the flow.** Numbered steps a developer can read without opening the design.

## Inputs

Ask for what is missing, in this order:

- Ticket key and title
- Links: design file, prototype, states page, PRD (links only)
- The existing handoff page, if this is an update
- The parent page the handoff lives under (ask once per product; reuse it afterwards)
- Which components are used or new, and where the copy lives

Do not invent behavior. If the design does not say what happens, list it as an open question with an owner.

## Page template

Use these sections, in this order. Drop a section only where stated.

### 1. Header table
Ticket, status (Draft, Ready to build, Built), design owner, and links: design file, prototype, states page, PRD, copy doc. Nothing else.

### 2. Decision
What we are building and why this design, in 3–5 lines. Include only constraints that change the build. No business case.

### 3. Flow
- A numbered walkthrough of the happy path, written as what the user does and what the interface does.
- Then one line per branch: failure, cancel, empty, no permission, refusal, whichever apply.
- State where focus goes at each step that changes it.

### 4. Design decisions
A short list of choices engineers might otherwise reopen, each with a one-line reason. Format: **Decision**, because reason. Behavior and interaction only. Move alternatives considered to a child page.

### 5. Components
A table with columns: Component, Status (Existing, Changed, New), Variant or note.
- For existing components, name the variant and link the documentation. Do not restate specs.
- For new or changed components, describe behavior and give the status of any design system approval.

### 6. UX copy
- Link the copy source of truth. If there is no copy document, the strings live in the prototype or code: link that file, name it as the source, and say that changing copy means changing it there.
- Bring the most important strings onto the page in a short table (Where shown, String, Final or placeholder): primary actions, errors, refusals, confirmations, empty and loading messages, and anything legally or sensitively worded. Leave routine labels in the source. The designer decides what is Final. If the page, prototype or source does not say a string was reviewed, ask the designer; until they answer, mark it Placeholder. Never mark a string Final on your own.

### 7. States
A table with columns: State, When it happens, What the user sees, What the user can do. Cover every applicable state: default, loading (including slow and cancel), empty, partial, success, error, refusal or no-access, disabled, and anything specific to the feature. This is the section engineers build against, so it must be complete.

### 8. Accessibility
Target WCAG 2.2 AA. It replaces an older "2.1 AA" note: 2.2 AA includes every 2.1 AA requirement (except the obsolete 4.1.1), so it also covers customers who require 2.1 AA, such as Swedish public-sector customers. Say so in one line when the page previously named 2.1. Cover only what is not already guaranteed by the components:
- Focus order and where focus returns after a dialog, deletion or state change
- Keyboard behavior for anything custom
- Accessible names for icon-only controls
- Live regions: what is announced, and when
- Contrast or touch-target exceptions

### 9. Open questions
Blocking questions only. Each has an owner (Engineering, Product Management, Product Design) and what is assumed until answered. Omit the section when there are none.

### 10. Change log
A table of date, version, what changed, who. Add a row on every update. Keep entries to one line.

## Child pages, only when there is something to keep

Substantial material that would make the main page too long can move to a child page linked from the header: alternatives that were really considered, differences from the PRD or earlier prototypes, long copy tables, and a research plan that was actually discussed. Never create a child page for content that is not there. A page with one bullet, or a topic nobody has planned (for example research), is not material: drop it and note it in the change log.

## Where cut content goes

- **Business questions** (scope, dates, priorities, metrics, rollout) are settled by the designer before the handoff, so they do not appear on the page. If one is still open, the design is not ready to hand off: say so to the designer instead of writing it into the page.
- **Alternatives considered, PRD differences, a research plan** go to a child page linked from the header only when there is real content (see above). Thin mentions are dropped.
- Nothing is silently dropped. If content is removed outright because it is obsolete, say so in the change log.

## Comments on content you cut

Before removing or moving any content, read all the page comments: open, resolved and dangling (anchor already lost). Many tools return these separately, so check each list. Note which text each comment is anchored to.
- If the anchored text stays, leave it.
- If it moves, move it whole, including the anchored sentence, and reply on the thread with where it went.
- If it is deleted as obsolete, reply on the thread saying so and why.
- Replies are posted to other people, so the designer decides. If they do not want replies posted, keep the anchored text where it is. If it must go anyway, the comment becomes dangling: tell the designer which ones, and list them in the report and the change log.
- Never resolve or delete someone else's comment.
- List every affected comment in the change log row.

## Large pages

If the existing page is too large to read in one go, save it to a file and read it in parts or extract the headings first. Never edit from a truncated read.

## Writing rules

- Active voice, present tense, short sentences.
- Name controls the way the interface labels them.
- One fact in one place. If a decision appears in the flow, do not repeat it in the decisions list.
- Use tables for states and components, bullets for decisions and accessibility, numbers for the flow.
- No "intuitive", "user-friendly" or "as before". Say what happens.

## Boundary check

Before publishing, remove or move anything about: dates and timelines, priorities, scope cuts, success metrics, rollout, budget, or who approved the business case. If a decision mixes behavior and business, keep the behavior half and drop the rest.

## Final checklist

- [ ] Header links all resolve and nothing is copied from them
- [ ] The flow is readable without opening the design
- [ ] Every applicable state is in the table, including slow, failed and cancelled
- [ ] Focus return is stated wherever focus moves
- [ ] Every component is named with a status
- [ ] The most important strings are on the page, each marked final or placeholder
- [ ] Every open question has an owner and a stated assumption
- [ ] No business decisions on the page
- [ ] The page reads in about two screens
- [ ] A change log row was added for this version

## Publishing

Create the page under the agreed parent, titled `<TICKET> — Design handoff: <feature>`. When an existing title carries scope or release wording (for example "V1" or an option name), propose a neutral title in that format and ask the designer; renaming changes the displayed title but not the URL. Until they decide, keep the title and base the change log version on it. When updating, edit the existing page in place, keep its URL, and add the change log row. Share the link with the build team and note the version.

With the Atlassian Confluence tools:
- Read: `getConfluenceContent` (use `detail: outline` for headings, `full` before editing) and `getConfluencePageInlineComments` for comments.
- Create: `createConfluencePage` under the parent page id.
- Update: `updateConfluenceContent`, which takes the page's current `snapshotToken`; read the page again if the update is rejected as stale. Other connectors name these tools differently (for example `getConfluencePage`, `updateConfluencePage`); use the equivalent.
