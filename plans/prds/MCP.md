# PRD: `talentech-standards` — Org-wide MCP server for coding agents

**Status:** Draft
**Author:** Olof (Talentech)
**Last updated:** 2026-04-22
**Target release:** MVP in one quarter; see Rollout

---

## 1. Summary

`talentech-standards` is a remote MCP server that surfaces Talentech's coding standards, runbooks, templates, and service ownership to any MCP-capable coding agent (Claude Code, Cursor, VS Code/Copilot Chat, etc.). It authenticates developers via Microsoft Entra and projects curated content from the org's knowledge sources — Confluence at launch, pluggable by design — through stable, cache-friendly MCP primitives: resources for reference material, tools for search and lookup, prompts for canonical workflows.

The goal is one place for "how we build software at Talentech" that every AI tool can reach, without asking every developer to copy-paste conventions into every repo or chat.

---

## 2. Problem

Coding agents today get context from two places: files in the repo (`AGENTS.md`, `CLAUDE.md`, skill folders) and whatever the developer pastes into the prompt. Neither works well for organization-wide standards:

- **Static repo files drift.** A PR convention copied into 40 repos ages at 40 different rates. When we update it centrally, the repos don't know.
- **Canonical docs live behind auth.** Our coding conventions, PR checklists, incident runbooks, and service catalog sit in Confluence behind Entra SSO. Agents can't reach them directly.
- **Mimas solves distribution, not surfacing.** The skills repo (github.com/Talentech-AI-Labs/Mimas) is good at shipping skills that travel with code; it's the wrong layer for content that changes weekly and needs live auth.
- **Per-tool configuration doesn't compose.** `AGENTS.md`, `.cursor/rules`, `.github/copilot-instructions.md` — each tool has its own way. Every new standard becomes three PRs across every repo.

Result: agents give outdated advice, conventions are inconsistently applied in generated code, and maintainers spend time on copy-paste work that should be one source of truth.

## 3. Goals and non-goals

### Goals

- Single, authenticated surface for org-wide coding standards accessible from any MCP-capable agent.
- Curated, opinionated content — not a generic KB search API.
- Low latency and cache-friendly (ETags, resource hints) so agents can pull conventions on every relevant turn without tax.
- Entra SSO on the server; token-scoped access per content area.
- Complements Mimas (static, repo-bundled) rather than replacing it.
- Works today with Claude Code and Cursor; degrades gracefully for Copilot.

### Non-goals (MVP)

- Writing back to Confluence or any system of record.
- Replacing CODEOWNERS, the service catalog, or Confluence itself.
- Arbitrary search over the whole upstream KB — only curated spaces.
- Per-repo or per-project conventions (those stay in `AGENTS.md`/Mimas).
- Supporting Copilot's inline completion path (MCP is not consumed there).

---

## 4. Users and use cases

**Primary users:** engineers at Talentech using AI coding tools on a daily basis.

**Secondary users:** platform/DX team (content owners), security/compliance (policy owners), tech leads (contribute conventions).

Representative use cases the MVP must handle well:

1. *"Write a PR description for this change."* Agent invokes the `review_pr` or `write_pr_description` prompt, which pulls `conventions://prs/description-template` and `conventions://prs/review-checklist`, producing output aligned with our template.
2. *"Add a new Python module here."* Agent consults `conventions://python/style` before generating code, so imports, typing, and error handling match house style.
3. *"Who owns `talentech-ats-core`?"* Agent calls `who_owns` and returns team, Slack channel, on-call contact.
4. *"Draft a PRD for feature X."* Agent invokes the `write_prd` prompt, replacing today's `write-a-prd-irecommend` skill with server-provided templates plus ticketing config.
5. *"What's the latest guidance on handling candidate PII?"* Agent calls `search_standards("PII candidate data")`, finds `conventions://compliance/gdpr-pii-handling`, and cites the current version.

---

## 5. Solution overview

Three layers, each with a clear job:

| Layer | Purpose | Distribution | Lifecycle |
|---|---|---|---|
| **Repo (`AGENTS.md`, skills)** | Repo-specific conventions, per-project tooling | Mimas, git | Changes with the code |
| **`talentech-standards` (MCP)** | Org-wide standards, curated docs, catalog | Remote MCP server | Changes weekly; server returns current |
| **Upstream KB / ADO / catalog** | Systems of record (Confluence at launch) | As today | Owned by content authors |

The MCP server is a thin, opinionated surface. It does not store standards — it curates and projects them from existing systems of record through a stable, agent-friendly API.

**High-level architecture.**

```
Agent (Claude Code, Cursor, …)
        │  Streamable HTTP, MCP
        ▼
┌────────────────────────────┐
│  talentech-standards server    │◀── Entra OAuth 2.1 (per-user token)
│   ├── Resources            │
│   ├── Tools                │
│   ├── Prompts              │
│   └── Source adapters      │
└──────────┬─────────────────┘
           │
   ┌───────┼────────┬──────────────┐
   ▼       ▼        ▼              ▼
 Confluence  Git   Service      Search index
 (launch)  (later) catalog      (semantic, over
                   (read-only)   curated corpus)
```

---

## 6. Detailed design

### 6.1 URI scheme

Namespaces carry meaning; agents can reason about what they're attaching.

```
conventions://<domain>/<slug>            # durable, opinionated standards
runbooks://<slug>                        # operational procedures
templates://<slug>                       # PRD/RFC/ADR skeletons
catalog://services/<service-name>        # ownership, on-call, repo links
docs://<space>/<slug>                    # curated passthrough to the upstream KB
```

URIs are **unversioned and source-agnostic**. `conventions://python/style` always points at current; agents never encode the backing system in their references. If the content later moves from Confluence to a git-backed mirror or another KB, the URI is stable. History lives upstream; `supersedes` metadata handles redirects.

### 6.2 Resources

Resources are the preferred surface. They're addressable, cacheable, and the client can auto-attach them based on `annotations.priority`.

Resource metadata shape:

```jsonc
{
  "uri": "conventions://python/style",
  "name": "Python style guide",
  "description": "Talentech Python conventions: formatting, typing, imports, error handling. Supersedes PEP 8 where they conflict.",
  "mimeType": "text/markdown",
  "annotations": {
    "audience": ["assistant"],
    "priority": 0.9,
    "lastModified": "2026-04-15T09:12:00Z"
  }
}
```

**MVP corpus (seed).** Exact slugs TBD with content owners.

- Conventions: `python/style`, `typescript/style`, `react/component-patterns`, `git/commit-messages`, `git/branch-naming`, `prs/review-checklist`, `prs/description-template`, `security/secrets-handling`, `security/dependency-policy`, `testing/unit`, `testing/integration`, `ado/work-item-conventions`, `accessibility/wcag-baseline`, `compliance/gdpr-pii-handling`
- Runbooks: `incident-response`, `deploy/production`, `rotate-secrets`
- Templates: `prd`, `rfc`, `adr`, `postmortem`

Descriptions are load-bearing. Write them like tool descriptions — what it covers, when to use it, what it supersedes — because that's what drives the agent's fetch decisions.

### 6.3 Tools

Small surface on purpose. Every tool is a latency cost and a decision the model has to make.

| Tool | Purpose |
|---|---|
| `search_standards({ query, scope?, limit? })` | Semantic search over the curated corpus. Returns URIs and snippets, not full content. |
| `get_resource({ uri })` | Tool-shaped alias for `resources/read`; some clients prefer it. Returns content + `etag`. |
| `search_docs({ space, query, limit? })` | Search pre-approved KB spaces only. `space` is an opaque enum (`ENG`, `PRODUCT`, `SEC`) that maps to whatever the current source uses; agents never see the backend. |
| `who_owns({ path })` | Resolve path/service/package to `{ team, primary_contact, slack_channel, repos[] }`. |
| `current_standard({ topic })` | Resolve "the canonical doc for X right now." Handles redirects when standards move or merge. |

**Explicitly deferred.** Generic `fetch_url(any_url)` (kills curation regardless of backend). Any write tool (scope creep, auth complexity, easy to do badly). Per-repo lookups (belongs in the repo).

### 6.4 Prompts

Prompts are how we replace today's `write-a-prd-irecommend` skill with something server-provided and centrally versioned. Prompts compose with resources — the prompt body embeds resource URIs that the client resolves at invocation time, so every call gets current templates.

| Prompt | Arguments |
|---|---|
| `write_prd` | `topic`, `product?` (Varbi/ReachMee/Jobtip/Talmund), `ticketing?` |
| `review_pr` | `pr_url`, `focus?` (security/performance/accessibility/all) |
| `write_rfc` | `topic` |
| `write_adr` | `decision`, `context?` |
| `incident_postmortem` | `incident_id` |
| `onboard_repo` | `repo_url` — generates an `AGENTS.md` draft from repo inspection + org defaults |

### 6.5 Source adapters

The server is deliberately agnostic about where content comes from. Every external content source — Confluence today; potentially Notion, a git-backed mirror, or an internal CMS tomorrow — plugs in through a small adapter interface. The agent-facing surface (URIs, tools, prompts) doesn't change when a source is swapped or added.

**Adapter contract (minimal):**

```ts
interface SourceAdapter {
  id: string;                                  // "confluence", "git", "notion"
  list(scope?: string): Promise<ResourceHandle[]>;
  fetch(id: string): Promise<{ content: string; etag: string; updated: string }>;
  search(query: string, scope?: string): Promise<SearchHit[]>;
  onChange?(cb: (handle: ResourceHandle) => void): Unsubscribe;   // webhook or poll
}
```

Each adapter normalizes on the way out: content is rendered to markdown, and the `space` enum agents see (`ENG`, `PRODUCT`, `SEC`) is mapped from the backend's native grouping (Confluence space key, Notion database ID, git directory).

**Resource routing.** Each URI resolves through a small registry that maps slug → `(adapter_id, backing_id)`. Migrating a single resource from Confluence to git is a registry change; the URI and every consumer stay the same.

```
Agent call ──▶ Resource layer ──▶ Registry lookup
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │  Source adapter API  │
                           └──────────────────────┘
                             │         │        │
                             ▼         ▼        ▼
                        Confluence   Git     Notion
                        (launch)   (later)  (maybe)
```

**Per-source concerns that stay inside the adapter:**

- Auth plumbing (Confluence service principal at launch; different adapters bring their own credentials).
- Content-format translation (Confluence storage format → markdown; Notion blocks → markdown; git markdown passthrough).
- Change-notification mechanism (webhook vs. poll vs. post-receive hook).

**What adapters buy us:**

- Open question #2 (Confluence direct vs. git-backed mirror) stops being an MVP blocker — ship with the Confluence adapter, add a git adapter later, migrate resources one at a time.
- Multiple adapters in parallel during migration is a config change, not a branch.
- Integration tests use a filesystem adapter, keeping CI off Confluence entirely.

### 6.6 Authentication and authorization

- **Transport:** Streamable HTTP.
- **Server auth:** OAuth 2.1 with Entra as the upstream IdP. Claude Code and Cursor handle the browser-based consent flow natively.
- **Source-adapter auth:** Each adapter manages its own upstream credentials. The launch Confluence adapter uses a service principal with read access to curated spaces only — chosen over on-behalf-of because org standards should be uniformly visible to all authenticated employees; per-user Atlassian tokens add complexity without benefit at this layer. New adapters bring their own auth model without affecting the agent-facing surface.
- **Catalog auth:** Server-to-server, read-only.
- **Scopes on the MCP token:** `standards:read`, `kb:read:<space>`, `catalog:read`. Scope names are backend-neutral, so swapping sources doesn't require reissuing tokens. Enables narrower tokens for CI jobs than for humans.
- **Audit logging:** Every tool call and resource read logged with user, URI, and timestamp. Retention per existing policy.

### 6.7 Caching and change notification

- Return `etag` and `lastModified` on every resource read. Clients cache aggressively.
- Implement `notifications/resources/list_changed` when the curated corpus is updated. Each adapter emits change events however it can (Confluence webhook, git post-receive hook, poll).
- Server-side cache of rendered resources with a short TTL (e.g. 5 min) and ETag revalidation upstream.

### 6.8 Error shape

Use MCP error codes meaningfully:

- `-32002` — resource not found.
- Custom `1001` — authenticated but not entitled to this space/resource.
- Custom `1002` — upstream source unavailable; client should use cached copy if present.

Agents behave very differently for 401 vs 403 vs 404; getting this right is worth the small investment.

### 6.9 Client wiring

- **Claude Code:** native remote MCP support; register `talentech-standards` as a project or user-level server; OAuth on first use.
- **Cursor:** native remote MCP support; similar flow.
- **VS Code Copilot Chat:** MCP supported in agent chat, not in inline completions. Document as partial support; continue to ship static `.github/copilot-instructions.md` via Mimas for the completion path.
- **CI agents:** narrow-scoped client credentials; do not use user OAuth.

---

## 7. Rollout

Phased to de-risk content curation (usually the slowest part) and prove the auth path early.

**Phase 0 — Spike (2 weeks).** Stand up the server skeleton with Entra OAuth, one resource (`conventions://prs/review-checklist`), and `search_standards`. Wire to Claude Code. Validate the end-to-end auth flow and the resource-vs-tool UX on a real task.

**Phase 1 — MVP (6 weeks).** Seed corpus (≈15 resources), full tool set except prompts, Confluence service-principal integration, ETags and cache, basic audit logging. Dogfood within the platform/DX team.

**Phase 2 — GA to engineering (4 weeks).** Add prompts (`write_prd`, `review_pr`, `write_adr`), migrate `write-a-prd-irecommend` to a server-provided prompt, ship docs and onboarding guide, open to all engineers.

**Phase 3 — Expand (ongoing).** Additional resources, `who_owns` backed by real catalog, `onboard_repo` prompt, Copilot Chat validation, CI client-credentials flow.

---

## 8. Success metrics

- **Adoption:** % of engineers with `talentech-standards` registered in at least one agent; target 70% by end of Phase 2.
- **Usage:** resource reads per active developer per week; target ≥ 5.
- **Content freshness:** median age of most-read resources; target < 90 days.
- **Displacement:** reduction in the number of repos shipping full conventions in `AGENTS.md` vs linking to `talentech-standards`. (Proxy for "single source of truth" working.)
- **Quality, qualitative:** quarterly survey — does AI-generated code feel more aligned with house style?

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Content owners don't keep conventions current → agents quote stale guidance. | Ownership labels on every resource; staleness dashboard; quarterly review cadence baked into Phase 2. |
| Latency tax on every turn degrades agent UX. | Aggressive caching; prefer resources over tools; budget every addition against a latency SLO. |
| Curation becomes a bottleneck. | Lightweight contribution flow (PR against a content repo, not a Confluence-only process); delegate slugs to domain owners. |
| Copilot's limited MCP support fragments the experience. | Keep static distribution via Mimas for the completion path; make this an explicit product stance, not an accidental gap. |
| Entra/Atlassian auth regressions block all agents. | Circuit breaker returns cached content with a clear "stale" indicator; monitored on-call alert. |
| Scope creep — every team wants their thing exposed. | Non-goals section above is normative. New surfaces require written justification against the curation principle. |

---

## 10. Open questions

1. Service principal vs. on-behalf-of for Confluence — confirmed service principal is right for MVP; revisit if we ever expose anything with per-user entitlements.
2. Which adapter(s) do we want in production at GA — Confluence only, or Confluence + a git-backed mirror for content that benefits from PR review on changes? The adapter model makes this cheap to defer and migrate piecemeal, but worth getting content owners' input early.
3. Should `write_prd` file the work item itself (via the Azure DevOps MCP server you've already integrated in `setup-mimas-template`), or only produce the text? Leaning "only produce text" for MVP; delegation to ADO MCP is a Phase 3 composition.
4. How do we handle conventions that differ per product (Varbi vs. ReachMee)? Sub-namespaces (`conventions://varbi/...`) or a `product` annotation? Annotations feel cleaner.
5. Telemetry privacy — do we log query strings? Probably yes with retention limits, but confirm with security.

---

## 11. Appendix: relationship to existing work

- **Mimas** continues to own static, repo-bundled skills and per-repo conventions. `talentech-standards` complements it by owning the dynamic, org-wide, authenticated layer. Over time, some Mimas skills (notably `write-a-prd-irecommend`) migrate to server-provided prompts; others (repo-specific tooling) stay where they are.
- **Azure DevOps MCP server** (already integrated via `setup-mimas-template`) remains the execution surface for ticketing. `talentech-standards` prompts can hand off to it rather than duplicating that capability.
- **`AGENTS.md` convention** stays the primary config mechanism inside repos; it can reference `talentech-standards` resources by URI for anything that should be pulled live.