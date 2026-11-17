# crowdin-mcp

Adds [Crowdin's hosted MCP server](https://mcp.crowdin.com/v2/mcp) to Claude
Code: projects, source files, strings, translations, glossaries, translation
memories, tasks and QA checks.

```
/plugin install crowdin-mcp@talentech
```

Then run `/mcp`, pick `plugin:crowdin-mcp:crowdin` and sign in with your
Crowdin account in the browser. Claude acts with your own permissions; no
token is stored in this repo.

The server exposes several hundred tools, including destructive ones (delete
project, delete file, delete translation). Review each tool call before you
approve it, and consider allowing only the read tools by default.
