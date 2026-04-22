# Client setup

This doc covers registering `grade-standards` in the supported clients and the OAuth flow. Matches slice [plans/issues/18-cursor-wiring.md](../plans/issues/18-cursor-wiring.md).

## Claude Code

Add the server as a remote MCP server at the user or project level:

```sh
# user-level (recommended for org-wide use)
claude mcp add --transport http grade-standards https://grade-standards.example.corp/mcp
```

On first use, Claude Code opens a browser for the Entra consent flow. After consent, tokens are cached per user.

### Project-level override

Drop a `.mcp.json` into the repo root:

```json
{
  "mcpServers": {
    "grade-standards": {
      "type": "http",
      "url": "https://grade-standards.example.corp/mcp"
    }
  }
}
```

## Cursor

Cursor supports remote MCP servers via `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "grade-standards": {
      "url": "https://grade-standards.example.corp/mcp",
      "transport": "http"
    }
  }
}
```

Cursor runs the same OAuth consent flow as Claude Code on first use.

## VS Code + Copilot Chat (partial support)

MCP is supported in **agent chat**, not in inline completions. Wire via `.vscode/mcp.json` in the repo:

```json
{
  "servers": {
    "grade-standards": {
      "type": "http",
      "url": "https://grade-standards.example.corp/mcp"
    }
  }
}
```

Inline completions continue to pull org conventions from the static `.github/copilot-instructions.md` distributed via Mimas. This is an explicit product stance per PRD §9 risk mitigation — not an accidental gap.

## Local development

For local work against the server running from this repo:

```sh
npm install
CONTENT_DIR=$(pwd)/content AUTH_MODE=dev npm run dev
```

Then point your client at `http://localhost:3333/mcp`. `AUTH_MODE=dev` accepts any bearer and grants all scopes — do NOT use in any environment with real data.

## Troubleshooting

- **"Missing Authorization header"** — the client didn't attach a token. In dev, set `AUTH_MODE=dev` and pass any `Authorization: Bearer <anything>` header.
- **Browser consent fails** — check that the Entra redirect URI in the app registration exactly matches what Claude Code/Cursor sends. Common cause: trailing slash mismatch.
- **Resource reads return 403 / custom 1001** — the user's token is valid but missing the scope for that resource. Check the scope claims in the Entra app and the consent scope request.
- **Cache staleness** — server cache TTL is 5 minutes by default; `resources/list_changed` notifies clients when the corpus updates. If the client doesn't honor the notification, restart the client.
