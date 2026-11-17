# Talentech translation standards

## Goal

Make localized product content feel as if it was written naturally for the target-language user while preserving the same concept, task, tone, and level of seriousness as the English source.

## Voice

Talentech is:

- friendly: human, respectful, helpful, not cold or overly familiar
- proactive: help users complete the task and understand what happens next
- reliable: clear, calm, accurate, and consistent

Adapt tone to the situation:

- everyday tasks: clear, direct, friendly
- guidance and positive outcomes: warm but restrained
- errors and blockers: calm, specific, recovery-focused
- security, privacy, legal, destructive, and sensitive HR situations: neutral, precise, respectful

The more serious or irreversible the situation, the more restrained and direct the language should be.

## Translation principles

- Preserve meaning, function, tone, and seriousness rather than English word order.
- Prefer natural contemporary target-language phrasing over literal translation.
- Use plain language and familiar vocabulary.
- Keep content concise but complete.
- Use active constructions when natural in the target language.
- Preserve distinctions between product concepts; do not merge terms because they sound similar.
- Do not add information that is absent from the source unless required grammatically.
- Do not remove consequences, warnings, recovery steps, or qualifying information.
- Avoid unexplained technical jargon, bureaucratic language, slang, idioms, and unnecessary anglicisms.
- Use inclusive wording and avoid unnecessary gender assumptions.

## UX content

Buttons and actions should describe the action clearly. Translate the action naturally for the target language rather than preserving English grammatical form.

Validation messages should tell the user what is missing or how to correct it.

System errors should explain what failed and what to do next. Use an apology only when the service caused a genuine disruption, not for routine validation.

Destructive actions should remain direct and explicit. Preserve irreversible consequences such as "This can't be undone" when true.

Do not weaken or intensify risk compared with the source.

## Terminology

Use one concept consistently. Do not introduce synonyms merely for stylistic variation.

Terminology priority:

1. approved shared Talentech terminology
2. approved domain or product terminology
3. reviewed legacy terminology when no approved replacement exists
4. old translations only as reference

A glossary term can change grammatical form in context. Preserve the concept, not the dictionary surface form.

## Formatting and punctuation

- Use sentence case unless the target language or an approved name requires otherwise.
- Use the target locale's punctuation and spacing conventions.
- Use locale conventions for numbers, dates, time, and currency when formatting is part of the text.
- Do not alter placeholders or variable names.
- Do not copy English title case into languages that do not use it.
- Avoid decorative punctuation and unnecessary exclamation marks.

## Localization safety

- Never translate localization keys or code identifiers when they are not user-facing content.
- Preserve placeholders exactly, including capitalization and spelling.
- Preserve HTML/XML/Markdown syntax.
- Keep complete sentences complete; do not invent fragment assembly.
- Respect plural and grammatical variants when present.
- Allow variable order to change when grammar requires it.
- Keep protected product and provider names unchanged unless an approved localized name is provided.

## Final check

Before returning a translation, verify:

1. The meaning and user action match the source.
2. Approved terminology is used when available.
3. The target text sounds natural, not translated.
4. Placeholders and markup are complete and unchanged.
5. Tone matches the risk and context.
6. Punctuation and casing fit the locale.
7. Nothing important was added, omitted, or softened.
