# talentech-product

Skills for Product Management.

## Install

```
/plugin marketplace add Grade-AI-Labs/Japetus
/plugin install talentech-product@talentech
```

Depends on [`talentech-core`](../talentech-core): `grill-prd` runs core's `grilling` interview and publishes the finished PRD to Confluence with core's `push-to-confluence`.

## What ships

| Skill | Use it to |
| --- | --- |
| `/talentech-product:grill-prd` | Take a new idea from raw problem to a developer-ready PRD by grilling, in two gated stages: lock the problem statement first, then write the PRD with goals, non-goals, edge cases, success metrics and risks. A wrapper over `talentech-core:grilling` with Talentech product context (Reachmee, Talentrecruiter, Webcruiter, Varbi, GDPR, EU AI Act) |

`grill-prd` replaces `problem-to-prd`. It runs the same two stages, but asks in batched rounds like every grilling skill rather than one question per turn.
