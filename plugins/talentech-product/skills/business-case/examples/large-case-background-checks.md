# Example: large case

Illustrative re-entry of the Background Checks pitch (Talentech, May 2026) into the template. Figures are reconstructed from the pitch deck and its revised business case; low/high scenarios and the 36-month split are illustrative where the deck gave only a base figure. It shows the shape and depth of a large case, not an approved case.

# Background checks: ATS-orchestrated, partner-executed checks

| Field | Value |
| --- | --- |
| Owner, date | Linus Andersson (PM), with Fabian Widén (tech), 2026-05-13 |
| Product(s) and portfolio position | ReachMee first (MVP); all ATSs later. Position: not stated in the pitch |
| Tier and forum | Large: management team, after steering group review (effort 82 pw; triggers: new revenue stream, partner contracts, shared service across ATSs) |
| Primary value category, maps to driver | Expansion ARR (pay-as-you-go checks sold to existing customers) → ARR / Revenue growth. Secondary: retained ARR (tender positioning, deals lost to Refapp) |
| Value at 12 months | low €0.18M / base €0.37M / high €0.61M invoiced per year |
| Value at 36 months | low €1.5M / base €3.8M / high €6.1M invoiced per year |
| Confidence, evidence | 70%, level 3: in-product survey n=303 (April 2026), customer interviews, partner meetings, Reference Checks launch telemetry |
| Build effort, cost | 82 pw (dev 36, UX and research 21, product 10, other 14); €246k at €75/h |
| Who estimated | PM with tech lead |
| Yearly cost after launch | €243k at 12 months: partner share 60% of invoiced (€220k), Claude licences €4k, maintenance 4 pw (€12k), support ~100 h (€7k) |
| Value per effort, payback | 1.5; payback 24 months |
| Top risk, kill criterion | Needs scattered across markets and roles make a standard package unsellable; stop if fewer than 3 of 5 pilot customers convert to paid within 8 months of start |
| Why now | Swedish Supreme Court ruling (Feb 2025) and the Ju 2025:19 inquiry push buyers to licensed providers; we are losing Refensa deals to Refapp, which offers checks |
| Success metric, target, review | € invoiced from background checks at 12 months after launch; target €366k; review 12 months after launch; owner Linus |

**Open questions:** customer acquisition cost assumption not grounded beyond the €184 per customer estimate; portfolio position of ReachMee to be confirmed; whether public-sector customers will pay for commercial checks when state registries are free.

**Notes:** the original pitch used role-specific rates and showed about 12 months payback on gross profit; with the template's single €75/h rate and maintenance included, payback is 24 months. Confidence proposed at 70% and accepted.

## 1. The ask

Approval to build a background-check MVP in ReachMee for Sweden and Norway with 2 to 3 partners, with the team on slide 32, over 6 months from start, and to send the first invoice before year end. Decision requested: go.

## 2. Problem and who has it

Recruiters at private and public employers in the Nordics run background checks (identity, employment, education, criminal records, finances) at offer stage. 67% of surveyed ATS users already run checks; 62% do it manually outside the ATS and only 8% through the recruitment system. The work is scattered, slow, and outside the system where candidates are managed. For Talentech the problem is commercial: checks happen in our customers' processes but the revenue goes to screening vendors, and competitors that embed checks (Refapp) win reference-check deals against us.

## 3. Proposed solution and scope

A smooth, easy-to-order background-check step embedded where recruiters manage candidates in the ATS. Talentech orchestrates and invoices; partners execute the checks and carry compliance, delivery and risk. Built as a shared service that can serve all ATSs.

| MVP | Maybe later | Probably never |
| --- | --- | --- |
| Sweden and Norway | Other Nordic markets | Own screening operations |
| One ATS (ReachMee) | All five ATSs | Country-specific registry integrations built by us |
| 2 to 3 partners (Fortcheck/ToFindOut, Manymore) | Multiple partners per market | Single global white-label partner |
| Default packages only | Flexible packaging, custom checks | |
| Status, permissions, consent, validity | Billing-service connection, notifications | |

## 4. Value logic

Recruitments in our systems per year × share that use a paid check × adoption of our solution × price per check = invoiced revenue. Talentech keeps 40%; the partner's 60% is a yearly cost after launch.

| Factor | Low | Base | High | Source |
| --- | --- | --- | --- | --- |
| Recruitments per year in Talentech systems | 650,000 | 650,000 | 650,000 | Internal system data, 2025 |
| Share using a paid background check | 15% | 15% | 15% | 1 in 10 job ads mention a check (DISA, Unionen); survey indicates higher; 15% assumed |
| Market growth per year | 11.8% | 11.8% | 11.8% | Business Market Insights, European screening 2022 to 2030 |
| Adoption at 12 months | 1.5% | 3% | 5% | Reference Checks ramp; survey: 36% yes, 53% maybe to ATS-triggered checks |
| Adoption at 36 months | 10% | 25% | 40% | Innovation adoption pattern, revised down after pre-discovery |
| Price per check | €125 | €125 | €125 | Partner price lists |
| Talentech share | 40% | 40% | 40% | Preliminary partner agreements |
| **Value at 12 months (€/year invoiced)** | 0.18M | 0.37M | 0.61M | derived |
| **Value at 36 months (€/year invoiced)** | 1.5M | 3.8M | 6.1M | derived |

## 5. Evidence and confidence

In-product survey, n=303 (April 2026): 67% run checks today, 89% open to ATS-triggered checks (36% yes, 53% maybe), criminal records the most wanted check (69%). Qualitative customer interviews and interviews with colleagues (17 Swedish customers asked for a conversation in one month). Partner meetings with ToFindOut, Fortcheck and Manymore, with preliminary revenue share above 40%. Precedent: Reference Checks reached 29 MRR customers in 6 months through sales, while self-serve activation (652 tenants) converted under 1% in 2 months, so the sales-led motion is the anchor. Level 3, confidence 70%.

## 6. Alternatives considered

| Alternative | Why rejected |
| --- | --- |
| Do nothing | Continued loss of reference-check deals to Refapp; no share of a Nordic screening market of roughly €65M per year for the largest suppliers; weaker tender position |
| Deepen the current partner integration | Low revenue share, no control of sales (partner contracts with the customer), customers dislike the experience |
| Build screening in-house | Each Nordic country has its own legal framework and data sources; manual investigation work; licence requirements (IMY) |
| Acquire a screening vendor | Inherits a low-margin manual-operations P&L; the moat is the orchestration layer in the ATS, which no vendor owns |
| One global white-label partner | Nordics are not one legal market; concentrates risk; removes negotiation leverage on revenue share |

## 7. Cost

| Role | Share of time | Weeks | Person-weeks | Cost (€75/h) |
| --- | --- | --- | --- | --- |
| Product lead | 40% | 26 | 10.4 | €31,200 |
| UX / research | 80% | 26 | 20.8 | €62,400 |
| Dev lead | 20% | 26 | 5.2 | €15,600 |
| Development FE | 50% | 26 | 13.0 | €39,000 |
| Development BE | 70% | 26 | 18.2 | €54,600 |
| Sales enablement and partnerships | 30% | 26 | 7.8 | €23,400 |
| Marketing | 5% | 26 | 1.3 | €3,900 |
| Implementation | 20% | 26 | 5.2 | €15,600 |
| **Total build** | | | **81.9** | **€245,700** |

Yearly cost after launch at the 12-month run-rate: partner share €220k (60% of €366k), Claude Team licences €4k, maintenance 4 pw €12k, support about 100 hours €7k; total €243k. Who estimated: PM with tech lead. Payback: 24 months.

## 8. Risks and plan

| Type | Risk | Mitigation | Kill criterion (observation, date) |
| --- | --- | --- | --- |
| Market | Needs differ by market, sector and role; one standard package does not sell | Default packages only in MVP; private sector first | Fewer than 3 of 5 pilots convert to paid by month 8 |
| Market | Public sector keeps using free state registries | Target private sector and regulated private roles first | Public-sector pilots show no willingness to pay by month 8 |
| Legal and compliance | What may be requested, shown and stored differs per country; Talentech's responsibility unclear | Partners own compliance; legal review of the orchestration layer before pilot | Legal review finds Talentech must act as data controller for check results |
| Partner or vendor | Revenue share below 30%, or clunky partner UX | Two partners per market; negotiate before build | No partner signs at 30% or above by the end of pre-discovery |
| Execution | Sales does not prioritise enablement; feature treated as passive self-serve like Reference Checks | Sales-led MRR motion from month 2; named sales ambassadors | Fewer than 10 customers in the pipeline by month 4 |

Plan with gates:

| Stage | Duration | What it produces | Gate decision |
| --- | --- | --- | --- |
| Pre-discovery (done) | 4 weeks | Survey, interviews, partner terms, prototype test | Go / no-go for build: go |
| MVP build | 6 months | Partner agreements signed (M2), sales material and pricing (M2), first pilot version (M4), MVP live in ReachMee (M6) | Expand or stop, on pilot conversion and partner terms |
| Expansion | from M8 | Other ATSs, markets and partners | Per market and ATS, on adoption in the previous step |

Team: Linus (product), Fabian (tech lead), Juha (UX), Olof, Kuba, Piotr G (developers), Anna K and Mads (sales enablement and partnerships), Rafae (sales), Jana (marketing), Martin and Linea (implementation).

## 9. Success metric and review

€ invoiced from background checks at the 12-month run-rate after launch; target €366k; review 12 months after launch, owner Linus. Worked looks like: 100 customers using checks through the ATS, at least half of them sales-led, with partner share at 60% or less.

## Comparison row

| Title | Owner | Product(s) | Tier | Category | Value 12m (base €) | Confidence | Effort (pw) | Build cost (€) | Value/effort | Top risk | Why now | Review date | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Background checks | Linus | ReachMee (then all ATSs) | Large | Expansion ARR | 366,000 | 70% | 81.9 | 245,700 | 1.5 | Scattered needs across markets | Regulatory window; losing deals to Refapp | 12 months after launch | Submitted |
