---
title: Dependency Policy
description: Rules for adding, updating, and auditing third-party dependencies.
owner: security
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Third-party code runs with your process privileges. Treat dependency changes
as code changes.

## Adding a new top-level dependency

- Open an ADR (or short justification in the PR) covering:
  - Why this library and not an existing one we already use.
  - License (must be MIT, Apache-2.0, BSD, or ISC; other licenses need
    legal review).
  - Maintenance signals: last release, open issues, number of maintainers.
  - Bundle / install size impact.
- Get approval from a second reviewer on the team and `@platform-eng` for
  shared libraries.
- Transitive deps do not need explicit approval, but CI will flag new license
  or vulnerability findings.

## Pinning

- Pin **major** versions in manifest files. Allow patch and minor to float
  within a major range.
- Lockfiles are committed and authoritative: `package-lock.json`, `uv.lock`,
  `poetry.lock`, etc.
- Do not hand-edit lockfiles. Regenerate with the tool.

## Updates

- Renovate runs weekly. It opens PRs grouped by ecosystem.
- Security advisories trigger out-of-band PRs within 24 hours.
- Minor/patch auto-merge is enabled for green-CI PRs on dev-dependencies only.
- Major version bumps are always human-reviewed.

## Scanning in CI

Every CI run executes:

- **Advisory scan** — `npm audit`, `pip-audit`, `osv-scanner`. Fails on
  HIGH or CRITICAL unless an exception is filed.
- **License check** — fails on a non-allowlisted license.
- **SBOM generation** — produced on every release build, stored with the
  release artifact (CycloneDX format).

## Exceptions

- File an exception in `security/advisory-exceptions.yaml` with:
  - Advisory ID.
  - Reason it does not apply (code path not used, mitigation in place).
  - Expiry date (max 90 days).
- Exceptions without an expiry are automatically rejected by CI.

## Removing dependencies

- Prefer removing over updating when a dep is unused or has a thin surface.
- When a dep is deprecated upstream, open a work item to replace it and tag
  it for the next quarter.

## Vendoring

- Do not vendor third-party code to avoid the policy. If vendoring is
  necessary (patch unmerged upstream), open an ADR and track upstream progress.
