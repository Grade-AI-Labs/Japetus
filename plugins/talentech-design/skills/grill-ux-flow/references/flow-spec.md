# Flow spec template

Write every section. If one has no answer, write `Open — <reason>` or `N/A — <reason>`. The first sections follow figjam-flow's "Plan before drawing" list, so the confirmed spec can be drawn as it is.

```markdown
# Flow: <title>

**Purpose:** <the user goal this flow serves>
**Product:** <Reachmee | Talentrecruiter | Webcruiter | Varbi | …>

## Start and end states
- Start: <entry point or trigger>
- End: <success> / <cancel> / <failure>

## Actors and systems
- <actor or system> — <what it is responsible for>

## Main path
1. <step> — <actor> — in: <input> — out: <output>

## Decisions
- At step <n>: <question> → <outcome label> (go to <step>) / <outcome label> (go to <step>)

## Exceptions and loops
- <exception or loop> — <where it starts> — <where it returns or ends>

## Step states
| Step | Error | Empty | Loading | Permission |
| --- | --- | --- | --- | --- |

## Edge cases
- <case> — <expected behaviour>

## Duo components
- Step <n>: <components>; <new component or pattern needed, if any>

## Accessibility
## Localisation
<markets, languages, market-specific steps or rules>

## Constraints
<product, GDPR and consent, EU AI Act transparency>

## Gaps and open questions
- <topic> — <reason> — <who could answer>
```
