---
name: figjam-flow
description: Create, rebuild, or standardise editable flows in FigJam using formal flowchart conventions, horizontal layouts, swimlanes, and Talentech Duo colours. Use for FigJam user flows, user journeys, application flows, process flows, decision flows, or requests to clean up an existing FigJam diagram. Use only for FigJam board URLs (`figma.com/board/...`), not Figma Design files, slides, or static diagram exports.
---

# Design – FigJam Flow Builder

Create clear, formal flows from written context or standardise existing FigJam flows without flattening them. Keep every meaningful item editable as a native FigJam node.

## Required Figma workflow

1. Load the `figma-use` and `figma-use-figjam` skills before every `use_figma` call.
2. Use `get_figjam` before changing an existing board. Use `get_screenshot` after obtaining a valid node ID when visual inspection is needed.
3. Prefer `use_figma` with native `ShapeWithText`, `Connector`, `Section`, and `Text` nodes. Do not use images, screenshots, flattened SVGs, or decorative illustrations for flow content.
4. Work incrementally and return every created or mutated node ID from each write.
5. Validate the result visually and structurally after creation or cleanup.

If no target FigJam board exists, load `figma-create-new-file` before calling `create_new_file`. Use `generate_diagram` only when a simple generic diagram is enough and its output can meet every requirement; load `figma-generate-diagram` before calling it. Use `use_figma` for semantic user-flow shapes, swimlanes, Duo colours, exact positioning, or cleanup of existing nodes.

## Choose the flow standard

Classify the request before drawing:

- **User flow, user journey, application flow:** use the fixed semantic shape system in [references/flow-standard.md](references/flow-standard.md).
- **Generic flow or process:** use rectangles for every step. Use arrows and branch labels to carry meaning; do not introduce semantic shapes unless the user asks.
- **Unclear type:** infer from the content. If the choice materially changes the output, ask one focused question.

If the user requests a journey map with stages, emotions, pain points, or opportunities rather than a navigational flow, clarify the intended format before drawing.

## Plan before drawing

Extract or confirm:

- Flow title and purpose
- Start and end states
- Ordered main path
- Decisions and labelled outcomes
- Inputs and outputs
- Actors or systems responsible for each step
- Exceptions, loops, and unresolved gaps

Do not invent missing steps, actors, or decision outcomes. Ask only for information that would materially change the flow; otherwise mark a gap clearly.

## Create a new flow

1. Fetch the current Duo token source as described in the reference and resolve the required colours to hex/RGB for FigJam.
2. Create a visible title above the flow. Add a short subtitle only when it supplies necessary scope or context.
3. Lay out the main path left to right.
4. Place secondary decision branches vertically, normally below the main path, and reconnect them cleanly when required.
5. When two or more actors participate, create horizontal swimlanes: one actor per row, actor labels fixed on the left, and time progressing left to right.
6. Create native connectors with end arrows. Label decisions directly on outgoing connectors, such as `Yes` and `No`.
7. Add a compact legend only when optional or non-obvious shapes are used.
8. Place the complete flow in a section so it can be moved as one unit while all contained nodes remain editable.

## Standardise an existing flow

1. Inspect the full node tree with `get_figjam`, then inspect the relevant section visually.
2. Identify the main path, decisions, branch labels, actors, and current reading direction.
3. Preserve the original wording, logic, sequence, and ownership unless the user explicitly asks for content editing.
4. If the user has not said whether to replace the original, ask whether to update it in place or create a standardised copy beside it.
5. Convert nodes to the chosen standard, align them to a shared grid, normalise sizes, apply Duo colours, and replace improvised lines with native connectors.
6. Remove decorative elements only when they do not carry information. Preserve notes, warnings, and evidence; reposition them outside the primary path.
7. Verify that every original branch and terminal state still exists in the standardised result.

## Layout rules

- Prefer a single horizontal mainline.
- Keep no more than five nodes in one tight horizontal cluster; continue with generous spacing or grouped phases rather than compressing content.
- Use consistent node dimensions by semantic type.
- Keep branch lines short and avoid crossings. Reposition nodes before accepting crossed connectors.
- Use orthogonal/elbow connectors for formal flows unless a straight connector is clearly cleaner.
- Keep text concise and action-led. Use sentence case.
- Use Inter and Duo text colours.
- Use colour only to communicate node meaning, status, or ownership. Do not add gradients, shadows, icons, emojis, background patterns, or ornamental shapes.
- Prefer whitespace over containers. Use sections for swimlanes, phases, or a movable flow boundary, not as decoration.

## Quality check

Before finishing, confirm:

- The flow is native and editable in FigJam.
- The reading direction is obvious at overview zoom.
- The main path runs left to right.
- Shape meaning follows the selected standard.
- Swimlanes correctly represent actor ownership.
- Every decision branch is labelled.
- All connectors terminate on the intended node and have consistent arrows.
- No nodes, labels, or connectors overlap.
- Text fits inside every shape.
- Duo colours match the current token source or the documented fallback.
- Decoration is minimal and every visual element carries information.

Report what was created or standardised, note any assumptions or unresolved gaps, and provide the FigJam link.
