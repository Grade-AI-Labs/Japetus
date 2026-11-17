---
name: interview-guide
description: "Build a discussion guide for a generative 1-on-1 research interview. Use this skill when the user asks to create, write, or structure an interview guide, discussion guide, or script for a 1-on-1 qualitative research session focused on understanding people's experiences, behaviors, needs, motivations, or mental models — not usability testing or concept testing. Triggers include: 'write me an interview guide', 'help me with my discussion guide', 'I have interviews next week', 'create questions for my user interviews', 'generative research guide', 'discovery interviews', 'product discovery interviews'."
author: Lindsey Crabtree
---

# 1-on-1 Interview Guide Builder

This skill builds a structured, generative 1-on-1 interview guide grounded in research goals — not a list of questions for its own sake. The output should help a researcher have a real conversation, not read from a script.

## What you need from the user first

Before writing a single question, collect the following. If any are missing, ask for them:

1. **Research goals** — What decisions does this research need to support? What does the team need to learn or feel confident about? (If they give you vague goals like "understand users better", push back and ask what specifically they need to know.)
2. **Participant profile** — Who are they interviewing? What's their relationship to the topic?
3. **Session length** — How long is each session? (Default assumption: 60 minutes)
4. **Research context** — Is this product-agnostic generative, strategic research, or is there a product/feature/topic anchoring it?

---

## Core principle: goals drive questions

Never write questions first. Always start from research goals and work downward. Each section of the guide should map to a specific goal. This is the most important structural difference between a useful interview guide and a generic one.

The structure is:

**Research goal → Topic area → Opening question (TEDW) → Follow-up probes**

---

## The TEDW framework (use this for every main question)

All main interview questions must use one of these four openers. They produce open-ended, non-leading, story-eliciting questions:

- **T** — "Tell me about..." / "Talk me through..."
- **E** — "Explain..."
- **D** — "Describe..."
- **W** — "Walk me through..."

These openers work because they invite storytelling rather than yes/no answers, avoid directing the participant toward a specific answer, and create space for the participant to take the conversation where it matters most to them.

Never write questions that are:
- Leading ("How much do you enjoy...?")
- Future-hypothetical ("Would you use this feature?")
- Double-barreled ("How do you feel about X and Y?")
- Yes/no ("Did you find what you were looking for?")
- Asking participants to design ("What would you change?")
- Quantifying in a qualitative context ("How confident did you feel, on a scale of 1-10?")

---

## Guide structure

A generative 1-on-1 interview guide has five sections. Adjust question count based on session length.

### Section 1: Warm-up (5-10 minutes)
Do not start the session with research questions. Start with human conversation. The goal is rapport, not data — yet.

Include:
- A genuine "how are you" exchange
- One or two low-stakes questions about what they do, their role, or their day
- A brief explanation of how the session works (they're the expert, there are no wrong answers, thinking out loud is encouraged, it's okay to say they don't know)

Example warm-up questions:
- "Tell me a bit about what you do — I'd love to understand your role before we dive in."
- "Walk me through a typical day for you."

### Section 2: Context-setting (10-15 minutes)
Orient the participant to the topic area without revealing what you're looking for. These questions establish their relationship to the domain before you dig deeper.

Use TEDW openers. Anchor questions to real past experiences, not hypotheticals.

Example framing: "I'd love to start by understanding your experience with [topic area] more broadly, before we get into specifics."

### Section 3: Core research questions (25-35 minutes)
This is the heart of the guide. Map each question cluster directly to a research goal. Include 2-4 main questions per goal with suggested follow-up probes.

These should be sparse — the guide is a skeleton, not a script. Leave room for the conversation to go where the participant takes it.

### Section 4: Edge cases and depth probes (5-10 minutes)
Include a small bank of follow-up probes the researcher can draw on throughout — not tied to a specific question, but available when a participant uses vague language or the researcher wants to go deeper.

Standard follow-up probe bank (include these in every guide):
- "Why?" / "How so?" — probe deeper without directing
- "Tell me more about [thing they said]." — follow TEDW
- "Explain what you mean by [vague/subjective word]." — always probe emotional or subjective language
- "Describe how that made you feel." — get emotional context
- "In what sense?" — a gentle, non-leading way to invite elaboration
- Mirroring: repeat the last 2-3 words of what they said back to them as a statement — "You were frustrated..." — and wait.
- The count-to-three rule: after a participant finishes speaking, count silently to three before responding. Silence prompts participants to keep talking.

Flag these subjective/emotional words as always-probe triggers: happy, frustrated, annoyed, confused, excited, overwhelmed, fine, easy, hard, obvious, intuitive, messy, seamless. These words mean completely different things to different people — never accept them at face value.

### Section 5: Closing (5 minutes)
- Ask if there's anything they wanted to cover that you didn't get to
- Thank them genuinely
- Explain next steps (how findings will be used, when they might hear back if relevant)

---

## Session length guidelines

| Session length | Main questions | Time per goal area |
|---|---|---|
| 45 minutes | 6-8 main questions | 8-10 min |
| 60 minutes | 8-12 main questions | 10-15 min |
| 90 minutes | 12-17 main questions | 12-18 min |

A 90-minute generative guide with 17 questions (including follow-ups) is a full session. Do not overstuff. The participant should talk 90% of the time — if the guide has more questions than the time allows, cut questions, not conversation.

---

## Output format

Produce the guide in this structure:

```
INTERVIEW GUIDE: [Topic]
Session length: [X] minutes
Participant profile: [Description]

RESEARCH GOALS
1. [Goal one]
2. [Goal two]
3. [Goal three]

---

SECTION 1: WARM-UP (~X min)
[Questions]

SECTION 2: CONTEXT-SETTING (~X min)
Goal: [Which goal this serves]
[Questions + follow-up probes indented below each]

SECTION 3: CORE QUESTIONS (~X min)
Goal 1: [Goal name]
[Questions + probes]

Goal 2: [Goal name]
[Questions + probes]

SECTION 4: PROBE BANK
[Standard probes + any topic-specific ones]

SECTION 5: CLOSING (~X min)
[Closing questions]

RESEARCHER REMINDERS
- [Key reminders for running this specific session]
```

---

## Researcher reminders to always include

At the bottom of every guide, include a short set of reminders tailored to the session. Always include:
- Use the TEDW openers when you go off-guide
- Probe any emotional or subjective word — don't let "fine," "frustrated," or "easy" pass without follow-up
- Count to three after they finish speaking before you respond
- Mirror their language back to them to invite elaboration
- Your guide is a starting point — follow the participant, not the script
- Write down anything that distracts you mid-session so you can clear your head and stay present

---

## What this skill does NOT produce

- Usability testing scripts (not covered by this skill)
- Concept testing guides (not covered by this skill)
- Survey questions
- A rigid script to read word-for-word — this is always a conversation skeleton
