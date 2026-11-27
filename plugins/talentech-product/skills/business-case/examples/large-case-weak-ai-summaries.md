# Example: large case where the numbers do not work

Fictional. Shows how the case reads when value is far below cost: the template does not soften it, and the challenge pass ends with concrete questions back to the PM. The PM gave all answers up front (see `evals/large-case-triggers-and-math/prompt.md`). The card and sections are abridged to what the example needs to show; a real large case fills all nine sections.

# AI interview summaries: paid add-on in ReachMee

| Field | Value |
| --- | --- |
| Owner, date | PM ReachMee (name), 2026-11-05 |
| Product(s) and portfolio position | ReachMee (Invest & grow) first; Varbi (Stay relevant & harvest) later; shared service |
| Tier and forum | Large: management team, after steering group review (triggers: new pricing, more than one product / shared service; effort 29 pw) |
| Primary value category, maps to driver | Expansion ARR (per-seat add-on) → ARR / Revenue growth |
| Value at 12 months | low €7.2k / base €14.4k / high €21.6k per year |
| Value at 36 months | low €21.6k / base €32.4k / high €43.2k per year |
| Confidence, evidence | 50%, level 2: 14 Productboard votes; usage data shows 60% of interviews get a written summary. No customer interviews yet |
| Build effort, cost | 29.1 pw (dev 21, UX 2.4, product 4.2, other 1.5); €87k at €75/h |
| Who estimated | PM alone |
| Yearly cost after launch | €13.5k: LLM API €9k, support 60 h (€4.5k) |
| Value per effort, payback | 0.16; over 60 months at the 12-month run-rate |
| Top risk, kill criterion | Summary quality in Norwegian and Finnish; stop if fewer than 5 of 10 beta customers rate summaries usable by week 8 after launch |
| Why now | Competitors have shipped similar features; two tenders this spring asked for AI summaries |
| Success metric, target, review | Paid seats at 12 months; target 240; review 12 months after launch; owner PM |

**Open questions:** whether the two tenders would be lost without the feature (if yes, this is retained ARR and the tender ARR belongs on the card); whether €60 per seat per year is the right price or a floor; what the AI platform team's gateway costs the case in capacity.

**Notes:** confidence of 80% requested by the PM; no reason given, so the proposed 50% stands. Effort estimated by the PM alone for a 29 pw build touching two products.

## 4. Value logic

Recruiter seats × adoption × price per seat per year.

| Factor | Low | Base | High | Source |
| --- | --- | --- | --- | --- |
| Recruiter seats, ReachMee | 1,200 | 1,200 | 1,200 | Licence data |
| Adoption at 12 months | 10% | 20% | 30% | PM assumption; no precedent named |
| Adoption at 36 months | 30% | 45% | 60% | PM assumption |
| Price per seat per year | €60 | €60 | €60 | PM assumption (€5 per user per month) |
| **Value at 12 months (€/year)** | 7,200 | 14,400 | 21,600 | derived |
| **Value at 36 months (€/year)** | 21,600 | 32,400 | 43,200 | derived |

## 7. Cost

| Role | Share of time | Weeks | Person-weeks | Cost (€75/h) |
| --- | --- | --- | --- | --- |
| Backend developers (2) | 80% | 10 | 16.0 | €48,000 |
| Frontend developer | 50% | 10 | 5.0 | €15,000 |
| UX | 40% | 6 | 2.4 | €7,200 |
| Product | 30% | 14 | 4.2 | €12,600 |
| Legal review | 20 h | | 0.5 | €1,500 |
| Sales enablement | 40 h | | 1.0 | €3,000 |
| **Total build** | | | **29.1** | **€87,300** |

Yearly cost after launch: €13,500. Who estimated: PM alone. Payback: over 60 months; the 12-month base value (€14.4k) barely covers the yearly cost after launch (€13.5k).

## What the challenge pass returned to the PM

1. Value logic: the assumption that kills the case is price, not adoption. At €60 per seat per year, even 100% adoption (€72k) does not reach the build cost. What price did the two tenders imply, and what do competitors charge?
2. Effort: estimated by the PM alone for a two-product shared service. What does the ReachMee tech lead say, and what is the AI platform team's share?
3. Risks: the kill criterion is good (5 of 10 beta customers by week 8). The procurement risk has no criterion yet: what observation, by when?
4. Doing nothing: if the two spring tenders would be lost without this, that is retained ARR and belongs on the card as the primary category. What is their ARR?

Recommendation to the PM before submitting: either reframe as retained ARR with the tender figures, or raise the price assumption with evidence, or scope it down to a small case (summaries without the paid add-on) and let adoption data decide the pricing later.
