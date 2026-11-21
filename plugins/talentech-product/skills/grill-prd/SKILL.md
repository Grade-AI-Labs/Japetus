---
name: grill-prd
description: Take a new product idea from raw problem to a developer-ready PRD by grilling, in two gated stages. Stage 1 locks a problem statement (who, evidence, cost, root cause, job-to-be-done) with no solution talk; Stage 2 turns it into a PRD (goals, non-goals, edge cases, measurable success metrics, risks). Use whenever the user has a new feature or product idea, wants to define or sharpen a problem, write a problem statement, start or draft a PRD, or says things like "I have an idea for…", "help me define the problem", "let's write a PRD", "turn this into requirements", even if they don't say "PRD". Also use when they bring an existing problem statement and want the PRD. Do NOT use to stress-test a plan or PRD that already exists; that is grill-me.
---

# Grill a PRD

Before the first question, read [references/context.md](references/context.md), [references/problem-statement.md](references/problem-statement.md) and [references/prd.md](references/prd.md). Then call the Skill tool with "talentech-core:grilling" and run the interview by its rules, including its section on wrapper skills. This skill supplies the _what_: two stages, their checklists and their templates.

## Stages

1. **Problem statement.** Checklist and template: `references/problem-statement.md`. No solution talk: if the user describes a solution, pull back to the problem it solves.
2. **PRD.** Checklist and template: `references/prd.md`. It builds on the confirmed problem statement and does not re-interrogate it.

Stage 2 starts only when the user has confirmed the written problem statement.

## Entry point

Pick it before the first round:

- A new idea, or anything framed as a solution ("we should build X") → Stage 1.
- A problem statement with every Stage 1 field filled, or agreed Open with a reason → Stage 2.
- A problem statement missing fields → say which, and run Stage 1 on those fields only.
- The user wants to skip Stage 1 without a problem statement → push back once: a PRD on an unlocked problem gets rewritten later. If they insist, run the Stage 1 topics as the opening topics of Stage 2 and log the gaps as Open.

## While grilling

- **Look it up before asking.** Check the conversation, attachments, memory and connected tools (Confluence, Jira, Productboard, Figma, Drive). If a lookup answers a question, state the finding and its source in one line instead of asking. Keep what you verified apart from what the user asserted.
- **Fit the questions to the work.** New feature, change to an existing flow, internal tooling or design-system work: ask only what fits the idea in front of you.
- **Dodges get a narrower question.** If the user dodges, say so and ask a narrower one. "We'll figure it out later" on a question that changes scope, cost or risk is not Open until you have named the risk and the user agrees to defer it.
- **Agree when the user is right, not when they are confident.** If you disagree, say so once with the reason, then respect their call.

## Output and delivery

For each stage's artifact:

1. Write it in chat with the exact template from the stage's reference file.
2. Walk the user through it section by section. Flag what is assumed rather than evidenced.
3. Mark everything that needs checking before it is used: unverified figures, estimates and legal readings.

After the PRD is confirmed, ask in one line whether to push it to Confluence. On a yes, call the Skill tool with "talentech-core:push-to-confluence", and ask for the parent page if it isn't known. Don't push without a yes.

Then suggest the next step in one line: `/talentech-design:readiness` if design involvement needs scoping, or `/talentech-design:brief` if design work is ready to brief (when the design plugin is installed).

## Language

Write in British English. If the user writes in Finnish, interrogate in Finnish. The written output uses whatever language the user asks for, defaulting to English.
