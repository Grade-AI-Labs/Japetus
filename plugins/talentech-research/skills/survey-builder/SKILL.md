---
name: survey-builder
description: "Design, write, and analyze user research surveys. Use this skill when a researcher needs to write survey questions, choose between survey methods, calculate sample sizes, decide whether a survey is the right method, use validated survey tools like SUS or UMUX, or analyze and report survey findings. Triggers include: 'write a survey', 'survey questions', 'user research survey', 'is a survey the right method', 'how do I analyze survey results', 'sample size for survey', 'SUS score', 'UMUX survey', 'likert scale', 'survey design', 'opportunity gap survey', 'survey best practices', 'let's just run a survey', 'closed questions', 'open-ended survey questions'."
author: Lindsey Crabtree
---

# Survey Builder

This skill designs, writes, and analyzes user research surveys — covering when to use them, how to write questions that don't mislead, sample size, validated tools, and how to report findings honestly.

## The fundamental rule before anything else

Surveys tell you **what** and **how many**. They do not tell you **why**.

The trap is treating surveys like antibiotics: useful when needed, harmful when overprescribed. Before writing a single question, classify what you actually need:

| You need | Use |
|---|---|
| Counts — how many, how often, what proportion | Survey |
| Context — why, how, under what conditions | Interviews |
| Behavior — what actually happened | Analytics or logs |

If the answer is context or behavior, stop. Use another method.

**The self-check before sending any survey:**
1. What decision will this survey help inform?
2. Can a survey actually give us the evidence to make it?
3. What's the risk if we're wrong?
4. Have we considered another method that might be stronger?

If you can't answer #1, you're not ready.

---

## When surveys work and when they don't

### Surveys ARE the right tool for:
- **Pulse checks** — a quick read on how something feels at a specific moment (e.g., post-task SEQ after a usability test)
- **Tracking over time** — running the same questions at intervals to see if perception shifts after a redesign or launch
- **Scaling up qualitative findings** — "In interviews we heard X is a pain point; now let's see how common this is across 500 users"
- **Prioritizing** — given a list of qualitative insights, understanding which unmet needs matter most
- **Standardized usability measurement** — SUS, UMUX, SEQ, where you're benchmarking against validated norms

### Surveys CANNOT reliably:
- **Explain motivation** — a five-point satisfaction scale confirms someone is dissatisfied; it doesn't explain why
- **Validate desirability** — "Would you use this feature?" almost always produces a false positive; people overestimate their future selves
- **Predict behavior** — "How often would you…" is speculation, not data
- **Support discovery research** — you can't ask people to articulate needs they haven't consciously identified

The "Would you use this?" survey mistake: If you build it because the survey said people wanted it, and nobody uses it, that's not user failure — that's a method mismatch.

---

## Step 1: Set your goals

Goals before questions. Always. Every time.

Goals for surveys fall into three buckets:

**Usability goals** — understanding how usable something is
- "Evaluate people's perception of the ease of use of [product/service]"
- "Identify task-based satisfaction with [product/service]"

**Understanding goals** — identifying behaviors, patterns, tools, and feelings at scale
- "Identify behaviors and actions people are taking on [product/service]"
- "Uncover the different tools participants are currently using and their experience with them"
- "Uncover people's perceptions regarding certain actions on [product/service]"

**Prioritization goals** — turning qualitative insights into ranked priorities
- "Prioritize qualitative insights based on current level of importance and satisfaction"
- "Understand the most impactful unmet needs to solve for first"

To define your goals, answer:
- What are you trying to achieve with this survey?
- How will this survey help the team?
- What do you expect to do with the results?
- How does this fit into the business goals?
- What information do your users have to give you? (Does a survey make sense given that information?)

Work with stakeholders to finalize goals so everyone is aligned on expected outcomes before a single question gets written.

---

## Step 2: Define your ideal participant

Do this before finalizing questions. It gives you one more chance to confirm a survey is the right approach.

Ask:
- Who do you need to hear from for meaningful data?
- What behaviors must participants have done to be able to answer your questions?
- What are the most important screener criteria — recency, frequency, role, context of use?

**A cautionary note on the "easy list" problem:** The most convenient sample is almost always the wrong sample. Sending a survey to your most engaged users produces glowing results that reflect people who already survived your product's hardest moments. If you want to hear from struggling users, you have to explicitly recruit them.

---

## Step 3: Write your survey questions

### Best practices

**Keep it simple.** Use plain language — aim for a grade 5 reading level. Avoid jargon, abbreviations, and long sentences. Fewer words = clearer questions.

**Ask about past behavior, not future intentions.** Past behavior is the best predictor of future behavior. Future-based questions get you speculation.

❌ "Would you purchase this gym membership package?"
✅ "In the past, have you purchased a gym membership package? [If yes:] Did you use it? What was missing from your experience? What was frustrating about it?"

**Use first-person phrasing where possible.** First-person questions make surveys feel more personal and increase authentic responses.

❌ "What is the hardest part of our checkout process?"
✅ "The hardest part I encountered during checkout was…"

**Avoid double-barreled questions.** One question = one answer. Remove any "and/or" constructions.

❌ "How do you feel about the information and/or functionality on this website?"
✅ Two separate questions: "How do you feel about the functionality?" and "How do you feel about the information?"

**Avoid loaded questions.** Loaded questions assume context that may not exist. Use logic branches instead.

❌ "Where do you enjoy drinking beer?"
✅ "Do you enjoy drinking beer?" → [If yes:] "Where do you drink beer?" → "Is there a particular place you enjoy drinking beer?"

**Mix closed and open-ended questions.** A good rule: 60-70% closed, 30-40% a mix of open-ended. Every relevant closed question should have an optional open-text follow-up or "Other" field.

---

### Question types

**Closed questions** — participants choose from fixed options:
- Yes/No
- Multiple choice — single answer (radio buttons)
- Multiple choice — multi-select (checkboxes)
- Rating scales
- Likert scale — odd number of options, spectrum from negative to positive
- Semantic differential scale — opposite adjectives at either end of a scale

**Open-ended questions** — participants respond in their own words:
- Stand-alone open text question
- Follow-up question triggered by a rating (e.g., "Why did you rate it that way?")
- "Other" field on multiple choice

**Scale design choices:**
- 5-point scales push people toward the middle
- 7-point scales spread responses but can be overwhelming
- Labeling only the endpoints leaves the middle open to interpretation
- No scale is neutral — pick one, be consistent, and be clear about how you'll interpret it

**Likert scale example:** "After using [product], I found the navigation to be: 1 (Very bad) — 7 (Very good)"

**Semantic differential example:**
Easy — — — — — — — Difficult
Reliable — — — — — — — Unreliable

---

### Turning goals into questions

**For usability goals:**

Effectiveness:
- Single Ease Question (SEQ): One question on a 7-point scale measuring perceived task ease — ask after each completed or failed task
- Confidence: "How confident were you that you completed the task successfully?" (7-point scale)

Efficiency:
- Subjective Mental Effort Question (SMEQ): "How mentally difficult was this task to complete?"

Satisfaction:
- SUS (System Usability Scale): 10 items, industry standard, benchmarkable against published averages
- UMUX-Lite: 2 items, faster than SUS, closely correlates with SUS scores

**For understanding/behavior goals:**

Example — board game purchasing behavior:
- "How do you purchase board games?" [In-store / Online / Other] → [Logic: "Why do you prefer that?"]
- "How often do you purchase board games online?" [1-2 times a month / 3-4 times a month / 5+ times a month]
- "What is your main goal when visiting an online board game shop?" [Multiple choice with Other]
- "Have you ever returned a board game purchased online?" [Yes / No] → [If yes: "Why?" open text]

**For feelings/perceptions goals:**

- "Think about the last time you purchased a board game online. How was your experience?" [Very good / Good / Neutral / Bad / Very bad] → [Open text: Why?]
- "Think about a frustrating experience purchasing a board game online. What happened?" [Open text]
- "What is the most difficult part of buying a board game online?" [Multiple choice with Other OR open text]

First-person variation: "The most difficult part of buying a board game online was…"

**For prioritization goals (Opportunity Gap Survey):**

Use after generative research has already identified needs and pain points. This survey quantifies which ones matter most.

For each need/goal/outcome uncovered in qualitative research, ask two questions:
1. "How important is it to you that you can achieve [outcome/goal/need]?" (1 = Not at all important → 5 = Extremely important)
2. "When using [current solution], how satisfied are you with your ability to achieve [outcome/goal/need]?" (1 = Not at all satisfied → 5 = Extremely satisfied)

Gap = Importance score minus Satisfaction score. High-gap items are your highest-priority opportunities.

**Do not run an opportunity gap survey without completing generative research first.** The items need to come from users, not from your assumptions.

---

### Follow-up questions

Follow-ups come in two forms:
- **Logic-triggered:** "How do you rate your gym membership? [1-5]" → [If 1 or 2:] "Why do you feel that way?" This lets users explain low ratings without burdening everyone.
- **Open text on every closed question:** Always include an "Other" option with open text. This surfaces answer categories you hadn't anticipated and improves future surveys.

---

## Step 4: Sample size

Use an online calculator (Qualtrics or SurveyMonkey have good ones). Input these four values:

**Population size:** How many people are you trying to generalize to? Segment if needed — conclusions only apply to the group surveyed.

**Margin of error (confidence interval):** How much error are you comfortable with? Common choices: 5% or 10%.

**Confidence level:** How confident do you want to be that findings fall within that margin? Common: 95% or 90%. In fast-paced product teams, 80-85% is often sufficient.

**Standard deviation:** The safe default is 0.5.

**Example:** Generalizing to 50,000 users, 7% margin of error, 90% confidence, 0.5 standard deviation → ideal sample size ≈ 138 responses.

**For quantitative usability studies:** Aim for approximately 40 participants for reliable predictions about user behavior.

---

## Step 5: Pilot test before sending

Never skip this. Send the survey to 3-5 internal colleagues and a small external sample first. Ask them to complete it as if they were real participants, then ask:

- What did each question mean to you in your own words?
- Were any questions confusing or unclear?
- How long did it take?
- Were there any technical issues?

**What to look for:**
- Consistently misunderstood or skipped questions
- Illogical survey flow
- Technical glitches with logic or navigation
- Completion time significantly over your target

Adjust and re-pilot if major changes are needed. Running a poorly designed survey to 500 people and having to resend it is worse than taking a week to pilot test it first.

---

## Step 6: Survey length and engagement

**Ideal length:** 5-10 minutes. State the expected completion time upfront.

**To reduce fatigue:**
- Start with goals, not questions — every question must earn its place
- Use branching logic to skip irrelevant questions
- Limit open-ended questions to where detail is truly critical
- Consider matrix questions instead of multiple single questions on the same topic

**Engagement tactics:**
- Make questions feel relevant — generic wording increases drop-off
- Personalize where possible (include the participant's name if your tool allows)
- Time your send when your audience is most likely to engage (not peak busy periods)

**Hard rule:** If a question doesn't tie back to a goal, remove it.

---

## Validated survey tools (the "safe surveys")

Use these instead of building your own rating scales. They're validated, benchmarkable, and much harder for stakeholders to dismiss.

**SEQ (Single Ease Question)**
Measures: Perceived task difficulty
When: After each usability test task
Format: "Overall, how difficult or easy was the task to complete?" (7-point scale)
Use: Track which tasks are hardest; pair with task success rates

**SCQ (Single Confidence Question)**
Measures: Participant confidence that they completed the task correctly
When: Right after SEQ in usability testing
Use: Surfaces gaps between actual and perceived success — someone who completed a task but scored 3/7 confidence has a trust problem, not a usability problem

**SUS (System Usability Scale)**
Measures: Overall perceived usability
When: After participants have experienced enough of the product to form a holistic impression
Format: 10 items
Benchmark: Average SUS score is 68; above 80 is excellent
Use: Benchmarking across releases; comparing before/after redesigns

**UMUX and UMUX-Lite**
Measures: Usability and usefulness
When: Agile environments, frequent testing, when you can only ask a few questions
Format: UMUX = 4 items; UMUX-Lite = 2 items ("This system's capabilities meet my requirements" + "This system is easy to use")
Use: Correlates closely with SUS; faster to administer

**SUPR-Q and SUPR-Qm (mobile)**
Measures: Usability, credibility, loyalty, appearance
When: Website and app benchmarking; competitive analysis
Use: Benchmarks against thousands of sites; reveals whether trust or appearance is pulling down scores alongside usability

**NASA-TLX (Task Load Index)**
Measures: Workload across mental demand, physical demand, temporal demand, performance, effort, and frustration
When: Complex tasks, professional tools, enterprise software, healthcare systems
Use: Compare alternative designs on cognitive load; identify which dimension of workload is highest

**AttrakDiff**
Measures: Pragmatic quality (useful, usable) AND hedonic quality (appeal, stimulation)
When: Consumer apps, branded experiences, anywhere emotional appeal matters alongside function
Use: Reveals "usable but uninspiring" — critical when competitors differentiate on personality

**Quick selection guide:**

| Goal | Tool |
|---|---|
| Task-level ease | SEQ + SCQ |
| Overall usability | SUS, UMUX, or UMUX-Lite |
| Broader UX (credibility, loyalty, appearance) | SUPR-Q / SUPR-Qm |
| Workload-heavy contexts | NASA-TLX |
| Balancing usability and appeal | AttrakDiff |

---

## Step 7: Analyzing survey data

**Step 1 — Compile:** Export to a spreadsheet. Columns = questions, rows = individual responses.

**Step 2 — Clean:** Remove duplicates, incomplete entries, and nonsensical responses (e.g., text in a number field).

**Step 3 — Descriptive statistics:** Calculate means, medians, modes, and standard deviations for numerical data. Calculate percentages for categorical data.

**Step 4 — Analyze per question:**
- Categorical (multiple choice, yes/no, Likert): Count responses per option, calculate percentage of total
- Numerical (ratings, scales): Calculate mean, and check distribution — a mean of 4.8/7 that hides a 50/50 split between 7s and 2s is a very different story than a genuine 4.8 spread

**Step 5 — Cross-tabulation:** Create tables comparing two variables (e.g., age group vs. purchase frequency). This reveals patterns hidden in aggregate data — like younger users purchasing more frequently while older users purchase less but spend more per transaction.

**Step 6 — Analyze open-ended responses:**
- **Thematic analysis:** Read through responses, identify recurring ideas, code into themes, analyze frequency and context
- **Content analysis:** Count the frequency of specific words or concepts to find statistical patterns in text
- **Comparative analysis:** Compare responses between segments (e.g., new vs. long-term users, different roles or age groups)
- Tools: NVivo, Atlas.ti, or Google Sheets for smaller datasets

**Step 7 — Identify patterns:** Look at how responses across different questions relate to each other. Segment data by demographics or behaviors. Look for correlations and, if you have longitudinal data, changes over time.

**Step 8 — Report:** Structure the report by research goals. For each goal:
- Goal title
- Summary of findings (1-3 bullet points)
- Finding 1 with evidence
- Finding 2 with evidence
- Finding 3 with evidence

---

## Reporting honestly: the subjectivity acknowledgment

**Never present survey data as objective truth.** Every survey contains subjectivity in its design, its sample, and its interpretation. This isn't a flaw to hide — it's a reality to communicate.

**Show distributions, not just averages.** A mean score of 4.8/7 that's actually a bimodal split (half gave 7, half gave 2) requires completely different action than a genuine 4.8 with normal distribution.

**Add a "What this data can and cannot tell us" section to every survey readout:**

*This data can tell us:*
- [How many respondents reported X]
- [Which options were most frequently chosen]
- [How scores compare to a previous period]

*This data cannot tell us:*
- [Why respondents feel this way]
- [What these findings look like for segments we didn't reach]
- [Whether these findings represent all users or just our respondents]

**Frame numbers as signals, not proofs:**
❌ "67% of users want Feature X."
✅ "67% of the 420 respondents we heard from indicated interest in Feature X. Most were long-term customers, so this may not represent newer users. In follow-up interviews, 'want' typically meant 'might try if it didn't disrupt existing workflows.'"

**Always note who responded vs. who you intended to hear from.** If your target was new customers but 80% of respondents were long-term power users, that gap must be in the report.

---

## Survey planning checklist

Run this before writing a single question:

**Decision**
- [ ] What decision will this survey help inform?
- [ ] What will we do differently depending on the answers?

**Audience**
- [ ] Who specifically do we need to hear from?
- [ ] How will we check whether our sample matches our target?

**Method fit**
- [ ] Do we need counts? (Survey is right)
- [ ] Do we need context or behavior? (Wrong tool — use interviews or analytics)

**Questions**
- [ ] Each question ties to a goal
- [ ] No leading or loaded language
- [ ] No double-barreled questions
- [ ] Mix of closed and open-ended
- [ ] Pilot tested with 3-5 people
- [ ] Length under 10 minutes

**Safe surveys (if applicable)**
- [ ] Used a validated tool where possible instead of a DIY scale

**Triangulation**
- [ ] Identified what other data we'll pair this with (interviews, analytics, usability testing)

**Reporting**
- [ ] "What this data can and cannot tell us" section drafted before data collection begins

---

## Researcher reminders

- Surveys tell you what and how many — they never tell you why; if you need why, use interviews
- "Would you use this?" is almost always a false positive — people overestimate their future selves and underestimate friction
- The "easy list" problem: your most engaged users are the least representative of your struggling users; recruit deliberately, not conveniently
- Every scale is subjective — pick one, be consistent, and be honest about how you'll interpret it
- Always pilot test before sending at scale; the cost of a bad survey sent to 500 people is higher than the cost of a week of testing
- Show distributions, not just averages — a mean that hides a bimodal split is worse than no data
- Pair surveys with at least one other method — survey + interviews gives both scale and depth; survey + analytics gives both perception and behavior
- The opportunity gap survey only works if the items come from prior generative research — don't build it on assumptions
- Admitting survey limitations builds credibility; pretending surveys are objective destroys it
