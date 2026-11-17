# Examples

Use these as behavior examples, not as a closed phrase library.

## Validation

Input:
`The end date you have entered is invalid.`

Preferred:
`End date must be after start date`

Reason: state the exact correction when known.

## Service error

Input:
`Update salary failed.`

Preferred:
`Sorry, we couldn't update the salary. Try again. If the problem continues, contact support.`

Reason: explain what failed and provide recovery.

## Empty state

Input:
`No templates`

Preferred:
`No templates here yet`
`Add a template to get started.`
Action: `New template`

## Destructive action

Input:
Title: `Are you sure?`
Body: `Delete template?`
Buttons: `No / Yes`

Preferred:
Title: `Delete template?`
Body: `This can't be undone.`
Buttons: `Cancel / Delete template`

## Localization readiness

Problematic source:
`You have {{count}} selected item(s)`

Improve the source model instead of relying on English `(s)`. Use plural-aware source strings and keep the variable stable.

Problematic source:
`Click here to continue`

If the action is known, name it, for example `Review application` or `Save and continue`.
