import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { audit } from '../audit/logger.ts';
import { requireScope } from '../auth/scopes.ts';
import { principalFromExtra, type AppContext, type McpExtra } from '../server.ts';
import type { Space } from '../adapters/types.ts';

export function registerSearchDocs(server: McpServer, ctx: AppContext): void {
  server.registerTool(
    'search_docs',
    {
      description:
        'Search pre-approved knowledge-base spaces (ENG, PRODUCT, SEC) for reference material. This is curated — it does NOT search the full KB. For conventions and runbooks prefer search_standards.',
      inputSchema: {
        space: z
          .enum(['ENG', 'PRODUCT', 'SEC'])
          .describe('Pre-approved space. Opaque to the agent.'),
        query: z.string().min(1),
        limit: z.number().int().min(1).max(25).default(10).optional(),
      },
    },
    async (args, extra: McpExtra) => {
      const space = args.space as Space;
      const principal = principalFromExtra(extra);
      if (principal) requireScope(principal, 'kb:read');
      const started = Date.now();
      const results: Array<{ uri: string; snippet: string; score: number }> = [];
      for (const adapter of ctx.registry.listAdapters()) {
        if (!adapter.search) continue;
        try {
          const hits = await adapter.search(args.query, space);
          for (const h of hits) {
            results.push({
              uri: `docs://${space.toLowerCase()}/${h.backingId}`,
              snippet: h.snippet,
              score: h.score,
            });
          }
        } catch {
          // continue with other adapters
        }
      }
      results.sort((a, b) => b.score - a.score);
      const payload = { results: results.slice(0, args.limit ?? 10) };
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'tool_call',
        target: 'search_docs',
        outcome: 'ok',
        latencyMs: Date.now() - started,
        argsSummary: `space=${space} q=${args.query.slice(0, 60)}`,
      });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload,
      };
    },
  );
}
