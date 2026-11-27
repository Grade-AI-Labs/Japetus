# Value and cost model

Read this once per session. It defines the units every case uses so that cases from different products and countries can be compared on one page.

## Five value categories

Every case has one primary category. A secondary category may be noted, but only the primary is ranked. The categories are generic SaaS categories and do not change; the company's investment drivers for the year (set by the CPO) are a mapping on top and are shown on the card next to the category.

| Category | What counts | How to measure it | Typical evidence | Current driver (2026) |
| --- | --- | --- | --- | --- |
| New ARR | New logos; tenders won where the feature is a differentiator | Deals per year × average ARR × share attributable to the feature | Lost-deal reasons, tender requirement lists, pipeline notes | ARR / Revenue growth |
| Expansion ARR | Cross-sell, upsell, price increase, pay-as-you-go volume | Accounts × adoption × price (× Talentech's share, for partner models) | Survey, Productboard votes, precedent product adoption | ARR / Revenue growth |
| Retained ARR | Churn avoided; tender eligibility kept; compliance or security needed to keep customers | ARR at risk × probability it leaves without this | Churn interviews, renewal risk list, tender hard requirements, regulation | Reduce churn |
| Cost savings | Internal hours removed, system or vendor cost removed, support tickets avoided | Hours per year × €75, or € per year | Support volumes, ops time studies, vendor invoices | Internal efficiency |
| Strategic / enabling | Unlocks other cases, platform leverage, M&A position, learning | No €. Names what it unlocks and how many products benefit | Dependent cases listed by name | Product vision / strategy |

Rules:

- Non-discretionary work (compliance, security, hard tender requirements, blocking tech debt) uses the same template with no special lane. It is valued as retained ARR: the ARR of the customers or tenders that would be lost without it. A tender hard requirement is worth the ARR of the tenders it gates.
- Strategic cases rank on effort and on the € of the cases they unlock, not on a € of their own. If a € can be attached to what it unlocks, use that category instead.
- Value is € per year at the stated point in time (the run-rate at 12 or 36 months after launch), not cumulative revenue.
- For partner models where Talentech invoices the customer, value is what Talentech invoices; the partner's share goes into yearly cost after launch. This keeps gross margin visible.

## Value by tier

| Tier | What the PM gives | How it is ranked |
| --- | --- | --- |
| Small, Medium | One 12-month band and one line of evidence | Band midpoint |
| Large | Low / base / high at 12 and 36 months, with the formula and each assumption visible | Base at 12 months |

Bands for value at 12 months (€ ARR or € saved per year):

| Band | Range | Midpoint used for ranking |
| --- | --- | --- |
| XS | under 25k | 12k |
| S | 25k to 100k | 60k |
| M | 100k to 500k | 300k |
| L | 500k to 2M | 1.2M |
| XL | over 2M | 2.5M |

## Evidence ladder and confidence

The skill proposes the confidence from the best evidence the PM can point to. The PM may override, with a written reason that goes on the card. Two PMs with the same evidence should end up with the same number; that is why the ladder exists.

| Level | Evidence | Proposed confidence |
| --- | --- | --- |
| 1 | Opinion, anecdote, a few customer mentions | 30% (or lower) |
| 2 | Internal data: usage telemetry, support tickets, lost-deal notes, Productboard votes | 50% |
| 3 | Customer-validated: survey with n stated, interviews, prototype test, signed letters of intent | 70% |
| 4 | Piloted with paying customers, or precedent data from a comparable product we launched | 90% |

Evidence must be named on the card ("in-product survey, n=303, April 2026"), not described ("a survey showed strong demand").

## Effort and cost

Build effort is entered per discipline as people × share of time × weeks, in person-weeks (pw). Discipline groups: development (FE, BE, lead), UX and research, product, other organisation (sales enablement, implementation, support, marketing, legal). Discovery time counts as effort.

- Build cost € = total pw × 40 h × €75/h. One loaded rate for every discipline, so that cases compare; the rate is a company parameter, not something a PM chooses.
- Who estimated: PM alone / PM with tech lead or dev manager / team estimate. Recorded on the card. Not a sign-off, but a medium or large case marked "PM alone" is visible as such.
- Yearly cost after launch (separate line, never merged into build cost): hosting and infrastructure, licences, partner or vendor fees including revenue share, expected support load in hours × €75, maintenance share. Optional for small and medium, required for large.

## Tier rule

| Tier | Base rule (total build effort) | Forum |
| --- | --- | --- |
| Small | under 4 pw | Product & Tech steering group |
| Medium | 4 to 20 pw | Product & Tech steering group |
| Large | over 20 pw, or any trigger | Management team, after steering group review |

Triggers that make a case large regardless of effort: new pricing, packaging or revenue stream; a partner, vendor or reseller contract; more than one product affected or a shared service; capacity needed from outside the owning team; a new category of sensitive data or a legal position the company has not taken before.

## Derived numbers

Compute these; never ask the PM for them.

- Value per effort = base 12-month value € ÷ build cost €. Band midpoint for small and medium.
- Payback months (large only) = build cost € ÷ ((base 12-month value € − yearly cost after launch €) ÷ 12). If the denominator is zero or negative, write "no payback: yearly cost after launch exceeds 12-month value"; if the result is over 60 months, write "over 60 months at the 12-month run-rate". A case with no payback is still a valid case (it may be strategic or retained ARR); the card just has to say so.
- Confidence-weighted value = base 12-month value × confidence. Shown on the card; not used for ranking unless the steering group decides otherwise.

`scripts/case_math.py` computes all of these and the tier from a JSON file of the answers; see the docstring for the format. Doing it by hand is fine for small cases.

## Worked example of a large-case value formula

Expansion ARR for a transactional add-on sold through the ATS, 12 months after launch:

recruitments per year in our systems (650,000) × share that use the service today (15%) × adoption of our version in year 1 (3%) × price per use (€125) = €366k invoiced; Talentech keeps 40%, the partner's 60% (€220k) goes to yearly cost after launch.

Each factor is named, sourced and challengeable on its own. A case that gives only the product of the factors cannot be reviewed.
