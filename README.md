# Japetus

The `talentech-agentic-skills` plugin marketplace: the skills and agents Talentech uses in the Claude desktop app and Claude Code. This README is the source of truth for what each plugin gives you, how you get it, and what to do when something looks wrong.

## What you get, by role

Four plugins are for everyone. IT installs them company-wide:

| Plugin | For | What it gives you |
| --- | --- | --- |
| [`talentech-core`](./plugins/talentech-core) | Everyone | The `grilling` interview that the role plugins build on, `/talentech-core:grill-me`, `/talentech-core:to-questionnaire`, and publishing to and pulling from Confluence. |
| [`talentech-design`](./plugins/talentech-design) | Product Design | Briefs, design readiness, `grill-ux-flow`, FigJam flows, wireframes, handoff pages, UX content and translation. |
| [`talentech-product`](./plugins/talentech-product) | Product Management | `grill-prd`: from a raw problem to a developer-ready PRD. |
| [`talentech-research`](./plugins/talentech-research) | UX research | Plans, methods, interview guides, surveys, synthesis, ethics and share-outs. |

One plugin is for developers, and you opt in to it yourself:

| Plugin | What it gives you |
| --- | --- |
| [`dev-workflow`](./plugins/dev-workflow) | Matt Pocock's engineering skills with Mimas's setup and review skills, tiered worker agents and the `/orchestrate-spec` orchestrator. Also `handoff`, `teach` and `wait-what`. |

Services such as Atlassian (Confluence, Jira), Productboard, Figma and Crowdin come through the company's **connectors**, not through these plugins. They work in the Chat and Cowork tabs and in Claude Code. The Crowdin connector is waiting for IT's approval, so Crowdin is not available until IT adds it.

## What is automatic, and what you do yourself

- **Claude desktop app (Chat, Cowork and Code tabs):** once IT has switched on the company-wide sync, the four Talentech plugins and the connectors are there without you installing anything.
- **Claude Code in the terminal (the CLI):** nothing is installed for you. Add the marketplace and install what you want:

  ```
  /plugin marketplace add Grade-AI-Labs/Japetus
  /plugin install dev-workflow@talentech-agentic-skills
  ```

  The repository, [Grade-AI-Labs/Japetus](https://github.com/Grade-AI-Labs/Japetus), is private, so Claude Code clones it with your own git credentials. You need read access to it, and `git clone https://github.com/Grade-AI-Labs/Japetus.git` must work from your terminal first.

  Claude Code in the desktop app already reads the desktop app's plugins. **Do not install the four Talentech plugins in the CLI as well**, or you will see them twice (see [Troubleshooting](#troubleshooting)).

- **Signing in to a connector:** the first time a skill needs Atlassian, Productboard or another service, run `/mcp` in Claude Code, pick the service and sign in with your own account in the browser. In the desktop app, connect it under Settings → Connectors. Claude acts with your own permissions.

Installing a plugin also installs the plugins it depends on: `talentech-design`, `talentech-product` and `dev-workflow` depend on `talentech-core`.

## Changelog

### November 2026

- **The marketplace is renamed** from `talentech` to `talentech-agentic-skills`, to match the repository IT syncs. If you added it in the CLI under the old name, updating keeps the old name, so remove it and add it again, then reinstall what you use:

  ```
  /plugin marketplace remove talentech
  /plugin marketplace add Grade-AI-Labs/Japetus
  /plugin install <plugin>@talentech-agentic-skills
  ```

- **`crowdin-mcp` and `productboard-mcp` are removed.** Use the company's Crowdin and Productboard connectors instead. Removing the old marketplace above uninstalls them.
- **Skills moved or were renamed**, with no alias left under the old name. Type the new command, and delete any copy of the old skill you made by hand in `~/.claude/skills`:

  | Old | New |
  | --- | --- |
  | `/talentech-product:problem-to-prd` | `/talentech-product:grill-prd` |
  | `/dev-workflow:grilling` | `/talentech-core:grilling` |
  | `/dev-workflow:grill-me` | `/talentech-core:grill-me` |
  | `/dev-workflow:to-questionnaire` | `/talentech-core:to-questionnaire` |

  Skills or tools of your own that call `dev-workflow:grilling` by name must call `talentech-core:grilling` instead.

## Troubleshooting

- **A service says "Needs authentication".** Run `/mcp`, pick the service and sign in. In the desktop app, check Settings → Connectors. If sign-in is refused, your workspace or site admin may have to approve the integration first.
- **You see a plugin, a skill or a service twice.** Something is installed from two places. Check, in this order:
  - You installed a Talentech plugin in the CLI that the desktop app already gives you. Uninstall the CLI copy: `/plugin uninstall <plugin>@talentech-agentic-skills`.
  - You still have the marketplace under its old name `talentech`, or the plugins from the older `talentech-skills` or `mimas` marketplaces. Remove them (`/plugin marketplace remove <name>`).
  - You still have `crowdin-mcp` or `productboard-mcp` next to the company connector. Uninstall the plugin.
  - You copied a skill by hand into `~/.claude/skills`, for example `problem-to-prd`. Delete the copy.
- **A role plugin's skill fails because a `talentech-core` skill is missing.** Your Claude Code may be older than v2.1.319, which installs new dependencies on update. Update the plugin by hand, or install core:

  ```sh
  claude plugin update dev-workflow@talentech-agentic-skills     # in a shell
  /reload-plugins                                                # then in an open session
  /plugin install talentech-core@talentech-agentic-skills
  ```

- **Who to ask:** Olof Brogeby and Juha Ruuska maintain this marketplace.

## How core and the role plugins fit together

`talentech-core` holds the skills every department uses, and holds them once. The role plugins depend on it, and Claude Code installs it with them. A role plugin adds small **wrapper** skills on top of core's: `talentech-product:grill-prd` runs `talentech-core:grilling` with a PRD checklist, Talentech product context and a PRD template. So the _how_ of an interview is kept in core, and each department owns the _what_. See [Writing a wrapper skill](./plugins/talentech-core/README.md#writing-a-wrapper-skill).

## Install for everyone in a repo

To offer the plugins to everyone working in a repo in Claude Code, add this to that repo's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "talentech-agentic-skills": {
      "source": {
        "source": "github",
        "repo": "Grade-AI-Labs/Japetus"
      }
    }
  },
  "enabledPlugins": {
    "dev-workflow@talentech-agentic-skills": true
  }
}
```

Leave the four Talentech plugins out of this list: the desktop app already gives them to everyone.

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
`plugins/dev-workflow/LICENSE-mattpocock-skills`), under the same licence.
