---
title: Blameless Postmortem Template
description: Postmortem template for incidents at Talentech.
owner: sre
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Postmortems are blameless. The goal is to improve the system and its
signals, not to judge individuals. Write as if the reader is a new engineer
three years from now trying to understand what our failure modes look like.

Copy to `postmortems/YYYY-MM-DD-<slug>.md`.

---

# Postmortem: <Incident Title>

- **Incident ID:** INC-<id>
- **Date:** <YYYY-MM-DD>
- **Severity:** SEV1 | SEV2 | SEV3
- **Duration (impact window):** <start time> → <end time> (<duration>)
- **Authors:** <names>
- **Incident commander:** <name>
- **Status:** Draft | Published

## Incident summary

_Two to four sentences. What happened, who was affected, how long did it
last, how was it mitigated. No jargon._

## Impact

_Quantify where possible._

- **Users affected:** <count or segment>.
- **Customers affected:** <named if key accounts>.
- **Requests / transactions affected:** <count>.
- **Data integrity impact:** <none | bounded loss | ongoing inconsistency>.
- **Revenue / SLA impact:** <estimate or N/A>.
- **Compliance reporting required:** <yes / no, with DPO/legal sign-off>.

## Timeline

_All times in UTC. One row per observable event: alert, human action, state
change. Do not sanitize — include the false leads._

| Time (UTC) | Event                           |
| ---------- | ------------------------------- |
| HH:MM      | <event>                         |
| HH:MM      | <event>                         |
| HH:MM      | Incident declared, IC assigned. |
| HH:MM      | Mitigation deployed.            |
| HH:MM      | Impact ceases.                  |
| HH:MM      | Resolution declared.            |

## Detection

_How did we find out? Alert name, monitor, customer report? How long between
impact start and detection?_

## Response

_What did we do, in what order, why? Note decisions that worked, decisions
that did not, and tools that were missing._

## Root cause

_The technical cause. Dig past "a bug" — explain the chain: change that
introduced it, gap in tests, gap in monitoring, unsafe default, etc._

## Contributing factors

_Everything that made the incident worse, longer, or harder to handle._

- <factor>
- <factor>

## What went well

_Called out explicitly. Good signals, fast detection, clean rollback,
useful playbook._

- <thing>
- <thing>

## What went poorly

_Without blaming people. Systems, signals, missing guardrails._

- <thing>
- <thing>

## Where we got lucky

_Things that did NOT go wrong, but easily could have. These often point to
the highest-value action items._

- <thing>

## Action items

Each action has an owner and a due date. Tag in ADO with `oncall`.

| ID   | Action   | Owner  | Priority | Due        | ADO     |
| ---- | -------- | ------ | -------- | ---------- | ------- |
| AI-1 | <action> | <name> | P0/P1/P2 | YYYY-MM-DD | AB#<id> |
| AI-2 | <action> | <name> | P0/P1/P2 | YYYY-MM-DD | AB#<id> |

## Appendix

_Dashboards, graphs, relevant log excerpts, links to the incident channel
archive._
