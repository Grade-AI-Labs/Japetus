# Talentech language standards

Source: Confluence — **Language quality and standards**. This file is a compact operational reference for AI use.

## One Talentech platform

Use the same term and content pattern when meaning and context are the same. Before creating new copy:
1. Check whether an approved term or UX pattern already exists.
2. Reuse shared content when it meets the user need.
3. Create product-specific wording only when context genuinely requires it.

## Voice

Talentech is:
- **Friendly** — human, respectful, helpful; not cold, overly formal, or overly familiar.
- **Proactive** — help people complete tasks, avoid problems, and understand what happens next.
- **Reliable** — clear, calm, accurate, and consistent; do not hide important information or overpromise.

## Tone by situation

| Situation | Tone |
| --- | --- |
| Everyday tasks | Clear, direct, friendly |
| Guidance and positive outcomes | Warmer and encouraging |
| Errors and blockers | Calm, specific, recovery-focused |
| Security, privacy, legal, sensitive HR | Neutral, precise, respectful |

The more serious or irreversible the situation, the more direct and restrained the tone.

## General writing

- Start with the user's need, not internal process or system logic.
- Address the person as **you**. Use **we** when Talentech/service is responsible.
- Use familiar words, short sentences, and simple structures.
- Avoid internal terminology, technical jargon, unexplained abbreviations, idioms, slang, bureaucratic/legalistic wording, and unnecessary detail.
- Be short but complete. Important information comes first.
- Use specific action labels that describe what happens.
- Use inclusive and gender-neutral language where natural.
- Refer to interface elements by name, not only visual appearance or position.
- Links and actions must make sense when read independently.

## Errors and recovery

An error should explain:
1. What happened.
2. How to fix it or continue.

For user-correctable validation, use direct instructions such as:
- `Enter your email address`
- `Select at least one location`
- `End date must be after start date`

For a service problem, use a calm recovery pattern such as:
- `Sorry, we couldn't save your changes. Try again. If the problem continues, contact support.`

Use **sorry** when Talentech/service caused a genuine disruption. Do not use it for routine field validation.

Use **please** for polite or optional requests, not for mandatory requirements.

Never blame the person, expose technical codes, or use vague messages when the exact problem is known.

## Style and punctuation

- American English source.
- Sentence case for headings, labels, buttons, messages.
- Active voice and present tense when natural.
- Numerals for numbers.
- Contractions when natural and clear.
- No period on headings, labels, buttons, or short one-line confirmations.
- No colon after a label.
- Normal punctuation for longer messages.
- Hyphens for compounds; en dashes for simple ranges.
- Avoid em dashes.
- Use ellipsis only when content/action genuinely continues.
- Use exclamation marks sparingly; never to lighten serious content.
- Locale formatting belongs to the product implementation; do not hard-code one language's separators/order.

## Source content for localization

- Write complete and unambiguous strings.
- Add context when meaning is unclear in isolation.
- Do not build sentences from separately translated fragments.
- Use consistent, descriptive variable names.
- Allow variables to move in other languages.
- Support plurals and grammatical variants.
- Separate dates, times, numbers, and currencies from fixed text where possible.
- Avoid wordplay, cultural references, and English-dependent humor.
- Allow translations to become longer.
- Use approved terminology and existing copy patterns.

A translation should preserve meaning, function, tone, and seriousness, not English word order.

## Final check

Confirm that:
1. The content helps complete the current task.
2. The action, outcome, or next step is clear.
3. Tone fits the situation and risk.
4. Approved terminology and patterns are used.
5. Content is inclusive and understandable without visual context.
6. A translator or AI can translate it without guessing.
