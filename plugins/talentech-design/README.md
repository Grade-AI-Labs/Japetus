# talentech-design

Skills for Product Design.

## Install

```
/plugin marketplace add Grade-AI-Labs/Japetus
/plugin install talentech-design@talentech-agentic-skills
```

Depends on [`talentech-core`](../talentech-core): `grill-ux-flow` runs core's `grilling` interview.

## What ships

| Skill | Use it to |
| --- | --- |
| `/talentech-design:brief` | Write a structured design brief: problem, goals, constraints, success criteria |
| `/talentech-design:readiness` | Turn an issue, ticket or PRD fragment into design-ready requirements and decide how much design involvement it needs |
| `/talentech-design:grill-ux-flow` | Grill one user flow (path, decisions, actors, states, Duo components, accessibility, localisation) into a flow spec, then hand it to `figjam-flow` to draw. A wrapper over `talentech-core:grilling` |
| `/talentech-design:figjam-flow` | Build or standardise editable flows in FigJam with formal flowchart conventions and Duo colours |
| `/talentech-design:wireframe` | Create wireframes and interactive prototypes to get feedback early |
| `/talentech-design:design-handoff` | Write or update the handoff page for the team that builds a feature: decision, flow, components, UX copy, states, accessibility, open questions, change log |
| `/talentech-design:content` | Write and review Talentech English product copy: UI strings, errors, empty states, emails |
| `/talentech-design:translate` | Translate product and UX content into supported locales with approved terminology |

## Notes

- `content` and `translate` carry their language standards and per-locale guidance in `references/`.
- Each skill also has an `agents/openai.yaml` and `assets/icon.svg`, left over from its original packaging. Claude Code ignores them.
