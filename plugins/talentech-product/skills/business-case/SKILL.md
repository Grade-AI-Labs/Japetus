---
name: business-case
description: Interview a product manager and write a comparable business case (case card, one-page case, and for large initiatives an 8-slide management deck) for a feature or initiative at Talentech. Use this whenever a PM wants to pitch, prioritise, size, or get approval for a feature, initiative, shared service, integration, or product idea; when someone mentions a business case, case card, prioritisation, value vs effort, the steering group, or the management team; when a PM asks "is this worth building" or "how do I get this on the roadmap"; and when comparing two initiatives against each other, even if the word "business case" is never used.
---

# Business case for a product initiative

This skill turns a PM's idea into a case that can be put next to every other case in the product organisation. It interviews the PM one question at a time, computes the tier from the answers, challenges weak spots (hardest for large cases), then writes the case in a fixed format. Cases are compared across products by the Product & Tech steering group (small and medium) and the management team (large), so the fields and units are the same for everyone. Comparability is the whole point: a persuasive deck that cannot be compared is worth less to the forum than a plain card that can.

## What you produce

Every tier gets a **case card** (14 fixed fields) at the top of a **case page** in English, ready for Confluence. Medium and large cases add sections below the card. Large cases also get an **8-slide management deck** generated from the case. Exact templates: `references/case-template.md`. Examples of finished cases: `examples/`.

## Before the interview

Read `references/value-and-cost-model.md` once per session; it holds the five value categories, the bands, the evidence ladder and the formulas. Read `references/interview-guide.md` for the question bank. Then start. Do not ask the PM to read anything.

Language: run the interview in the language the PM writes in (Swedish, Norwegian, Danish, Finnish or English). Write the case, the card and the deck in English regardless, because cases from different countries sit side by side in the comparison.

## The interview

Ask one question at a time and wait for the answer. A list of twelve questions gets twelve shallow answers; one question at a time gets the detail the forum will ask for anyway. Accept "I don't know" and record it as an open question under the card rather than inventing a number. Never fill in a value, effort or risk the PM did not give.

Push past adjectives. "Many customers ask for it" becomes "how many, which ones, and where is that recorded?". "A few weeks of dev" becomes "which people, what share of their time, how many weeks?". The forum will ask exactly these questions; it is kinder to ask them now.

The interview runs in five stages. Stages 1 and 2 are the same for every tier; the tier (announced after stage 2) sets how deep stages 3 to 5 go.

### Stage 1: Frame (2 to 4 questions)

What the initiative is in one sentence; who has the problem (segment, role) and what they do today; which product(s) it touches and their portfolio position (Introduce & scale / Invest & grow / Stay relevant & harvest / Maintain / Exit); the PM owning it.

### Stage 2: Size (2 to 4 questions)

Build effort per discipline as people × share of time × weeks: development (FE, BE, lead), UX and research, product, and other parts of the organisation (sales enablement, implementation, support, marketing, legal). Who produced the estimate: PM alone, PM with a tech lead or dev manager, or a team estimate. Then the five triggers as one yes/no checklist:

1. New pricing, packaging or revenue stream
2. A partner, vendor or reseller contract
3. More than one product affected, or a shared service
4. Capacity needed from outside the owning team
5. A new category of sensitive data, or a legal position the company has not taken before

Compute the tier (rule below) and say it out loud with the reason: "This is a large case because it needs a partner contract, so the next questions go deeper." PMs accept a long interview when they know why it got long.

### Stage 3: Value (2 to 8 questions)

Primary value category, one of five: new ARR, expansion ARR, retained ARR, cost savings, strategic/enabling. Retained ARR is also where compliance, security and tender hard requirements go: they are revenue at risk, not zero value. Then the number:

- Small and medium: a 12-month value band (under 25k / 25 to 100k / 100 to 500k / 500k to 2M / over 2M € per year) and one line of evidence.
- Large: low, base and high at 12 and 36 months after launch, with the formula and every assumption named (for example: recruitments × share using checks × adoption × price × Talentech's share).

Ask what evidence exists, place it on the evidence ladder (1 opinion or anecdote, 2 internal data, 3 customer-validated, 4 piloted or precedent product) and propose the confidence (30 / 50 / 70 / 90%). The PM may override, but has to give one written reason that goes on the card. Finish with "why now": is there a window, a tender, a regulation, a competitor? Cost of delay is a comparator too.

### Stage 4: Risk and plan (1 to 8 questions)

Small: the one risk that worries the PM most and what would make them stop. Medium: the top three risks with mitigations and kill criteria, a one-line plan, and yearly cost after launch if any. Large: risks by type (market, legal and compliance, technical, partner, execution), each with a mitigation and a kill criterion; a staged plan with gates (what evidence each gate needs); scope as three lists (MVP, maybe later, probably never); alternatives considered including doing nothing; yearly cost after launch (partner fees, hosting, licences, support hours, maintenance share) as a required line.

### Stage 5: Accountability (0 to 3 questions)

Large (required) and medium (optional): one success metric in the same unit as the value category, a target, a review date, and who runs the review. This is decided at approval, not after launch, because an estimate nobody is ever measured against drifts optimistic.

## Tier rule

Total build effort in person-weeks sets the base tier; any trigger from stage 2 makes it large regardless.

| Tier | Build effort | Forum | Case | Interview depth |
| --- | --- | --- | --- | --- |
| Small | under 4 person-weeks | Steering group | Card only | 6 to 8 questions, no challenge |
| Medium | 4 to 20 person-weeks | Steering group | Card + one page | Full interview, gaps flagged |
| Large | over 20 person-weeks, or any trigger | Management team, after steering group review | Card + 2 to 3 pages + deck | Full interview + challenge pass |

The PM never picks the tier. If the PM disagrees with the computed tier, record the disagreement as a note on the card; the steering group can reclassify. Effort decides the forum, so the "who estimated" field matters: a large case estimated by the PM alone is shown as such.

## Challenge pass (large cases only)

Run it after stage 5 and before writing anything. It attacks four things in order, and it does not move on until each answer is concrete. The purpose is not to kill the case; it is to make sure the management team hears the weak spot from the PM rather than discovering it in the meeting.

1. **Value logic.** Which single assumption, if halved, kills the case? What is the evidence for that assumption specifically, not for the idea in general?
2. **Effort.** What is not in the estimate: migration, other products, support training, legal review, the second and third partner? What happened to the last estimate this team made?
3. **Risks.** For each risk: what observation would make you stop, and by which date?
4. **Doing nothing.** What does it cost, in €, to not do this for a year? If the answer is "nothing measurable", the case is strategic, not revenue, and should say so.

Answers the PM cannot give become open questions under the card. Answers the PM struggled with become the "prepared objections" in the deck's speaker notes. Medium cases get the same questions in a lighter form and are not blocked by them.

## Writing the case

Compute the derived numbers before writing (formulas in `references/value-and-cost-model.md`, or run `scripts/case_math.py` on a JSON of the answers):

- Build cost € = total person-weeks × 40 hours × €75 (one loaded rate for every discipline, so cases compare)
- Value per effort = base 12-month value € ÷ build cost € (band midpoint for small and medium)
- Payback months (large) = build cost ÷ ((base 12-month value − yearly cost after launch) ÷ 12)
- Proposed confidence from the evidence level

Then fill the template for the tier from `references/case-template.md`. The card is a single table with exactly the 14 fields in the given order, because a Confluence comparison page lists cards side by side and the steering group sorts on them. Keep the card's numbers identical to the numbers in the sections below it; a case that contradicts itself loses the room.

Under the card, list open questions (what the PM could not answer) and notes (tier disagreement, confidence override reason). Write in plain English, short sentences, numbers with units. No adjectives where a number should be.

After writing, print the card once more as a single table row in the format given at the end of `references/case-template.md`; it is the row that goes into the comparison table on the Business cases page, by the connector or by hand.

## Writing the deck (large cases)

Build eight slides from the case on the company template, `assets/talentech-template.potx`, following `references/deck-outline.md`: fill a copy of `examples/background-checks-deck-spec.json` with the case's content and run `scripts/build_deck.py`, or follow the layout mapping by hand when the script cannot run. The deck is generated from the case, never written separately, so it cannot drift from the numbers the steering group reviewed. Prepared objections go in speaker notes. Render the result and check every slide for text running into the footer or the next element before handing it over.

## Posting to Confluence

Cases live in Confluence, space Talentech Internal (HRMTS), as child pages of **Business cases** (page 2758246493, https://talentechgroup.atlassian.net/wiki/spaces/HRMTS/pages/2758246493/Business+cases), which also holds the comparison table. A template page for hand-written cases sits under it (page 2758180952). `references/confluence.md` has the exact procedure; read it before posting.

When the Atlassian connector is available: after the PM has confirmed the card, create the case page as a child of 2758246493, then add the case's row to the comparison table on that page (replace the "No cases yet" row if it is still there, otherwise append), with status Submitted, and give the PM the page URL. Never rewrite the rest of the parent page from memory; fetch it, change the one table, write it back. Without the connector: hand the PM the page content and the row, and point them at the two pages. Either way, the page's first element is the card table.

## Things that go wrong

- The PM gives a year-3 number and no year-1 number. Ask for both; the 36-month figure alone hides slow ramps.
- Revenue share or partner fees get left out of cost. They go in "yearly cost after launch", which is required for large cases, so a partner-based service never looks like pure software margin.
- The value category is "strategic" because the PM would rather not commit to a number. Ask what it unlocks and which cases depend on it; if a € can be attached to those, use retained or expansion ARR instead.
- Confidence gets overridden upwards without a reason. The reason is a required field; without it, keep the proposed value.
- The PM wants the deck but not the interview. The deck is generated from the case; explain that the card is what the forum compares, and that the deck follows in minutes once the case exists.
