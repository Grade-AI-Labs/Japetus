---
name: affinity-synthesis
description: "Turn raw qualitative research data (interviews, usability sessions, diary entries) into patterns and decision-ready recommendations: research context interview, transcript preparation, tagging, affinity clustering, pattern strength, and evidence-verified recommendations. Use when a researcher says they have interview data and need to synthesize it, run an affinity diagram, find patterns, map findings to research questions, or write defensible recommendations. Triggers include: affinity diagram, affinity mapping, synthesize interviews, thematic analysis, cluster findings, I have all this data now what, from findings to recommendations."
author: Lindsey Crabtree
---

# Affinity Synthesis: From Data to Decisions

This skill guides you from raw qualitative research data to pattern-based recommendations tied to the specific decisions you need to make.

The process has four phases:

1. **Research context interview** — understand your research objectives, the decisions you need to inform, study scope, and assumptions
2. **Audio transcription & data preparation** — convert research recordings into searchable, timestamped transcripts ready for evidence extraction
3. **Affinity diagramming** — turn raw interview data into patterns and themes through systematic tagging, grouping, and clustering
4. **Recommendations** — map findings back to your research objectives and generate recommendations for each decision, with explicit evidence verification

---

## Phase 1: Research Context Interview

Before diving into synthesis, we need to understand *why* you conducted this research and *what* you need to decide.

Answer these questions:

### Research framing
- **What were your research objectives?** (What did you set out to learn? What gaps were you trying to fill?)
- **What were your core research questions?** (List 2–4 specific questions you wanted answered)
- **What decisions do you need to make based on this research?** (Be specific: e.g., "Should we pivot our onboarding flow?" "Which customer segment should we prioritize?" "Should we build this feature?")

### Study scope
- **How many participants did you interview?**
- **What was your participant diversity?** (roles, geographies, company sizes, experience levels — whatever dimensions matter for your research)
- **Any segments you're tracking separately?** (If you interviewed 6 small companies and 6 enterprises, do you want to analyze them separately?)

### Existing context
- **What were your hypotheses or assumptions going in?** (What did you think you'd find?)
- **What surprised you so far, if anything?**
- **Are there existing constraints or contexts we should keep in mind?** (e.g., "we can only build 2 of these features" or "we're committed to this market")

### Research artifacts
- **Do you have a research brief or research plan?** (If yes, please share it. We'll use it to map findings back to your original objectives and recommendations to your decisions.)

---

## Phase 2: Audio Transcription & Data Preparation

Before affinity tagging can begin, all research data must be converted into a consistent, searchable format with timestamps. This ensures all evidence is comparable and traceable back to source.

### What you need

- Research recordings (video or audio files from all participants)
- Audio inventory with participant ID, duration (HH:MM:SS), and task-level breakdowns
- A transcription method (see options below)
- ~30-120 minutes per participant, depending on method and session length

**Audio inventory template:**
Track each participant's extracted audio segments with precise timing:

| Participant | Task | Duration | Status | Notes |
|---|---|---|---|---|
| P1 | 1: Explore | 5:23 | ✓ Ready | Clear audio |
| P1 | 2: Preferences | 4:47 | ✓ Ready | Hesitation noted at 2:15 |
| P1 | 3: Update CV | 4:12 | ✓ Ready | Quick completion |
| P1 | 4: Upload | 0:33 | ⚠️ Corrupted | Partial capture |
| P2 | 1: Explore | 5:44 | ✓ Ready | Background noise 0:00-0:15 |
| P2 | 2: Preferences | 4:29 | ✓ Ready | Clear throughout |

This precision helps with:
- **Evidence verification** — "P1 at 4:47 in Task 2" is verifiable in the source file
- **Pattern mapping** — Track which tasks surfaced which behaviors
- **Quality assessment** — Spot incomplete data early

### Transcription options

**Option A: OpenAI Whisper (Recommended)**
- Local, offline processing — no API calls or proxy issues
- Fast (real-time for 30-min session)
- Highly accurate, handles various audio qualities
- Install: `pip install openai-whisper`
- Usage: `whisper audio.wav --output_format json`

**Option B: Google Cloud Speech-to-Text API**
- Fast, high accuracy
- Requires authentication and network access (may be blocked by proxies)
- Cost: ~$0.02 per minute
- Best for: Stable internet, cloud-friendly environments

**Option C: Manual transcription**
- Best for: Critical sessions, quality control, small samples
- Time: ~2-3 hours per hour of audio
- Format: Include timestamps at 30-60 second intervals

**Option D: Hybrid (Strategic sampling)**
- Watch full video, transcribe key moments only (confusion, insights, pain points)
- Fastest: ~30 minutes per participant
- Trade-off: May miss patterns from routine moments
- Mark evidence gaps explicitly in final recommendations

### Transcript format for evidence

Once transcribed, format your transcripts for evidence extraction:

```
PARTICIPANT: P1  
TASK: 2 (Change Job Preferences)  
DATE: September 30, 2026  
DURATION: 4:00  

---

[0:00-0:15] P1 arrives at preferences screen
[0:15] P1: "Okay, so this is where I set my job preferences?"
[0:22] P1: "I don't see a Save button. Does it save automatically?" [searches interface]
[1:05] P1 leaves page without confirmation message

---

NOTES: Audio quality good. P1 mentions save behavior 3 times across session.
```

Key elements:
- **Participant ID** — always include (P1, P2, etc.)
- **Task number** — which task this came from
- **Timestamps** — so you can verify interpretation in the recording
- **Verbatim quotes** — exact wording, in quotes
- **Behavioral observations** — in brackets for context

### Data consistency

When you have multiple participants and sources:
- Use the same transcription method for all participants (or document differences)
- Include timestamps on all transcripts
- Maintain the same quote format (verbatim)
- Flag any audio quality issues or gaps

Once all transcripts are prepared, proceed to **Phase 3: Affinity Diagramming**.

---

## Phase 3: Affinity Diagramming

Once we understand your research context and have transcripts ready, we'll guide you through affinity synthesis.

### What affinity diagramming is

An affinity diagram is a visual brainstorming tool that organizes large amounts of qualitative data into groups or themes based on their relationships. It's the bridge between raw interview data and the patterns that become insights.

It answers the question researchers ask most often after completing interviews: "I have all this data — now what?"

Affinity diagrams work alone or in group synthesis sessions with stakeholders. Both are valid. The group version is better for building team ownership of findings; the solo version is better for speed and depth of analysis.

---

### Step 1: Audio Extraction & File Preparation

**Before transcription:** Prepare audio/video files for consistent processing.

**Audio file inventory:**
When you upload research recordings, document:
- **Participant ID** — who this came from
- **Duration** — total audio length (HH:MM:SS format for precision)
- **Format** — original file type (MP4, MOV, WAV, M4A, etc.)
- **Quality notes** — any audio issues (background noise, inaudible segments, etc.)

**Example format:**
```
PARTICIPANT: P1  
DURATION: 19:34:23 (total session)
SOURCE FILE: <study>-session_participant-<id>_<date>.mp4
EXTRACTION STATUS:
- Task 1 (Explore): 5:23 → extracted & ready for transcription
- Task 2 (Job Preferences): 4:47 → extracted & ready for transcription
- Task 3 (Update CV): 4:12 → extracted & ready for transcription
- Task 4 (Upload CV): 0:33 → extracted (corrupted; partial)
- Task 5 (Respond to Brio): [not captured]
TOTAL USABLE AUDIO: 14:55 (across 4 tasks)
```

**Why seconds matter:**
- Evidence verification requires accurate timestamps (e.g., "P1 said X at 4:22")
- Task duration helps assess completeness (e.g., "Task 2 only 2:15 suggests participant rushed or got stuck")
- Total usable audio shows data quality at a glance

**After extraction:** Re-listen to each audio segment and transcribe what the participant said. Use an AI transcription tool or manual transcription when under time pressure. The heavy lifting happens here, not during the session.

A full transcription isn't always necessary — detailed notes that capture the meaning and texture of what was said can work. What matters is that you have enough material to tag, with timestamps accurate to the second.

---

### Step 2: Tag and code the data

Tags (also called codes) are words that represent categories of information found in your data. They let you categorize raw statements, observations, and attitudes so you can find patterns across participants.

**Two approaches to tagging:**

**Deductive (recommended starting point):** Create your tags before reviewing data, based on what you expect to find. Apply them as you go through transcripts.

**Inductive:** Review a few transcripts first, then create tags that emerge from what you're seeing.

In practice: start deductive with global tags, then add inductive tags as patterns emerge that don't fit existing categories.

**Global tags — use these as your default starting set:**

| Tag | What it captures |
|---|---|
| **Goal** | What the person is trying to accomplish as an outcome |
| **Motivation** | Why the person is trying to achieve that goal |
| **Need** | Something a person needs in order to fulfill a goal |
| **Task** | Something a person does to achieve a goal |
| **Pain point** | A barrier or difficulty towards accomplishing a goal |
| **Tools** | A tool a person uses to try to accomplish a goal |
| **Positive emotion** | Something that makes a person feel positively |

Focus on 4–5 tags per affinity diagram. More than this makes the process unwieldy. You can refine your tag set based on your specific research objectives — if you're studying decision-making, you might emphasize "Motivation" and "Need"; if you're studying workflows, you might emphasize "Task" and "Pain point."

**Applying tags — examples:**

Statement: "I don't have the time to stretch at the gym, and I don't have the equipment at home."
→ Tag: **Pain point** (gets in the way of stretching)

Statement: "I'm trying to become more flexible, and stretching is a key part of that."
→ Tag: **Goal** (person stated what they want to accomplish)

Statement: "I'm in yoga teacher training, so I need to be able to hit certain poses for my practical test."
→ Tag: **Motivation** (reason behind doing something)

Statement: "When the travel gets complex, I use a travel agent, even if they cost money."
→ Tag: **Task** + emerging inductive tag: **travel agent** (consistent across participants)

**How to tag:** Work through your notes or transcript participant by participant. For each relevant statement, mark which global tag applies. In a spreadsheet, tag the relevant cells. In sticky notes or a digital tool, write one data point per note and mark the tag.

---

### Step 3: Create the affinity diagram

**What you need:**
- All tagged data points (from step 2)
- Post-its (physical or digital) — Miro, Mural, FigJam, or physical sticky notes
- Space to spread everything out

**Process:**

1. **Write one data point per post-it.** Include the participant number (P1, P3, etc.) on each one so you can trace findings back to source. One data point per post-it — never combine two observations on the same note.

2. **Group by tag first.** Place all pain points together, all goals together, all motivations together. These are your broad categories.

3. **Look for clusters within each tag group.** Within the pain points, what similar sub-themes are appearing? Which post-its are saying the same thing from different angles?

4. **Form clusters of similar ideas.** Group the post-its that represent the same underlying theme together. These clusters are your emerging patterns.

5. **Name each cluster.** Once you've formed a cluster, give it a label that captures the shared theme. This label becomes the foundation of a finding or insight.

**Example — travel research pain points:**

Raw post-its:
- P1: Never know when to book because prices keep going up and down
- P3: The fluctuation in prices is frustrating — hard to know when to book
- P5: Trying to figure the right timing for the best price
- P6: Saw prices go down after I purchased
- P2: I hate trying to make changes to my flights because of the fees
- P3: Getting a refund is impossible — there's always a loophole
- P5: Last minute changes are the worst — can never get a refund
- P7: Customer support with changing or canceling is so stressful

Two distinct clusters emerge:
- **Price volatility and booking timing** (P1, P3, P5, P6)
- **Change and refund fees** (P2, P3, P5, P7)

These clusters become your pattern candidates.

**Example — gym stretching research goals:**

Raw goals data:
- "I'm trying to become more flexible, and stretching is a key part of that."
- "I would like to be able to touch my toes."
- "I want to be able to do more flexible things, like yoga."
- "I don't want to feel as stiff — I'm getting old, and it makes it harder to move."
- "I want to make sure, when I'm 70, I can go to Italy and walk around."
- "I see people hobbling around, and I know stretching will help keep me young."

Two clusters emerge from the goals:
- **Flexibility** (want to do yoga, touch toes, become more flexible)
- **Fear of aging** (don't want to feel stiff, want to stay mobile at 70, avoid hobbling)

Now instead of presenting a list of six goals, you can present two clusters: "people want to become more flexible" and "people are scared about aging and want to stay mobile." Each cluster points to a different kind of solution.

---

### Step 4: Identify patterns and trends

A pattern is a cluster that appeared enough times across participants to be meaningful — not a one-off comment, but a recurring theme.

**The 1/3 rule (a starting guideline):**
If approximately 1/3 of your participant sample (rounded up) mentioned something similar, treat it as a pattern.

| Sample size | Pattern threshold |
|---|---|
| 6 participants | 2+ mentioned it |
| 9 participants | 3+ mentioned it |
| 15 participants | 5+ mentioned it |
| 20 participants | 7+ mentioned it |

This is not a rigid rule — it's a useful starting heuristic. One-off insights can be compelling and worth reporting, especially if the consequence is significant. As you advance in synthesis, your judgment about what constitutes a meaningful pattern will sharpen.

**What to look for:**
- Clusters with 4+ post-its are your strongest patterns
- Cross-tag patterns (the same theme appearing as both a pain point and a motivation) are particularly rich
- Clusters where participants used very similar language are strong signals
- Clusters where very different participants arrived at the same point are especially significant

---

## Phase 4: From Patterns to Recommendations

Once you have patterns identified through the affinity diagram, translate them into recommendations tied to your specific decisions.

### Step 1: Map findings back to research objectives

Using your research brief or plan, map each pattern or cluster back to the research questions and objectives it addresses.

**Example mapping:**

Research objective: "Understand barriers to exercise consistency"
Research question: "What stops people from stretching regularly?"

Pattern found: **"Price volatility and booking timing"** (from travel research)
Maps back to: Research question "What stops people from..." — specifically, price uncertainty is a decision barrier

If a pattern emerged that *wasn't* tied to any research question or objective, note it separately as a bonus finding — but don't force it.

### Step 2: Connect patterns to decisions

For each decision you identified in Phase 1, look at which patterns are relevant.

**Example decision mapping:**

Decision: "Should we add dynamic pricing optimization to our platform?"

Relevant patterns:
- **Price volatility and booking timing** (4/7 participants) — directly relevant
- **Change and refund fees** (3/7 participants) — related but not directly about pricing optimization

Evidence strength: **Strong** (4/7 mentions of pricing volatility; consistent language across participants)

### Step 3: Generate recommendations

For each decision, write a recommendation that:
- References the specific pattern(s) found
- Explains the evidence strength (how many participants, how consistent)
- Proposes a next step or action
- **Explicitly states if evidence is insufficient** to inform the decision

**Recommendation template:**

```
Decision: [Your decision here]

Evidence:
- Pattern: [Cluster name] ([# of participants] / [total participants])
- Pattern strength: [Strong / Moderate / Weak]
- Relevant quotes/data points: [list 1–3 examples]

Recommendation: [What you should do based on this evidence]

Evidence gap (if any): [If you can't answer this decision from the research, state it clearly]
```

**Example recommendation:**

```
Decision: Should we add dynamic pricing optimization to our platform?

Evidence:
- Pattern: Price volatility and booking timing (4/7 participants)
- Pattern strength: Strong (appeared across different participant types; consistent language: "fluctuation," "hard to know when to book")
- Relevant quotes:
  - P1: "Never know when to book because prices keep going up and down"
  - P3: "The fluctuation in prices is frustrating — hard to know when to book"
  - P6: "Saw prices go down after I purchased"

Recommendation: Add a price trend indicator showing historical price patterns and predicted low-price windows. This addresses the core frustration — lack of visibility into pricing logic — without requiring a price guarantee (which may not be feasible). Validate in follow-up research with users to confirm the indicator format that would be most useful.

Evidence gap: This research doesn't address whether users would pay more for a guaranteed price or preferred travel time. Additional research needed before deciding on premium pricing features.
```

### Step 4: Verify evidence before finalizing recommendations

**This is a critical step.** Before writing your final report, you must verify that every finding and recommendation is grounded in direct observation from your research data. This verification makes your findings defensible in high-stakes meetings with product leaders, executives, or stakeholders.

**Verification checklist for each pattern/finding:**

For every pattern or insight you plan to recommend on, do this:

1. **Identify the direct quote or observation**  
   "What did the participant actually say or do that shows this pattern?"  
   
   Examples:
   - Direct quote: *"I don't see a Save button. Does it save automatically?"* (P1, Task 2, timestamp 2:34)
   - Behavioral observation: P1 completed the upload but then re-checked the page, suggesting uncertainty about completion
   - Multiple mentions: P1 asked about save confirmation (Task 2); P2 expected feedback (Task 4)

2. **Trace it back to the source**  
   - Specify which participant(s) mentioned it
   - Specify which task it appeared in
   - If possible, note the timestamp in the video/audio where it occurred
   - Link directly to the transcript line number or audio segment

3. **Verify the interpretation**  
   - Is your interpretation of the quote/behavior reasonable?
   - Could someone else interpret it differently? (If yes, acknowledge the alternative)
   - Does the participant's behavior support your interpretation?

4. **Count participants and assess strength**  
   Using the 1/3 rule: Is this observation from enough participants to be a pattern?
   - 1 participant: One-off insight (note it, but don't over-weight it)
   - 2+ participants: Pattern threshold (strong enough for recommendation if you have 5+ total)
   - Every participant: Very strong signal

5. **Check for counter-evidence**  
   - Did any participants contradict this pattern?
   - Did any participants seem confused or disagree?
   - Note any nuance or exceptions

**Real example (from travel pricing research):**

❌ WEAK (no evidence reference):
"Participants are frustrated with booking complexity."

✓ STRONGER (with evidence):
"Participants expressed frustration about knowing when to book: P1 said 'Never know when to book because prices keep going up and down' (Task 3, 1:45); P3 said 'The fluctuation in prices is frustrating — hard to know when to book' (Task 3, 2:12). Both mentioned the same pain point using similar language."

**For recommendations specifically:**

Before writing each recommendation, ask:
- [ ] Can I point to 2+ participants who expressed this need/pain point?
- [ ] Do I have a direct quote or clear behavioral observation?
- [ ] Can I defend this recommendation in a 1:1 with a product director?
- [ ] Have I stated explicitly if evidence is weak or insufficient?
- [ ] If the recommendation is strong, did I still acknowledge limitations?

**Output format for defensible recommendations:**

```
Decision: [Your decision here]

Evidence:
- Pattern: [Name] ([# participants] / [total])
- Direct observation (P1): "[Exact quote]" (Task X, timestamp)
- Direct observation (P2): "[Exact quote]" (Task Y, timestamp)
- Behavioral indicator: [Specific behavior showing pattern]
- Pattern strength: [Strong/Moderate/Weak] because [reason tied to participant count & consistency]

Recommendation: [Specific, actionable recommendation]

Why this works: [How it addresses the evidence]

Evidence gap: [What we DON'T know; what additional research is needed]
```

---

### Step 5: Prioritize recommendations

If you have multiple decisions and multiple recommendations, prioritize them by:
- **Pattern strength** — recommendations based on strong patterns (4+ participants) over weak ones
- **Decision consequence** — which decisions have the biggest business/product impact?
- **Evidence sufficiency** — can this decision be made now, or does it need additional research?
- **Defensibility** — can you point to specific evidence for each claim?

---

## Running affinity diagramming with a team

When you have stakeholders involved in synthesis, the affinity diagram becomes a collaborative tool that builds ownership of findings.

**Why involve stakeholders:**
- They bring context about the business and product that you may not have
- When they synthesize the data themselves, they trust the findings more
- It distributes the cognitive load of reviewing large amounts of data

**How to structure a team affinity session:**

1. **Before the session:** Complete your own tagging (step 2) first. Prepare the raw post-its or digital cards for the session.

2. **Session structure:**
   - Brief introduction: what is an affinity diagram, what are we doing today
   - Tag review: explain the global tags so everyone uses them consistently
   - Individual review phase (divergent): each person reviews assigned transcripts or data independently and adds data points to the board
   - Clustering phase (convergent): the group clusters similar post-its and names the clusters together
   - Discussion: which clusters surprise you? Which confirm assumptions? Which represent the biggest opportunities?

3. **Facilitation principles:**
   - No judging or dismissing data points during clustering
   - If two people disagree about where a post-it belongs, it often belongs in both — or it deserves its own cluster
   - Focus on the data, not on advocating for a position

**For large studies (15+ participants):** Use mini-synthesis sessions after every 5–7 participants rather than doing one giant session at the end. Each mini-session clusters the data from those participants; the final session integrates across all mini-sessions.

---

## Digital tools for affinity diagramming

**Physical sticky notes:** Best when everyone is in the same room. No learning curve. Tactile and easy to rearrange.

**Miro / Mural / FigJam:** Best for remote synthesis or when you want a persistent, shareable board. Miro has a Miroverse template specifically for affinity diagramming.

**Google Sheets:** Good for tagging and note-taking before moving to a visual tool. Each row = a data point; columns = participant, quote, tag, cluster.

**Dovetail / Condens / Aurelius:** Dedicated research synthesis tools with built-in tagging and clustering. Most useful for teams running synthesis regularly at scale.

---

## Quick-start checklist

### Before affinity diagramming:
- [ ] Research brief or plan is available to reference
- [ ] All sessions have been recorded (with consent) or notes taken
- [ ] Transcripts or detailed notes exist for each participant
- [ ] You have decided which 4–5 global tags to use (based on your research objectives)
- [ ] You have enough space (physical table or digital board) to spread everything out

### During tagging:
- [ ] One data point per post-it / per cell
- [ ] Participant number included on each data point
- [ ] Each relevant statement has been assigned at least one tag

### During clustering:
- [ ] Data points grouped by tag first, then clustered within tags
- [ ] Each cluster has a descriptive name
- [ ] Clusters with 4+ data points are flagged as pattern candidates

### Before generating recommendations:
- [ ] Each pattern has been mapped back to a research objective
- [ ] Each decision has been matched with relevant patterns
- [ ] Evidence strength has been assessed for each pattern
- [ ] Gaps in evidence have been identified and stated explicitly

---

## Researcher reminders

**Evidence-first mindset:**
- **Every recommendation must be traceable to source data** — you should be able to point to a specific participant quote, timestamp, or behavioral observation that supports it
- **Write for a product director meeting** — if you can't defend a claim with direct evidence from your recordings, don't include it in the final report
- **Verify constantly as you synthesize** — don't wait until the end to check that findings are grounded; verify evidence while tagging and clustering

**Quality discipline:**
- **One data point per post-it** — combining two observations on one note is how you lose nuance
- **Always include participant numbers** — you need to be able to trace any finding back to who said it
- **Always include precise timestamps (HH:MM:SS)** — timestamps let others go back to the source recording to verify your interpretation; precision to the second enables direct verification
- **Track task-level timing** — document both session-level and task-level durations; timing reveals behaviors (rushed tasks, extended exploration, etc.)
- **State exactly what happened, not your interpretation** — say "P1 asked 'Does it save automatically?'" not "P1 was confused about save behavior"
- **Use your research brief throughout** — keep your original research objectives and decisions visible as you're diagramming and making recommendations

**Pattern assessment:**
- **The 1/3 rule is a starting guideline, not a hard rule** — use judgment, especially for high-consequence insights from fewer participants
- **Be explicit about evidence strength** — if a pattern comes from only 1-2 participants, say so clearly. Don't bury it in neutral language
- **Note outliers and contradictions** — if most participants said X but one said Y, mention it. This is data, not noise
- **Surprising clusters are often as valuable as confirming ones** — note when the data contradicts your assumptions; this is where the learning often is

**In the final report:**
- **State evidence gaps explicitly** — it's better to say "this research doesn't answer that question" than to over-interpret weak signals
- **Link every recommendation to specific evidence** — use the format: Pattern ([# participants] / total) + Direct quote + Behavioral observation
- **Own the limitations** — small sample? Say so. Only 2 participants explicitly asked about this? Acknowledge it. This builds trust, not weakness

**Team synthesis:**
- **Affinity diagrams done with stakeholders produce findings stakeholders trust more** — the extra time is often worth it
- **When you disagree on a cluster placement, that's data too** — disagreement points to areas where interpretation is ambiguous. Note it

**Scale and workflow:**
- **Group by tag first, then cluster within tags** — trying to cluster everything at once is how the process becomes overwhelming
- **For 15+ participant studies, mini-synthesis sessions after every 5–7 participants prevent the synthesis marathon**
- **Practice is the only way to internalize this** — the first affinity diagram takes a long time; the tenth is significantly faster. Verification becomes faster too

