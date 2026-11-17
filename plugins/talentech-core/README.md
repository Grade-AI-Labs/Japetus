# talentech-core

Company-wide skills for every department.

## Install

```
/plugin marketplace add Grade-AI-Labs/Japetus
/plugin install talentech-core@talentech
```

The skills call the Confluence tools of the Atlassian connector in the Claude directory. Connect it on claude.ai under Settings → Connectors and sign in with your own Atlassian account. Claude Code picks up the connectors of the claude.ai account you are logged in with: run `/mcp` to check that the Atlassian connector is connected, and sign in there if it asks you to. Your Atlassian site admin must allow the Rovo MCP server for the site.

## What ships

| Skill | Use it to |
| --- | --- |
| `/talentech-core:push-to-confluence` | Publish ad-hoc content as a new child page under a parent page you name, or append to that page |
| `/talentech-core:pull-from-confluence` | Pull a page and, if you want, its child pages into the session as context. Read-only |

## Notes

- Both skills use the `talentechgroup.atlassian.net` site and fall back to looking up the cloud id if that fails.
- Expect changes: this plugin is the place for role-neutral skills that several departments use, and it may be reorganised as the marketplace grows.
