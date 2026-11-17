# productboard-mcp

Adds [Productboard's hosted MCP server](https://mcp.productboard.com/) to
Claude Code: documents and comments, entities such as features, components and
initiatives, their relationships, customer feedback and change history.

```
/plugin install productboard-mcp@talentech
```

Then run `/mcp`, pick `plugin:productboard-mcp:productboard` and sign in with
your Productboard account in the browser. Claude acts with your own
permissions; no token is stored in this repo.

The Productboard connector in the Claude directory uses the same URL, so on
claude.ai and in Cowork this plugin reuses that connector.
