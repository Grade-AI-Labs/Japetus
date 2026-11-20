# UX flow checklist

Every topic is a required branch of the design tree. Settle it, or agree with the user to defer it as Open with a reason.

## The flow (figjam-flow's "Plan before drawing")

- **Title and purpose**: what the flow is called and the user goal it serves.
- **Start and end states**: where the user comes from (entry points, triggers) and every way the flow ends (success, cancel, failure).
- **Ordered main path**: the happy-path steps, in order.
- **Decisions and labelled outcomes**: every branch point and the label on each outcome.
- **Inputs and outputs**: what the user enters or brings at each step, and what the system produces or changes.
- **Actors and systems**: who or what is responsible for each step (candidate, recruiter, hiring manager, admin, an integration, an AI feature, the ATS).
- **Exceptions, loops and gaps**: retries, going back, abandoning and resuming, and anything still unknown.

## Per step

- **States**: error, empty, loading and permission (who may see or do this step; what someone without the right sees).
- **Edge cases**: bad or missing data, timeouts, concurrent edits, an integration or AI feature that is down.

## Across the flow

- **Duo components**: which Duo design system components each step uses, and where a new component or pattern would be needed.
- **Accessibility**: keyboard and screen-reader path, focus order across steps, error announcement, colour not the only signal.
- **Localisation**: which markets and languages (SV, NO, DA, FI, NL, EN), text expansion, date, number and name formats, and any market-specific step or rule (for example public-sector transparency).
- **Constraints**: product (Reachmee, Talentrecruiter, Webcruiter, Varbi), GDPR and consent steps, and EU AI Act transparency where an AI feature takes part in the flow.
