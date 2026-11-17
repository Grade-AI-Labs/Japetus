# Talentech UX copy patterns

Source: Confluence — **UX copy patterns**. Reuse a shared pattern when meaning and context are the same. Adapt only when the user need, action, consequence, or risk is genuinely different.

## Actions and buttons

Use a verb that describes what will happen. Add the object when context does not make it obvious.

Prefer:
- `Save application`
- `Create user`
- `Download report`
- `Edit candidate details`
- `Delete template`

Avoid vague labels such as `Click here`, `OK`, or `Continue` when the actual action can be named.

Button sets:
- One-step action: `Cancel` + specific action.
- Multi-step: `Cancel / Next`, then `Back / Next`, then `Back / [final action]`.
- Create: `New X`.
- Change existing object: `Edit X`.

## Forms, labels, helper text

- Give every field a visible label.
- Keep labels short and recognizable.
- Do not add a colon.
- Do not use placeholder text as the only label.
- Use a placeholder only for an example or useful additional instruction.
- Use helper text before an error when a requirement may not be obvious.

## Validation

Missing information patterns:
- `Enter X`
- `Select X`
- `Select at least one X`

Invalid information patterns:
- `Enter a valid X`
- `X must contain Y`
- `X must be at least Y`
- `X must be after Y`

Do not use vague messages such as `Invalid input` or `Submission failed`. Do not blame the person.

## Success, information, warning

Success:
- Pattern: `X was Y`
- Examples: `User was created`, `Template was saved`, `Groups were deleted`
- No period for short one-line confirmation.
- Avoid unnecessary `successfully`.

Information:
- State the relevant fact and what happens next if needed.

Warning:
- Explain the risk and how to avoid it.
- Stay calm and specific.

## Errors

Known failed action:
`Sorry, we couldn't X the Y. Try again. If the problem continues, contact support.`

Unknown problem:
`Sorry, something went wrong. Try again. If the problem continues, contact support.`

Use the generic version only when the product cannot provide something more specific.

## Empty states and no results

Nothing created yet:
- Title: `No X here yet`
- Body: `Add X to get started.`
- Action: `New X`

Content will appear later:
- Title: `Nothing here yet`
- Body: `Future X will appear here.`

Search/filter no results:
- Title: `No matching results`
- Body: `Check your search or filters and try again.`

Nothing needs attention:
- Title: `All done`
- Body: `Nothing needs your attention right now.`

## Loading and progress

Use a specific active message when it helps:
- `Loading candidates...`
- `Looking for comments...`
- `Saving your changes...`

Use `Almost there` only when genuinely near completion. Show measurable progress when available.

## Confirmations and destructive actions

Do not confirm common, low-risk, easily reversible actions.

Reversible but uncommon:
- Ask `Do you want to X?`
- Buttons: `Cancel` + specific action.

Destructive/irreversible:
- Title: `Delete X?`
- Consequence: `This can't be undone.` only when true.
- Buttons: `Cancel`, `Delete X`.

Avoid standalone `Are you sure?`.

## Error pages

Page not found:
- `Page not found`
- `Sorry, we couldn't find the page you're looking for.`
- Action: `Go to start page`

Unspecified page error:
- `Something went wrong`
- `Sorry for the trouble. Try again or contact support if the problem continues.`
- Provide a useful recovery action when possible.

## Transactional emails

Include:
1. Subject stating purpose.
2. First sentence explaining why the person received it.
3. Information needed to understand/complete the task.
4. One clear primary action.
5. Support/fallback when needed.

Use the same terminology and action wording as the product. Content must remain understandable without images.

## In-product notifications

- Use a short title for the event or outcome.
- Use the body for the most important detail or next action.
- Do not repeat the same message in title and body.
- Use persistent notifications only when the person may need the information later.
