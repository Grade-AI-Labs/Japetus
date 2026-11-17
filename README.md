# talentech-agentic-marketplace

A Claude Code plugin marketplace, `talentech`, with skills, agents and MCP
servers for Talentech: engineering, design, product and research.

| Plugin | What it does |
| --- | --- |
| [`dev-workflow`](./plugins/dev-workflow) | Matt Pocock's promoted skills with Mimas's `setup-agentic-repository` and review skills in place of his setup, plus tiered worker agents and a `/orchestrate-spec` orchestrator that tiers each ticket by model and effort and reviews every result before merging. |
| [`dev-progress`](./plugins/dev-progress) | Mod: a progress bar above the prompt and a live agents panel that `/orchestrate-spec` and its agents report to, drawn as crabs or, with `icons: jdm`, JDM cars. Forked from [savvy-progress](https://github.com/JohnnyVizz/claude-kit/tree/main/plugins/savvy-progress). |
| [`crowdin-mcp`](./plugins/crowdin-mcp) | MCP: Crowdin's hosted MCP server, for projects, strings, translations, glossaries and QA checks. |
| [`productboard-mcp`](./plugins/productboard-mcp) | MCP: Productboard's hosted MCP server, for documents, features, initiatives, feedback and change history. |
| [`talentech-core`](./plugins/talentech-core) | Company-wide skills: publish to and pull from Confluence. Needs the Atlassian connector from the Claude directory. |
| [`talentech-design`](./plugins/talentech-design) | Product Design: briefs, design readiness, FigJam flows, wireframes, handoff pages, UX content and translation. |
| [`talentech-product`](./plugins/talentech-product) | Product Management: from a raw problem to a developer-ready PRD. Depends on `talentech-core`. |
| [`talentech-research`](./plugins/talentech-research) | UX research for design and product: plans, methods, interviews, surveys, synthesis, ethics and share-outs. |

## Install

```
/plugin marketplace add https://gradegroup.ghe.com/tech/talentech-agentic-marketplace.git
/plugin install <plugin>@talentech
```

The repository is on GitHub Enterprise, so Claude Code clones it with your own
git credentials: `git clone https://gradegroup.ghe.com/tech/talentech-agentic-marketplace.git`
must work from your terminal first.

The MCP plugins hold no credentials. After installing one, run `/mcp` and sign
in with your own account; your workspace or site admin may have to approve the
integration first.

## Install for everyone in a repo

To offer the plugins to everyone working in a repo, add this to that repo's
`.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "talentech": {
      "source": {
        "source": "git",
        "url": "https://gradegroup.ghe.com/tech/talentech-agentic-marketplace.git"
      }
    }
  },
  "enabledPlugins": {
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
