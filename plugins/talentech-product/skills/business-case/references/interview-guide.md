# Interview guide

Question bank for the five stages, with the follow-ups that turn vague answers into card fields. Ask one question at a time. Use the PM's language for the conversation; write the case in English.

## Tone

You are a colleague preparing the PM for the forum, not a gatekeeper. Say why a question matters when it is not obvious ("the steering group sorts on this number, so a band is enough but it has to be the right band"). When the PM cannot answer, say so is fine, record it as an open question, and move on. Never fill a gap with your own estimate; a number the PM did not give is a number the PM cannot defend in the room.

## Opening

Ask for the idea in one or two sentences, and from that message pick the interview language. Then: "I'll ask one question at a time; it takes about 10 minutes for a small feature and 30 to 40 for a large initiative. The output is a case page in English for Confluence."

## Stage 1: Frame

| Question | Follow-up when the answer is vague | Card field |
| --- | --- | --- |
| What is the initiative, in one sentence? | "If I had to describe it to a customer in one line, what would I say?" | Title |
| Who has the problem, and what do they do today? | "Which segment, which role? Public or private sector? What is their workaround?" | Problem (medium, large) |
| Which product(s) does it touch, and what is each one's portfolio position? | List the positions: Introduce & scale / Invest & grow / Stay relevant & harvest / Maintain / Exit | Products and position |
| Who owns this case? | Default to the PM you are talking to | Owner |

Large cases also get: "What does the customer do today, in hours or € per year?" (feeds the do-nothing question later).

## Stage 2: Size

| Question | Follow-up | Card field |
| --- | --- | --- |
| Who would build it, for what share of their time, for how many weeks? Go discipline by discipline: dev (FE, BE, lead), UX and research, product, others. | "That's 2 developers at 50% for 6 weeks, so 6 person-weeks for dev. Does that include testing and release?" | Build effort per discipline |
| Does anyone outside the owning team need to spend time: sales enablement, implementation, support, marketing, legal? | "Roughly how many hours over the project?" | Other organisation effort |
| Who produced this estimate? | Options: you alone, you with a tech lead or dev manager, a team estimate | Who estimated |
| Five quick yes/no: new pricing, packaging or revenue stream? A partner, vendor or reseller contract? More than one product, or a shared service? Capacity from outside your team? A new kind of sensitive data or a new legal position? | A "maybe" counts as yes for the tier and is noted | Triggers |

Then compute the tier and announce it with the reason. If the PM disagrees, note the disagreement on the card and continue at the computed depth.

## Stage 3: Value

| Question | Follow-up | Card field |
| --- | --- | --- |
| Which of the five categories is the main value: new ARR, expansion ARR, retained ARR, cost savings, strategic? | "If you had to pick one that the steering group should rank it on?" If "strategic": "What does it unlock, and which cases depend on it? Can a € be attached to those?" | Primary category |
| Small, medium: which band for value at 12 months after launch? | Read the bands. "What would have to be true for it to be one band higher?" | Value at 12 months (band) |
| Large: what is the formula? | Walk each factor: volume, share, adoption, price, our share. Ask for low, base, high at 12 and at 36 months. "Which factor are you least sure of?" | Value at 12 and 36 months |
| What evidence do you have, specifically? | "How many customers, which ones, where is it recorded? If a survey: n and date. If lost deals: which, and was this the stated reason?" | Evidence level and line |
| Propose the confidence from the ladder; ask if they accept it. | If they want a different number: "What's the reason? It goes on the card." | Confidence (and override reason) |
| Why now? Is there a window? | "A tender, a regulation, a competitor, a contract renewal? What happens if this waits a year?" | Why now |

For large cases, also ask what the comparable precedent is (a product or feature we launched before whose adoption curve we know) and what it showed.

## Stage 4: Risk and plan

Small: "What is the one thing that worries you, and what would make you stop?" Record one line.

Medium: top three risks, each with a mitigation and a kill criterion; a one-line plan (who, when); yearly cost after launch if there is any (licences, partner fees, support load).

Large, in this order:

1. Risks by type: market, legal and compliance, technical, partner or vendor, execution. For each: "What would you do about it, and what observation by which date would make you stop?"
2. Plan with gates: "What is the first stage, what evidence does it produce, and what decision does that unlock?" Typical shape: pre-discovery with no development, go/no-go, MVP with a narrow scope, expansion.
3. Scope as three lists: MVP, maybe later, probably never. The "probably never" list is what keeps the MVP small.
4. Alternatives considered: do nothing, partner, buy, deepen an existing integration. One line each on why it was rejected.
5. Yearly cost after launch: partner or vendor fees (including revenue share), hosting, licences, support hours, maintenance share. Required.

## Stage 5: Accountability

Large (required), medium (optional): "Which single metric will show whether this worked, in the same unit as the value category? What target, by what date, and who runs the review?" The review date is usually 12 months after launch. Put the metric, target, date and owner on the card.

## Challenge pass (large cases)

Run after stage 5, before writing. Tell the PM what is coming: "Four harder questions. They are the ones the management team will ask; better to have the answers now." Do not proceed past a question until the answer is concrete; if the PM cannot answer, record it as an open question and say that it will be visible to the steering group.

1. Value logic: "Which single assumption, if halved, kills the case?" Then: "What is the evidence for that assumption, specifically?" Then: "What is the most conservative number you'd still defend?"
2. Effort: "What is not in the estimate?" Prompt with: migration of existing data, other products, support training, legal review, the second and third partner, sales material. Then: "What happened to the last estimate this team made? Over or under, by how much?"
3. Risks: for each risk listed, "What observation would make you stop, and by when?" A risk without a kill criterion is a worry, not a risk.
4. Doing nothing: "What does it cost, in €, to not do this for a year?" If nothing measurable: "Then the case is strategic; shall we rank it as that?"

Record the questions the PM struggled with; they become the prepared objections in the deck's speaker notes.

Medium cases: ask questions 1 and 4 in one pass each, flag weak answers in the notes under the card, do not block.

## Closing

Read back the card field by field in the PM's language and ask for corrections before writing. Then write the case page in English, print the comparison row, and post the case to Confluence as `references/confluence.md` describes (create the child page under Business cases, add the row with status Submitted). For large cases offer the deck, and remind the PM to attach it to the case page.
