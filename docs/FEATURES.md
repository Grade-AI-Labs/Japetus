# Feature Areas

This index represents the known feature areas in the system.

It must stay accurate as new features are introduced, renamed, merged, or removed.

---

## Feature list (alphabetical)

- [adapter-layer](./features/adapter-layer.md) — `SourceAdapter` contract, filesystem + Confluence adapters, URI registry, ETag cache, change notifications
- [audit](./features/audit.md) — audit pipeline, redaction (email-strip + 80-char truncation), sinks, adoption metrics
- [auth-and-scopes](./features/auth-and-scopes.md) — Entra JWKS validation, dev/off modes, scope enforcement, MCP error shapes
- [mcp-surface](./features/mcp-surface.md) — tools and prompts registered on the MCP server, plus conventions for adding more

---

## Rules for agents

- Introducing a new feature area requires:
  - creating `docs/features/<feature>.md`
  - adding it to this list (alphabetical)
- Per-service docs live under `docs/features/<area>/` and are linked from the area doc
- Renaming or merging features requires updating links and notes
- This file should remain concise and navigable
