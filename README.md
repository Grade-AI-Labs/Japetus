# Japetus

A Claude Code plugin marketplace, `talentech`, with skills, agents and MCP
servers for Talentech: engineering, design, product and research.

| Plugin | What it does |
| --- | --- |
| [`dev-workflow`](./plugins/dev-workflow) | Matt Pocock's promoted skills with Mimas's `setup-agentic-repository` and review skills in place of his setup, plus tiered worker agents and a `/orchestrate-spec` orchestrator that tiers each ticket by model and effort and reviews every result before merging. |
| [`dev-progress`](./plugins/dev-progress) | Mod: a progress bar above the prompt and a live agents panel that `/orchestrate-spec` and its agents report to, drawn as crabs or, with `icons: jdm`, JDM cars. Forked from [savvy-progress](https://github.com/JohnnyVizz/claude-kit/tree/main/plugins/savvy-progress). |
| [`crowdin-mcp`](./plugins/crowdin-mcp) | MCP: Crowdin's hosted MCP server, for projects, strings, translations, glossaries and QA checks. |
| [`productboard-mcp`](./plugins/productboard-mcp) | MCP: Productboard's hosted MCP server, for documents, features, initiatives, feedback and change history. |
| [`talentech-core`](./plugins/talentech-core) | Company-wide skills: the `grilling` interview that role plugins wrap, `grill-me`, `handoff`, `to-questionnaire`, `teach`, `wait-what`, and publishing to and pulling from Confluence (Atlassian connector). |
| [`talentech-design`](./plugins/talentech-design) | Product Design: briefs, design readiness, `grill-ux-flow`, FigJam flows, wireframes, handoff pages, UX content and translation. Depends on `talentech-core`. |
| [`talentech-product`](./plugins/talentech-product) | Product Management: `grill-prd`, from a raw problem to a developer-ready PRD. Depends on `talentech-core`. |
| [`talentech-research`](./plugins/talentech-research) | UX research for design and product: plans, methods, interviews, surveys, synthesis, ethics and share-outs. |

## Install

```
/plugin marketplace add Grade-AI-Labs/Japetus
/plugin install <plugin>@talentech
```

The repository, [Grade-AI-Labs/Japetus](https://github.com/Grade-AI-Labs/Japetus),
is private, so Claude Code clones it with your own git credentials. You need read
access to it, and `git clone https://github.com/Grade-AI-Labs/Japetus.git` must
work from your terminal first.

The MCP plugins hold no credentials. After installing one, run `/mcp` and sign
in with your own account; your workspace or site admin may have to approve the
integration first.

## Core and role plugins

`talentech-core` holds the skills every department uses, and holds them once. The role plugins (`dev-workflow`, `talentech-product`, `talentech-design`) depend on it, and Claude Code installs it with them. A role plugin adds small **wrapper** skills on top of core's: `talentech-product:grill-prd` runs `talentech-core:grilling` with a PRD checklist, Talentech product context and a PRD template. So the _how_ of an interview is kept in core, and each department owns the _what_. See [Writing a wrapper skill](./plugins/talentech-core/README.md#writing-a-wrapper-skill).

### Moved skills

These skills moved, with no alias left under the old name. Type the new command:

| Old | New |
| --- | --- |
| `/dev-workflow:grilling` | `/talentech-core:grilling` |
| `/dev-workflow:grill-me` | `/talentech-core:grill-me` |
| `/dev-workflow:handoff` | `/talentech-core:handoff` |
| `/dev-workflow:to-questionnaire` | `/talentech-core:to-questionnaire` |
| `/dev-workflow:teach` | `/talentech-core:teach` |
| `/dev-workflow:wait-what` | `/talentech-core:wait-what` |
| `/talentech-product:problem-to-prd` | `/talentech-product:grill-prd` |

Skills or tools of your own that call `dev-workflow:grilling` by name must call `talentech-core:grilling` instead.

### Updating to a version with a new dependency

Installing a plugin installs its dependencies too. When you update a plugin that has gained a dependency (`dev-workflow` and `talentech-design` now depend on `talentech-core`), Claude Code v2.1.319 or later installs it with the update, from `claude plugin update`, **Update now** in `/plugin`, or auto-update. On an older version, or if `talentech-core` is still missing, update by hand:

```sh
claude plugin update dev-workflow@talentech     # in a shell
/reload-plugins                                 # then in an open session
```

or install it directly with `/plugin install talentech-core@talentech`.

## Install for everyone in a repo

To offer the plugins to everyone working in a repo, add this to that repo's
`.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "talentech": {
      "source": {
        "source": "github",
        "repo": "Grade-AI-Labs/Japetus"
      }
    }
  },
  "enabledPlugins": {
    "talentech-core@talentech": true,
    "dev-workflow@talentech": true,
    "dev-progress@talentech": true
  }
}
```

### Design, product and research plugins

`talentech-core`, `talentech-design`, `talentech-product` and `talentech-research` were moved here from the
`talentech-skills` marketplace. If you still have those installed, or standalone copies of the same skills in
`~/.claude/skills`, remove them so each skill loads once. Their plugin names keep the `talentech-` prefix so
they do not clash with other marketplaces' plugins (Anthropic ships a plugin called `design`).

## Relation to Mimas

The plugins were copied from the `mimas` marketplace in
[Grade-AI-Labs/Mimas](https://github.com/Grade-AI-Labs/Mimas). If you have
installed them from `mimas` too, uninstall those copies
(`/plugin uninstall dev-workflow@mimas` and so on) so each plugin loads once.

`dev-workflow` ships its own copies of `setup-agentic-repository`,
`review-policy-builder`, `review-policy-rule-builder` and `agentic-review`,
adapted to Matt's layout (`docs/agents/`, `GLOSSARY.md`, `docs/adr/`,
`CODING_STANDARDS.md`). The standalone originals, which keep the Mimas
`agents-docs/` + `CONTEXT.md` layout, stay in
[Mimas `skills/`](https://github.com/Grade-AI-Labs/Mimas/tree/master/skills).
Plugin skills are namespaced (`/dev-workflow:to-spec`), but if you also install
the standalone Mimas skills, both versions of the model-invoked ones can
trigger.

### Upstream

`plugins/dev-workflow/skills/` is a fork of Matt's promoted skills at the
commit in `plugins/dev-workflow/UPSTREAM`. It is not synced automatically;
bring upstream changes over by hand. Changes to Matt's
`setup-matt-pocock-skills` templates belong in
`plugins/dev-workflow/skills/setup-agentic-repository/templates/`.

## Releasing a change

Bump the plugin's `version` in both `plugins/<name>/.claude-plugin/plugin.json`
and `.claude-plugin/marketplace.json`, then check the marketplace with:

```sh
claude plugin validate .
```

## License

MIT, see [LICENSE](./LICENSE). `dev-workflow` includes skills derived from
[`mattpocock/skills`](https://github.com/mattpocock/skills) (see
`plugins/dev-workflow/LICENSE-mattpocock-skills`), and `dev-progress` is
derived from [claude-kit](https://github.com/JohnnyVizz/claude-kit) (see
`plugins/dev-progress/LICENSE-claude-kit`), both under the same licence.
