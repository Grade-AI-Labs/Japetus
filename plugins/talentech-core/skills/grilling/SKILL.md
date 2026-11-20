---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

## When a wrapper skill runs you

A **wrapper** is a role skill (for example `talentech-product:grill-prd`) that invokes this skill and adds the _what_: a checklist, context and an output template in its `references/`. The _how_ stays here. When a wrapper has invoked you:

- **Read the wrapper's references first**, before the first round, if it has not already loaded them.
- **Every checklist topic is a required branch** of the design tree. The frontier is not empty while a checklist topic is unvisited.
- **Pacing is this skill's**: batched frontier rounds, numbered questions, a recommended answer each. A wrapper does not change how the interview is run; it changes what it covers.
- **Open topics.** A topic is **Open** only when the user explicitly agrees to defer it, and it carries a reason. Do not ask a question that depends on an Open topic on an assumed answer: log it as Open together with that topic. Writing "Open" on a topic the user has not agreed to defer does not settle it.
- **Stages.** A wrapper may split the interview into stages, each with its own artifact. Run each stage in this order:
  1. Settle every topic of the stage, or agree with the user to defer it as Open.
  2. Draft the stage's artifact from the wrapper's template. Never silently drop a field: write `Open — <reason>` or `N/A — <reason>`.
  3. Review it with the user section by section, and revise it.
  4. The user confirms the artifact.
  5. Only then start the next stage.

  The user agreeing that the interview is complete does not by itself start the next stage: the artifact must be confirmed. A wrapper with no stages has one stage, and its artifact is written the same way.
