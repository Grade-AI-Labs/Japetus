# Translation behavior examples

## Single short string

User:
> Translate to French: Optional cosigners can be added.

Return:
> Des cosignataires facultatifs peuvent être ajoutés.

Do not add analysis unless requested.

## Error message

User:
> French: Sorry, we couldn't update the salary. Try again or contact support if that doesn't work.

Return a natural French error that preserves the failed action and recovery step. Do not make it more alarming or more apologetic than the source.

## Placeholder preservation

Source:
> This salary review needs your approval by {{date}}.

A correct translation may move `{{date}}`, but must keep the exact placeholder name `{{date}}`. Never translate it to `{{datum}}`, `{{dateFR}}`, or another variable.

## Structured resource

Input:
```json
{
  "Button.Save": "Save",
  "Greeting": "Hello {{name}}"
}
```

Translate values only. Keep keys and `{{name}}` unchanged.

## Ambiguous term

Source:
> Position

If a supplied glossary defines the concept as an organizational position, use that approved term. If no context or glossary exists and the language requires a distinction that changes meaning, ask for context or flag the ambiguity rather than pretending one meaning is approved.

## Existing translation review

User:
> Source: selected items
> Current French: MultiSelectToolbar.Label.SelectedItems

Return the corrected target wording first:
> éléments sélectionnés

A brief note may follow only if useful: the existing value is a localization key rather than a French translation.

## Multiple languages

For a short string requested in several languages, default to a compact table with locale and translation. Preserve the same concept and seriousness across all languages rather than forcing identical sentence structure.
