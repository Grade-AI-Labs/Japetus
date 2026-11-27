# Case templates

Three templates, one per tier. The card is identical in all three: 14 fields, same order, so a Confluence comparison page can list cards side by side. Everything is written in English. Replace the angle-bracket placeholders; delete nothing from the card.

## The card (all tiers)

```markdown
# <Title>

| Field | Value |
| --- | --- |
| Owner, date | <PM name>, <YYYY-MM-DD> |
| Product(s) and portfolio position | <ReachMee (Invest & grow); Webcruiter (Maintain)> |
| Tier and forum | <Large: management team, after steering group review> (<reason: effort 82 pw; triggers: partner contract, shared service>) |
| Primary value category, maps to driver | <Expansion ARR> → <ARR / Revenue growth> |
| Value at 12 months | <Band M (100k to 500k €)> or <low 0.2M / base 0.37M / high 0.6M €> |
| Value at 36 months | <n/a for small and medium> or <low 2.0M / base 4.0M / high 10.5M €> |
| Confidence, evidence | <70%, level 3: in-product survey n=303 (April 2026), 12 customer interviews> |
| Build effort, cost | <82 pw (dev 36, UX 21, product 10, other 15); €246k at €75/h> |
| Who estimated | <PM with tech lead> |
| Yearly cost after launch | <€240k: partner share 60% of invoiced (€220k), licences €4k, maintenance 4 pw (€12k)> or <none> |
| Value per effort, payback | <1.5; payback 22 months> or <1.2; payback n/a> |
| Top risk, kill criterion | <Scattered needs across markets; stop if fewer than 3 of 5 pilots convert by month 8> |
| Why now | <HD ruling Feb 2025 pushes buyers to licensed providers; losing Refensa deals to Refapp> |
| Success metric, target, review | <€ invoiced from background checks at 12 months after launch; target €366k; review <date>; owner <PM>> or <n/a> |

**Open questions:** <what the PM could not answer, one per line; or "none">

**Notes:** <tier disagreement, confidence override and its reason; or "none">
```

Card conventions:

- Value is € per year as a run-rate at the stated month. For partner models, value is what Talentech invoices; the partner's share is in yearly cost after launch.
- Effort is total person-weeks with the split by discipline in brackets. Cost is pw × 40 × €75.
- Confidence states the level and names the evidence; "strong demand" is not evidence, "survey n=303, April 2026" is.
- "n/a" is only valid where the template says a tier may skip the field.

## Small case

The card, open questions and notes. Nothing else. Target: fits on half a page, written in under 15 minutes of interview.

## Medium case

The card, then:

```markdown
## Problem and who has it
<Segment, role, what they do today, what it costs them. 3 to 5 sentences.>

## Proposed solution and scope
<What we build, in a paragraph. MVP scope in one list; what is explicitly out.>

## Value and evidence
<The category, the band and why that band. The evidence, named. One paragraph.>

## Risks
| Risk | Mitigation | Kill criterion |
| --- | --- | --- |
| <risk 1> | <mitigation> | <what would make us stop> |
| <risk 2> | | |
| <risk 3> | | |

## Plan
<Who, when, in one or two lines. Optional success metric and review date.>
```

## Large case

The card, then nine sections. Written as a pre-read: a management team member should be able to decide without the PM in the room.

```markdown
## 1. The ask
<One sentence: approval to build X with team Y over Z months. The decision needed at this forum.>

## 2. Problem and who has it
<Segment, role, what they do today, what it costs them per year. Why it is a problem for Talentech, not only for them.>

## 3. Proposed solution and scope
<What we build and how it works, one or two paragraphs.>

| MVP | Maybe later | Probably never |
| --- | --- | --- |
| <item> | <item> | <item> |

## 4. Value logic
<The formula in words, then the table. Each assumption with its source.>

| Factor | Low | Base | High | Source |
| --- | --- | --- | --- | --- |
| <volume> | | | | |
| <share> | | | | |
| <adoption, 12 months> | | | | |
| <adoption, 36 months> | | | | |
| <price> | | | | |
| <our share> | | | | |
| **Value at 12 months (€/year)** | | | | derived |
| **Value at 36 months (€/year)** | | | | derived |

## 5. Evidence and confidence
<What was done: survey (n, date), interviews (how many, which segment), prototype tests, precedent product data. The resulting level and confidence. What a comparable precedent showed.>

## 6. Alternatives considered
| Alternative | Why rejected |
| --- | --- |
| Do nothing | <cost of not doing, in €> |
| <partner / buy / deepen existing integration> | <one line> |

## 7. Cost
| Role | Share of time | Weeks | Person-weeks | Cost (€75/h) |
| --- | --- | --- | --- | --- |
| <role> | | | | |
| **Total build** | | | <pw> | <€> |

Yearly cost after launch: <table or lines: partner share, hosting, licences, support hours, maintenance share; total>.
Who estimated: <PM with tech lead>. Payback: <months>.

## 8. Risks and plan
| Type | Risk | Mitigation | Kill criterion (observation, date) |
| --- | --- | --- | --- |
| Market | | | |
| Legal and compliance | | | |
| Technical | | | |
| Partner or vendor | | | |
| Execution | | | |

Plan with gates:
| Stage | Duration | What it produces | Gate decision |
| --- | --- | --- | --- |
| <Pre-discovery> | <4 weeks> | <partner terms, prototype test> | <go / no-go> |
| <MVP> | | | |
| <Expansion> | | | |

Team: <names and roles>.

## 9. Success metric and review
<Metric, target, review date, owner. What "worked" looks like in one sentence.>
```

## Comparison row

After writing any case, print its card as one row of the comparison table. The table lives on the Confluence page **Business cases** (space HRMTS, page 2758246493); the skill adds the row there through the Atlassian connector, or the PM pastes it.

```markdown
| Title | Owner | Product(s) | Tier | Category | Value 12m (base €) | Confidence | Effort (pw) | Build cost (€) | Value/effort | Top risk | Why now | Review date | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <title, linked to the case page> | <PM> | <products> | <tier> | <category> | <€ or band midpoint> | <%> | <pw> | <€> | <ratio> | <one line> | <one line> | <date or n/a> | Submitted |
```

Status is set by the forum afterwards (Submitted, Reviewed, Approved, Declined, Built, Reviewed after launch). The steering group sorts the table by value per effort and groups by category to check the spread against the investment drivers.

## Confluence pages (exist, do not recreate)

- **Business cases**, page 2758246493: parent of every case page; holds the comparison table, the tier and category tables and the process.
- **Business case template**, page 2758180952: the page a PM copies for a hand-written case.
- Procedure for creating a case page and adding its row: `references/confluence.md`. The markdown sources of both pages are in `assets/`, only for recreating them if they are ever lost.
