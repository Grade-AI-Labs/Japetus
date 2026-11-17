---
name: translate
description: Translate Talentech product and UX content from English into supported locales using Talentech language standards, approved terminology, locale-specific writing rules, and localization-safe handling of placeholders, markup, plurals, keys, and protected product names. Use for translating individual UI strings, batches of strings, emails, notifications, JSON/resource files, or reviewing a proposed translation when the user wants the target-language wording rather than a broader localization audit or glossary-maintenance workflow.
---

# Talentech Design Translate

Translate product content faithfully while making it sound natural in the target language. Preserve the source meaning, function, tone, seriousness, and technical structure. Do not translate word-for-word when natural grammar requires a different construction.

## Core workflow

1. Identify the target language or locale. If it is not specified and cannot be inferred, ask for it.
2. Read `references/general.md` for Talentech-wide translation rules.
3. Read only the relevant locale file from `references/` for each requested target language.
4. Use any glossary, term list, product context, screenshot, or approved translation supplied by the user as higher-priority evidence.
5. Translate the content while preserving placeholders, markup, keys, IDs, file structure, and protected names.
6. Check meaning, terminology, grammar, punctuation, placeholders, and source-target completeness before returning the result.

## Supported locale references

Load only what is needed:

- Finnish: `references/fi-FI.md`
- Swedish: `references/sv-SE.md`
- Norwegian Bokmal: `references/nb-NO.md`
- Norwegian Nynorsk: `references/nn-NO.md`
- Danish: `references/da-DK.md`
- French: `references/fr-FR.md`
- Polish: `references/pl-PL.md`
- German: `references/de-DE.md`
- Dutch: `references/nl-NL.md`

If the requested language is not listed, still follow `references/general.md` and use natural contemporary language for the requested locale. Do not claim a Talentech locale guide exists when it does not.

## Terminology priority

Use terminology in this order:

1. Explicit user instruction for the current task.
2. Approved glossary or terminology file supplied with the task.
3. Approved project or domain terminology supplied in context.
4. Existing reviewed translations supplied as evidence.
5. Natural target-language wording consistent with the concept.

Do not invent an "approved" Talentech term when no approved source is available. If a term is materially ambiguous, translate the rest and flag only that term unless the user asks for a terminology analysis.

Inflect approved terms naturally. Glossary entries are concept terms, not immutable sentence fragments.

## Preserve technical structure

Never silently alter:

- placeholders such as `{{date}}`, `{0}`, `%s`, `%name%`
- HTML/XML tags
- Markdown structure when structure matters
- ICU/plural syntax
- interpolation variables
- localization keys or resource IDs
- URLs, email addresses, code, or identifiers unless explicitly asked

Variables may move within the sentence when target-language grammar requires it, but their names must remain unchanged.

For structured translation files, translate values only unless the user explicitly asks to change keys or structure.

## Protected names

Do not translate brand, product, provider, or technical names unless an approved localized form is supplied. Common examples include:

- Talentech
- Candidate ID
- People Core
- Kuntarekry
- BankID
- Google
- LinkedIn
- Facebook
- PIN

Treat other proper product names the same way unless context says otherwise.

## Source-quality problems

Translate approved source copy as written. Do not silently rewrite the source to make it "better".

If the source has a defect that would materially change the translation, such as:

- a wrong-language source string
- contradictory meaning
- an obsolete or missing placeholder
- a fragment with multiple plausible meanings
- a key or internal identifier used as source text

flag the issue briefly and provide the safest translation only when the intended meaning is still clear. If meaning is not recoverable, ask for clarification rather than guessing.

## Output behavior

Match the user's requested format.

- For one short string and one language, return only the translation by default.
- For several languages, use a compact table unless the user asks for another format.
- For batches, keep source order and identifiers.
- For resource files, preserve the original structure and return a modified file when the user asks for a file deliverable.
- Do not add explanations, alternatives, or back-translations unless useful or requested.
- If reviewing an existing translation, give the corrected target wording first. Explain only the meaningful issue.

See `references/examples.md` for representative behavior.

## Boundaries

Use this skill for translation and translation-level review.

Do not turn a simple translation request into a full localization audit. For broad QA across files, placeholder inventories, untranslated-cluster detection, or systemic error analysis, use the localization QA workflow instead.

Do not perform glossary governance, domain classification, TBX maintenance, or approval-status management as part of ordinary translation. Those belong to terminology maintenance.
