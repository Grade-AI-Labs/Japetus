# FigJam flow standard

Read this reference whenever creating or standardising a flow.

## Semantic shape system

Use this fixed system for user flows, user journeys, and application flows.

| Meaning | FigJam `shapeType` | Default colour role |
| --- | --- | --- |
| Start or end | `ROUNDED_RECTANGLE` | Highlight |
| User or system action | `SQUARE` | Informative |
| Decision | `DIAMOND` | Warning |
| Input or output | `PARALLELOGRAM_RIGHT` | Positive |
| Direction | Native `Connector` | Strong border |

Use these optional shapes only when their meaning is present or the user requests them:

| Meaning | FigJam `shapeType` |
| --- | --- |
| Predefined subprocess | `PREDEFINED_PROCESS` |
| Manual input | `MANUAL_INPUT` |
| Data store | `ENG_DATABASE` |
| Document | `DOCUMENT_SINGLE` when available; otherwise a labelled rectangle |
| Hard blocker or stop | `OCTAGON` |

Do not add optional shapes simply to create variety.

For generic flows, use `SQUARE` for every step, including the first and last step. Differentiate start/end through labels or restrained colour changes only when helpful.

## Duo colour mapping

FigJam cannot resolve CSS custom properties. Fetch and resolve current Duo token values before writing colours:

1. Read `https://design.talentech.io/llms.txt`.
2. Find the current `@duo/tokens` version and the published token CSS URL.
3. Fetch `https://design.talentech.io/cdn/duo/tokens/{version}/base/tokens.css`.
4. Resolve the semantic tokens below and convert their hex values to 0–1 RGB for the Figma Plugin API.

Use this mapping:

| Diagram role | Duo token |
| --- | --- |
| Highlight/start/end fill | `--duo-color-background-feedback-highlight` |
| Action/process fill | `--duo-color-background-feedback-informative` |
| Decision fill | `--duo-color-background-feedback-warning` |
| Input/output fill | `--duo-color-background-feedback-positive` |
| Generic step fill | `--duo-color-background-feedback-neutral` |
| Swimlane A | `--duo-color-surface` |
| Swimlane B | `--duo-color-surface-raised` |
| Shape text | `--duo-color-text` |
| Strong labels | `--duo-color-text-strong` |
| Shape stroke | `--duo-color-border` |
| Connector | `--duo-color-border-strong` |
| Canvas/flow section | `--duo-color-background` |

If the source is temporarily unavailable, use this fallback snapshot from `@duo/tokens` 1.0.1:

| Token | Fallback |
| --- | --- |
| `--duo-color-background-feedback-highlight` | `#DEDFFF` |
| `--duo-color-background-feedback-informative` | `#CEE3FE` |
| `--duo-color-background-feedback-warning` | `#FAE08A` |
| `--duo-color-background-feedback-positive` | `#D7E7CE` |
| `--duo-color-background-feedback-neutral` | `#E2E2E2` |
| `--duo-color-surface` | `#FCFCFC` |
| `--duo-color-surface-raised` | `#F6F6F6` |
| `--duo-color-text` | `#292929` |
| `--duo-color-text-strong` | `#232323` |
| `--duo-color-border` | `#D3D3D3` |
| `--duo-color-border-strong` | `#898989` |
| `--duo-color-background` | `#FFFFFF` |

Do not substitute FigJam palette approximations when current Duo values are available.

## Dimensions and spacing

Treat these as starting points, then resize to fit content:

| Element | Suggested size |
| --- | --- |
| Start/end | 240 × 104 px |
| Action/process | 280 × 120 px |
| Decision | 190 × 190 px |
| Input/output | 280 × 120 px |
| Generic step | 280 × 120 px |
| Horizontal node gap | 140–200 px |
| Vertical branch gap | 120–180 px |
| Swimlane label width | 220 px |
| Swimlane internal padding | 80 px |

Keep node padding comfortable and allow text to wrap to two or three short lines. Increase node width before reducing text size.

## Swimlanes

- Use horizontal bands with actor names at the left.
- Keep the time axis left to right across every lane.
- Alternate only the two Duo surface colours for lane backgrounds.
- Place each action in the lane of the actor that performs it.
- Allow connectors to cross lane boundaries when responsibility changes.
- Avoid a separate lane for an actor with no actions; represent external inputs or outputs with the semantic input/output shape instead.

## Connector rules

- Connect from the right side of a node to the left side of the next node on the main path.
- Use an end arrow only; avoid arrows on both ends.
- Put branch labels near the decision node, not midway along a long connector.
- Use `Yes`/`No` only when the decision is truly binary. Otherwise use outcome labels that explain the branch.
- Use loops only when the process actually repeats. Route loops below the main path and label the return condition.
- Reposition nodes to remove crossings before introducing connector bends.

## Naming and layer hygiene

Name nodes by semantic role and sequence, for example:

- `flow/start`
- `flow/action/03-review-application`
- `flow/decision/04-requirements-met`
- `flow/input/02-job-requirements`
- `flow/connector/04-no`
- `flow/lane/recruiter`

Keep names stable during cleanup so later edits can locate the standardised nodes reliably.
