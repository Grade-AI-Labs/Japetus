# 20 — Staleness dashboard + ownership labels

## Parent PRD

[plans/prds/MCP.md](../prds/MCP.md)

## Type

AFK

## What to build

Surface resource ownership and age so content owners have a feedback loop on freshness. This is the risk-mitigation slice for PRD §9: "Content owners don't keep conventions current → agents quote stale guidance."

Build on top of the ownership labels set per resource in slice 09 and the `lastModified` metadata delivered in slice 07. Ties to PRD §8 success metric: "Content freshness — median age of most-read resources; target < 90 days."

## Acceptance criteria

- [ ] Every resource's ownership label is surfaced in resource metadata.
- [ ] Dashboard shows per-resource: URI, owner, `lastModified`, read count (last N days), staleness flag.
- [ ] Staleness threshold configurable (default 90 days per PRD §8).
- [ ] Dashboard filterable by owner/team so owners can see their own surface.
- [ ] Quarterly review cadence documented per PRD §9 risk mitigation.
- [ ] Read counts feed from the audit log (slice 08) — no additional tracking needed.

## Blocked by

- Blocked by [07-caching.md](07-caching.md)
- Blocked by [09-seed-corpus.md](09-seed-corpus.md)

## User stories addressed

- PRD §8 (Success metrics — content freshness).
- PRD §9 (Risks and mitigations — stale guidance).
