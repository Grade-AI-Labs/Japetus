---
name: readiness
description: Prepare product work for Product Design by turning an issue, ticket, feature description, PRD fragment, or mixed project context into a concise, design-ready requirements structure. Use when asked to prepare, clarify, structure, review, or rewrite work before discovery, research, or a design brief; expose evidence, assumptions, gaps, open questions, research needs, accessibility considerations, acceptance criteria, and the appropriate level of Product Design involvement without inventing missing information.
---

# Design Readiness

Turn messy or incomplete product work into a reliable input for Product Design.

The output is not a final Design Brief and does not solve the design problem. It prepares the work for **Discovery → Design Brief → Design** by making the current knowledge, requirements, evidence, assumptions, and gaps explicit.

## Core principle

A good result is allowed to look incomplete.

Do not make weak source material sound complete. Make it more precise. When information is missing, uncertain, inferred, or unsupported, expose that uncertainty instead of filling the gap.

## Inputs

Use the information available in the user's source material, prioritizing:

1. The primary issue, ticket, task, feature description, or document.
2. Relevant context already present in the same work item.
3. Relevant linked work items or documents when they are provided and accessible.
4. Additional context explicitly supplied by the user.

Do not introduce unrelated information or external research unless the user asks for it.

If a linked source is inaccessible, do not pretend to have read it. Keep the gap visible.

## Preserve and consolidate

Preserve useful source material, especially:

- concrete requirements,
- decisions already made,
- important terminology,
- links and references,
- screenshots or embedded-content references,
- useful acceptance criteria,
- known constraints and dependencies.

Consolidate:

- duplicate information,
- repeated requirements,
- fragmented statements describing the same thing,
- clearly superseded text when the newer statement is unambiguous.

Do not silently remove information when it may still matter.

## Never invent

Do not invent:

- facts,
- user needs,
- evidence,
- research findings,
- metrics,
- requirements,
- priorities,
- scope,
- constraints,
- dependencies,
- accessibility requirements,
- acceptance criteria,
- Design System components or patterns.

Do not turn an assumption into a fact.

## Classify information correctly

Use these distinctions consistently:

**Known information**  
Explicitly supported by the supplied source material.

**Evidence**  
Research, analytics, customer feedback, support cases, logs, experiments, or documented observations that support a claim. Preserve or cite the source when available.

**Assumption**  
A belief, hypothesis, inference, or proposed explanation that is not sufficiently supported by evidence.

**Open question**  
Something that still requires clarification, validation, evidence, or a decision.

A proposed solution is not automatically evidence of the problem.

## Workflow

1. Read the source material completely before restructuring it.
2. Identify the proposed change or work request.
3. Separate the underlying problem from the proposed solution.
4. Extract known users, outcomes, evidence, requirements, constraints, and acceptance criteria.
5. Identify assumptions and unsupported claims.
6. Identify missing information and classify each important gap.
7. Identify which gaps genuinely require research or analytics.
8. Assess known accessibility and Design System implications without inventing them.
9. Recommend the appropriate level of Product Design involvement.
10. Produce one concise, Jira-friendly or issue-tracker-friendly description using the template below.

If the user asks only for an assessment rather than a rewrite, use the same reasoning but present the gaps and recommendations without replacing their original content.

# Output template

Use this section order by default. Omit a section only when the user explicitly requests a shorter format.

## Summary

Give 1–3 bullets describing:

- what the work is about,
- why it exists,
- the intended change or outcome when known.

Keep this concise.

## Problem

Describe the actual user or product problem being addressed.

Do not merely restate the proposed feature, UI, or implementation.

If the underlying problem is unclear, state what is currently known and add the missing definition to **Open questions**.

## Users / affected groups

Identify the users, roles, customer groups, or segments affected.

Only include groups supported by the available context. If unknown, state that clearly.

## Desired outcome

Describe what should become better or different if the work succeeds.

Separate the desired outcome from the proposed implementation where possible.

Include measurable outcomes only when they are supported by the source material.

## Evidence

List evidence currently supporting the problem and preserve its source when available.

Evidence may include:

- analytics or metrics,
- research findings,
- customer feedback,
- support cases,
- experiments,
- documented observations.

If none is available, write:

**No supporting evidence is currently documented.**

Do not fabricate evidence.

## Assumptions

List important assumptions being made about the problem, users, behavior, value, or proposed solution.

Do not repeat information already supported by evidence.

If none can be identified, write:

**None identified.**

## Current experience

Describe how the relevant experience works today when this is supported by the source material.

Preserve useful flows, screenshots, links, embedded content, or references.

Do not infer the current experience solely from the proposed solution.

## Requirements

List concrete requirements supported by the source material.

Keep requirements separate from assumptions and possible design solutions.

Use **Must / Should / Could** only when priority is explicit or clearly supported. Do not invent prioritization.

## Constraints and dependencies

Capture known constraints and dependencies, such as:

- technical constraints,
- product dependencies,
- legal or compliance requirements,
- localization requirements,
- platform limitations,
- rollout constraints,
- timeline dependencies,
- related work.

Do not invent constraints.

## Accessibility considerations

Capture known accessibility requirements, risks, or constraints relevant to the work.

If accessibility has not yet been assessed, write:

**Accessibility requirements still need to be assessed.**

Do not add generic accessibility requirements only to populate the section.

## Acceptance criteria

Preserve useful existing acceptance criteria.

Rewrite them where necessary so they describe clear, observable outcomes.

Only include criteria supported by the source material. Do not invent criteria to make the section look complete.

Move important missing criteria to **Open questions** when appropriate.

## Open questions

List the important unanswered questions that need to be resolved before or during design.

Focus especially on gaps in:

- problem definition,
- affected users,
- evidence,
- desired outcome,
- scope,
- behavior,
- edge cases,
- constraints,
- accessibility,
- success criteria.

Label each question with exactly one of:

- **Needs stakeholder clarification**
- **Needs product decision**
- **Needs technical validation**
- **Needs evidence / research**

Open questions are an important output. Do not hide uncertainty by guessing.

## Research needs

Identify unanswered questions that require evidence rather than stakeholder clarification, product decisions, or technical validation.

Possible research needs include:

- validating whether the problem exists,
- understanding user behavior,
- understanding needs or expectations,
- evaluating the current experience,
- investigating product usage or metrics,
- testing a proposed interaction.

When useful, suggest a lightweight method as an option, such as an analytics check, existing-evidence review, interview, or usability test.

Do not recommend research merely because this section exists.

If existing evidence appears sufficient for the current stage, state that no additional research need has been identified yet.

## Existing patterns / Design System considerations

Capture existing components, patterns, flows, templates, or reusable solutions explicitly mentioned in the source material.

If this cannot be determined, write:

**Design System and pattern mapping still needs to be completed.**

Do not invent existing components or patterns.

## Recommended Product Design involvement

Choose exactly one level and justify it in 2–4 concise bullets.

**Self-serve**  
Existing patterns, components, or guidance appear sufficient and dedicated Product Design work is probably unnecessary.

**Consult**  
Targeted Product Design guidance, review, or limited design work is appropriate.

**Partner**  
Product Design should actively participate through discovery, design, validation, and delivery.

Base the recommendation on:

- complexity,
- uncertainty,
- user impact,
- risk,
- how much of the solution already exists.

Do not equate effort alone with the engagement model.

## Out of scope

List items explicitly identified as outside the work or intentionally deferred.

Do not invent scope boundaries.

If none are documented, write:

**None identified.**

# Writing rules

- Use neutral, structured, practical language.
- Optimize for skimmability in an issue tracker.
- Prefer headings and bullets over long prose.
- Preserve important terminology and critical requirement wording where useful.
- Keep the result concise enough to remain a working issue description, not a project document.
- Avoid duplicating the same information across sections.
- Preserve relevant links and references.
- Keep facts, evidence, assumptions, and questions visibly separate.
- Do not solve the design problem.
- Do not create the final Design Brief.
- Do not imply that discovery is complete when it has not happened.

# Quality check

Before finalizing, verify:

1. Is the actual problem understandable?
2. Is the proposed solution separated from the problem?
3. Do we know who is affected, or is that gap explicit?
4. Is the desired outcome understandable?
5. Is supporting evidence visible, or is its absence explicit?
6. Are assumptions separated from evidence?
7. Are requirements traceable to the source material?
8. Are important unknowns visible and classified?
9. Are research needs separated from stakeholder, product, and technical questions?
10. Are accessibility considerations represented without inventing requirements?
11. Are Design System considerations represented without inventing patterns?
12. Could another Product Designer use this as the starting point for Discovery and later create a Design Brief from it?

If any answer is no, expose the missing information in the appropriate section instead of guessing.

# Short example

For a ticket that only says "Add settings so users can customize AI candidate search prompts," do not rewrite this as a proven user need.

Prefer:

**Problem**  
The ticket proposes additional prompt configuration, but the underlying user problem is not yet clearly documented.

**Evidence**  
No supporting evidence is currently documented.

**Assumptions**  

- Additional prompt control may help users get more relevant search results.

**Open questions**  

- **Needs evidence / research:** What problems do users experience with the current search results?
- **Needs product decision:** Is prompt customization the intended product direction, or one possible solution?

This is better than making unsupported statements sound complete.
