---
name: grill-ux-flow
description: Grill the user about one user flow until it is specified well enough to draw and build, then write it up as a flow spec.
disable-model-invocation: true
argument-hint: "Which flow? (a feature, PRD, ticket or Figma link helps)"
---

# Grill a UX flow

Before the first question, read [references/checklist.md](references/checklist.md) and [references/flow-spec.md](references/flow-spec.md). Then call the Skill tool with "talentech-core:grilling" and run the interview by its rules, including its section on wrapper skills. This skill supplies the _what_: one stage, its checklist and its template.

Grill **one** flow. If the user's flow turns out to be several, agree which one this session covers and log the others as Open.

**Look it up before asking.** Check the conversation, attachments and connected tools (Figma, FigJam, Confluence, Jira) for the feature, PRD, existing screens or an existing flow. If a lookup answers a question, state the finding and its source in one line instead of asking. Do not invent steps, actors or decision outcomes.

## Output

When the stage is settled, write the flow spec in chat with the template in `references/flow-spec.md`, walk the user through it section by section, and revise it until they confirm it. Do not create or change a FigJam or Figma file.

Then offer, in one line, the next step:

- `/talentech-design:figjam-flow` to draw the confirmed flow in FigJam (its "Plan before drawing" list is this spec's first sections), or
- `/talentech-design:brief` when the flow turned out to be part of larger design work that needs a brief first.
