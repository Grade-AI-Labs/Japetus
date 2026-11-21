# talentech-core

Company-wide skills for every department.

## Install

```
/plugin marketplace add Grade-AI-Labs/Japetus
/plugin install talentech-core@talentech
```

The Confluence skills call the Confluence tools of the Atlassian connector in the Claude directory. Connect it on claude.ai under Settings → Connectors and sign in with your own Atlassian account. Claude Code picks up the connectors of the claude.ai account you are logged in with: run `/mcp` to check that the Atlassian connector is connected, and sign in there if it asks you to. Your Atlassian site admin must allow the Rovo MCP server for the site.

## What ships

| Skill | Use it to |
| --- | --- |
| `/talentech-core:push-to-confluence` | Publish ad-hoc content as a new child page under a parent page you name, or append to that page |
| `/talentech-core:pull-from-confluence` | Pull a page and, if you want, its child pages into the session as context. Read-only |
| `/talentech-core:grill-me` | Get grilled about a plan, design or piece of writing until you reach a shared understanding |
| `talentech-core:grilling` | The interview itself, which `grill-me`, the role plugins' `grill-*` wrappers and dev-workflow's skills run. It also triggers by itself when you ask to be grilled |
| `/talentech-core:handoff` | Compact the conversation into a handoff document another session or a colleague can pick up |
| `/talentech-core:to-questionnaire` | Turn a decision you can't answer alone into a questionnaire for the person who can |
| `/talentech-core:teach` | Learn a topic over several sessions, with the current directory as the teaching workspace |
| `/talentech-core:wait-what` | Ask for the last message again, in plain language |

## Prerequisites

- `push-to-confluence` and `pull-from-confluence` need the Atlassian connector (see Install).
- `grilling`, `grill-me`, `handoff`, `to-questionnaire`, `teach` and `wait-what` run in Claude Code. `grilling` sends subagents to look facts up, and `to-questionnaire` and `teach` write files into the current directory, so start Claude Code in a directory it may write to.

These six came from [Matt Pocock's skills](https://github.com/mattpocock/skills), by way of `dev-workflow` (MIT, see `LICENSE-mattpocock-skills`).

## Writing a wrapper skill

The _how_ of an interview lives once, in `grilling`. A role plugin adds the _what_ as a small **wrapper** skill: `talentech-product:grill-prd` and `talentech-design:grill-ux-flow` are the examples to copy.

1. **Depend on core.** Add `"dependencies": ["talentech-core"]` to the role plugin's `plugin.json`.
2. **Put the what in `references/`** next to the wrapper's `SKILL.md`: a checklist (the topics the interview must cover), any context (products, markets, rules), and a template for the output.
3. **Keep `SKILL.md` short.** Tell Claude to read the references, then to call the Skill tool with "talentech-core:grilling" and run it by its rules. Add only what is the role's own: the stages, if there are several, where to look things up first, and what to do with the confirmed output (push it to Confluence, offer the next skill).
4. **Do not change how the interview runs.** Pacing, rounds, Open topics and the stage gate are `grilling`'s, in its section "When a wrapper skill runs you". If a wrapper needs a different interview, change `grilling` for everyone.
5. **Choose who starts it.** `disable-model-invocation: true` makes the wrapper user-typed only. Leave it off only when the wrapper should trigger by itself and its description does not compete with other skills. `grilling` itself must stay model-invocable: a skill cannot call a skill that has `disable-model-invocation: true`.

## Notes

- The Confluence skills use the `talentechgroup.atlassian.net` site and fall back to looking up the cloud id if that fails.
- Expect changes: this plugin is the place for role-neutral skills that several departments use, and it may be reorganised as the marketplace grows.
