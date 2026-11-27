# Management deck outline (large cases)

Eight slides, generated from the case so the numbers cannot drift from what the steering group reviewed. The audience is the management team in a live meeting with the pre-read already sent, so each slide carries one message and few words. Prepared objections go in speaker notes, not on slides.

| Slide | Title pattern | Content | From case section |
| --- | --- | --- | --- |
| 1 | <Initiative>: <the ask in six words> | Title, the one-line ask, owner, date | 1 |
| 2 | What we propose and why now | Three short blocks: what (solution in one sentence), why now (window), what we need (team, months, decision) | 1, 2 |
| 3 | The problem is real: <strongest evidence number> | Two or three large numbers from the evidence (survey %, lost deals, precedent adoption), each with its source line | 2, 5 |
| 4 | What we build first | MVP scope as a short list, with "later" and "never" columns smaller beside it | 3 |
| 5 | Value: <base 12-month figure> growing to <base 36-month figure> | Table or bar pair: low / base / high at 12 and 36 months; the formula in one line under it with each factor named | 4 |
| 6 | Cost and payback | Build cost with the role split, yearly cost after launch, payback months; team names | 7 |
| 7 | Risks, kill criteria and gates | Risk table (type, risk, kill criterion) and the staged plan as a timeline with gates marked | 8 |
| 8 | The decision | Success metric, target and review date; the decision requested in one sentence | 9, 1 |

## Design notes

- One message per slide; the title states the message, not the topic ("Value: €0.4M in year 1 growing to €4M by year 3", not "Business case").
- Numbers on slides are the card's numbers. Do not round differently on the slide than on the card.
- Slide 3 is the only slide with large stat callouts; slide 5 the only chart; slide 7 the only timeline. The rest are short text blocks.
- Keep the look of the company's existing pitch decks if a template is provided; otherwise a plain, light theme with one accent colour.
- Speaker notes: slide 5 gets the assumptions and their sources; slide 7 gets the prepared objections from the challenge pass (question, answer); slide 8 gets the fallback if the answer is no (what is lost, what is kept).

## Company template

Always build the deck on `assets/talentech-template.potx` (Talentech Templates, Standard Set 2025: 13.33 × 7.5 in, 42 layouts, one master). The template carries the fonts, colours and the Talentech footer, so a case deck looks like every other Talentech deck and the management team reads content, not styling. Do not design a theme of your own.

Two ways to build on it, in order of preference:

1. **Script (deterministic).** Fill `examples/background-checks-deck-spec.json` with the case's content (same keys, the case's text and numbers) and run `python scripts/build_deck.py spec.json out.pptx`. The script picks the layouts below, fills their placeholders, inserts the native chart and tables, draws the timeline and writes the speaker notes. Needs python-pptx. Then render and look at every slide: a long title wraps into the content, and a long bullet list runs over the footer, so shorten text rather than shrink it.
2. **By hand (when the script cannot run).** Copy the .potx to a .pptx name, follow the pptx skill's template workflow (thumbnail the layouts, duplicate the layouts below with `add_slide.py`, fill the placeholders by index) and keep the same layout mapping so decks look alike.

Layout mapping (layout number in the template's layout list, placeholder indexes in brackets):

| Slide | Layout | How it is used |
| --- | --- | --- |
| 1 Title | 3 "Title Slide, Dark Theme Centered" | title [0], subtitle + byline [1] |
| 2 Propose | 25 "Title & Paragraphs only, Dark" | title [0]; bottom paragraphs removed; three white rounded cards added for What / Why now / What we need |
| 3 Evidence | 36 "Title & Box Grid, Focus Areas x3" | title [0], source line [14], big numbers in the box headers [18, 19, 20], labels in the box bodies [15, 16, 17] |
| 4 Scope | 20 "Title & Bullets only, Light" | title [0]; two bullet columns [14, 15] moved up to 2.5 in; headers MVP / Maybe later / Probably never without bullets |
| 5 Value | 42 "Charts, Title and Content, with insights" | title [0], subtitle [14], native clustered column chart in [15] (Low / Base / High), formula header [23], formula bullets [17], footnote [16] |
| 6 Cost | 23 "Title & Paragraphs only, Light" | title [0]; role table and three stat cards added; Team in [16], Estimate in [17] |
| 7 Risks | 25 "Title & Paragraphs only, Dark" | title [0]; bottom paragraphs removed; risk table (header in accent 1) and a milestone timeline with the gate as a red diamond |
| 8 Decision | 19 "Quote/Testimonial, Big Paragraph" | kicker "The decision" [1], the ask as the big paragraph [0], success metric and fallback as a small text block below |

Fonts: the template's text styles use the Season Sans family ("Season Sans-TRIAL"); on a machine without it PowerPoint substitutes, which is the company template's choice, not the skill's. Chart series use the theme's accent 1, accent 2 and text colour; the gate marker uses accent 4.

## Tooling without the template

Only when the template file is unavailable (for example a chat without file access): use whatever slide tool or skill exists (a Slides artifact type, the pptx skill) with this outline and a plain light theme, and say in the reply that the deck is not on the company template. If no slide tool exists at all, write the deck as text: one block per slide with the title, the body and the speaker notes, so the PM can build it in PowerPoint in ten minutes.
