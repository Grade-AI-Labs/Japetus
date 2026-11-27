# talentech-product

Skills for Product Management.

## Install

```
/plugin marketplace add Grade-AI-Labs/Japetus
/plugin install talentech-product@talentech-agentic-skills
```

Depends on [`talentech-core`](../talentech-core): `grill-prd` runs core's `grilling` interview and publishes the finished PRD to Confluence with core's `push-to-confluence`.

`business-case` posts cases to Confluence through the Atlassian connector, and builds the management deck with python-pptx. Without the connector it hands you the page and the comparison row to paste; without python-pptx it builds the deck by hand from the same outline.

## What ships

| Skill | Use it to |
| --- | --- |
| `/talentech-product:grill-prd` | Take a new idea from raw problem to a developer-ready PRD by grilling, in two gated stages: lock the problem statement first, then write the PRD with goals, non-goals, edge cases, success metrics and risks. A wrapper over `talentech-core:grilling` with Talentech product context (Reachmee, Talentrecruiter, Webcruiter, Varbi, GDPR, EU AI Act) |
| `/talentech-product:business-case` | Pitch, size or get approval for a feature or initiative. It interviews you and writes a comparable business case: a 14-field case card, a case page posted under **Business cases** in Confluence, and for large initiatives an 8-slide management deck on the company template. It runs its own one-question-at-a-time interview, not core's `grilling`. A business case for user research is `talentech-research:business-case` |

`grill-prd` replaces `problem-to-prd`. It runs the same two stages, but asks in batched rounds like every grilling skill rather than one question per turn.
