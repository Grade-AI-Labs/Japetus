# business-case

Skill for Talentech product managers: interviews the PM and writes a comparable business case (case card, case page, and an 8-slide management deck for large initiatives).

## Contents

| Path | What it is | When Claude reads it |
| --- | --- | --- |
| `SKILL.md` | The workflow: interview stages, tier rule, challenge pass, outputs | Always, when the skill triggers |
| `references/value-and-cost-model.md` | Five value categories, bands, evidence ladder, cost formula, derived numbers | Once per session, before the interview |
| `references/interview-guide.md` | Question bank per stage and tier, follow-ups, challenge pass | During the interview |
| `references/case-template.md` | Exact templates for small, medium and large cases, the comparison row, Confluence setup | When writing the case |
| `references/deck-outline.md` | The eight slides and design notes | When writing the deck (large cases) |
| `references/confluence.md` | Where cases live in Confluence (page IDs) and how the skill creates a case page and adds its comparison row | When posting a case |
| `examples/` | A finished large case (Background Checks, illustrative), a small case (fictional), and a large case where the numbers do not work (fictional) | For the shape, depth and honesty expected |
| `scripts/case_math.py` | Computes tier, build cost, value per effort, payback and proposed confidence from a JSON of answers | Optional; the formulas are also in the reference |
| `scripts/build_deck.py` | Builds the 8-slide management deck on the company template from a JSON spec (python-pptx) | Large cases, when writing the deck |
| `examples/background-checks-deck-spec.json` | A complete deck spec, the input `build_deck.py` expects | As the template for a new deck spec |
| `assets/talentech-template.potx` | Talentech Templates, Standard Set 2025: the company PowerPoint template every deck is built on | By `build_deck.py`, or by hand per `references/deck-outline.md` |
| `assets/confluence-*.md` | Markdown sources of the two live Confluence pages | Only to recreate a lost page |

## Confluence

Cases are child pages of **Business cases** (space Talentech Internal / HRMTS, page 2758246493, under Product Team Workspace), which holds the comparison table. The hand-written template is **Business case template** (page 2758180952). Both exist; the skill never recreates them.

## Company parameters

Decided November 2026. Change them in `references/value-and-cost-model.md` and at the top of `scripts/case_math.py`; cases never carry their own.

- Loaded rate: €75/h, 40 h per person-week, one rate for all disciplines
- Tier bands: under 4 / 4 to 20 / over 20 person-weeks
- Value bands at 12 months: under 25k / 25 to 100k / 100 to 500k / 500k to 2M / over 2M €
- Confidence by evidence level: 30 / 50 / 70 / 90%
- Triggers to large: pricing or packaging change; partner, vendor or reseller contract; more than one product or a shared service; capacity outside the owning team; new sensitive data category
- Forums: small and medium to the Product & Tech steering group; large to the management team after steering group review
- Language: interview in the PM's language, case always in English

## Changing the investment drivers

The five value categories are stable. When the CPO's drivers change, update the "Current driver" column in `references/value-and-cost-model.md` and the note on the comparison page; no case needs rewriting.
