import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { audit } from '../audit/logger.ts';
import { requireScope, kbScopeFor } from '../auth/scopes.ts';
import { principalFromExtra, type AppContext, type McpExtra } from '../server.ts';
import { resourceNotFound } from '../errors.ts';

export function registerGetResource(server: McpServer, ctx: AppContext): void {
  server.registerTool(
    'get_resource',
    {
      description:
        'Read the full content of a curated resource by URI. Tool-shaped alias of resources/read for clients that prefer tool-shaped access. Returns content, etag, and lastModified. Prefer attaching the resource directly if your client supports MCP resources.',
      inputSchema: {
        uri: z
          .string()
          .describe('A conventions://, runbooks://, templates://, docs://, or catalog:// URI.'),
      },
    },
    async ({ uri }, extra: McpExtra) => {
      const entry = ctx.registry.resolve(uri);
      const principal = principalFromExtra(extra);
      if (principal) {
        if (entry.uri.startsWith('catalog://')) requireScope(principal, 'catalog:read', entry.uri);
        else if (entry.uri.startsWith('docs://') && entry.space)
          requireScope(principal, kbScopeFor(entry.space), entry.uri);
        else requireScope(principal, 'standards:read', entry.uri);
      }
      const started = Date.now();
      const cached = ctx.cache.get(entry.uri);
      let result;
      let cacheHit = false;
      if (cached) {
        cacheHit = true;
        result = cached;
      } else {
        const adapter = ctx.registry.getAdapter(entry.adapterId);
        if (!adapter) throw resourceNotFound(uri);
        result = await adapter.fetch(entry.backingId);
        ctx.cache.set(entry.uri, result);
      }
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'tool_call',
        target: 'get_resource',
        outcome: 'ok',
        latencyMs: Date.now() - started,
        cacheHit,
        argsSummary: `uri=${uri}`,
      });
      const payload = {
        uri: entry.uri,
        content: result.content,
        etag: result.etag,
        lastModified: result.updated,
      };
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload,
      };
    },
  );
}
