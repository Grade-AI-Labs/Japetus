---
name: content
description: Write, rewrite, review, and improve Talentech English product content using Talentech language standards and UX copy patterns. Use for UI strings, buttons, labels, forms, validation, errors, confirmations, empty states, notifications, transactional emails, help or admin copy, source-copy review, and localization-readiness checks. Apply Talentech's friendly, proactive, reliable voice, approved UX patterns, American English, accessibility guidance, and localization-safe source-writing rules. Do not use for translation into other languages or for maintaining glossaries; those belong to separate localization skills.
---

# Talentech Design Content

Create and review English source content for Talentech products. Optimize first for user understanding and task completion, then for consistency, accessibility, and localization readiness.

## Load the right references

- Read `references/language-standards.md` for voice, tone, writing style, accessibility, and localization-ready source rules.
- Read `references/ux-copy-patterns.md` when working with UI patterns such as actions, forms, validation, errors, success messages, empty states, confirmations, emails, or notifications.
- Read `references/terminology-guidance.md` when wording introduces, changes, or depends on a product/domain term.

Do not load every reference when the task is small and obvious.

## Core workflow

1. Identify the content type and the user's goal.
2. Preserve known product behavior, meaning, risk, and consequence.
3. Apply approved terminology if it is available in the request or context.
4. Apply the relevant Talentech UX copy pattern instead of inventing a new variation without reason.
5. Rewrite for clarity, specificity, accessibility, and natural American English.
6. Check that the source can be translated without guessing.
7. Return the smallest useful output for the request.

## Voice and tone

Keep the Talentech voice **friendly, proactive, and reliable**.

Adapt tone by situation:
- Everyday task: clear, direct, friendly.
- Guidance or positive outcome: slightly warmer and encouraging.
- Error or blocker: calm, specific, recovery-focused.
- Warning or destructive action: direct and restrained.
- Security, privacy, legal, or sensitive HR content: neutral, precise, respectful.

As risk or irreversibility increases, reduce warmth and increase precision.

## Writing rules

- Start with what the person needs to know or do.
- Use plain, familiar language.
- Prefer active voice and present tense.
- Speak to the person as **you**. Use **we** when Talentech or the service is responsible for an action.
- Be concise but do not remove information required to understand, decide, or recover.
- Use specific action labels. Prefer `Download report` over `Continue` when the action is known.
- Use sentence case for headings, labels, buttons, and messages.
- Use American English for source content.
- Use contractions when natural and clear.
- Avoid em dashes, jargon, unexplained abbreviations, idioms, slang, bureaucratic wording, and decorative punctuation.
- Do not rely on color, shape, icon, or visual position to communicate meaning.
- Do not add unsupported product behavior, permissions, guarantees, legal meaning, deadlines, support promises, or consequences.

## Source content for localization

Make English source copy independently understandable before it reaches translation.

- Write complete, unambiguous strings.
- Add context when a term or action cannot be understood on its own.
- Do not construct sentences from separately translated fragments.
- Use descriptive, stable variable names.
- Preserve variables and allow them to move in translation.
- Support plurals and grammatical variants instead of assuming English grammar.
- Keep locale-formatted dates, times, numbers, and currencies separate from fixed text when possible.
- Avoid wordplay, culture-specific humor, and English-dependent phrasing.
- Allow room for translations to expand.
- If the English source is itself broken, ambiguous, internally inconsistent, or contains the wrong language, flag the source issue instead of polishing around it.

## Review behavior

When the user asks for a quick correction or wording suggestion, give the revised copy first. Keep explanation brief unless requested.

When the user asks for a review, distinguish:
- **Must fix**: wrong meaning, ambiguity, misleading action, inaccessible wording, broken variable/placeholder logic, or source text that cannot be translated reliably.
- **Should improve**: inconsistent pattern, terminology drift, unnecessary wording, weak action label, poor tone, or avoidable localization risk.
- **Optional**: stylistic preference with no meaningful UX or localization impact.

Do not rewrite merely to make wording different. Keep good existing copy when it already follows the standards.

## Terminology boundaries

Use approved terminology when available. Do not introduce synonyms for variety.

If a term could represent multiple concepts, do not guess from the English word alone. Use product context, a supplied glossary, or ask for clarification when the distinction changes meaning.

Do not turn full messages or one-off UI phrases into terminology rules. Glossary maintenance belongs to the separate Talentech Terminology skill.

## Output defaults

- **Draft request:** return the finished copy, with alternatives only when they materially differ.
- **Quick review:** return the recommended version plus a short reason if useful.
- **Detailed review:** group findings by severity and provide corrected copy.
- **Localization-readiness review:** identify ambiguity, fragmentation, variables, plurals, locale formatting, terminology, and missing context.
- **Multiple strings:** preserve the user's order and keys/IDs when provided.

Do not bury the recommended copy under analysis.
