import { z } from 'zod';
import MiniSearch from 'minisearch';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { audit } from '../audit/logger.ts';
import { requireScope } from '../auth/scopes.ts';
import type { AppContext, McpExtra } from '../server.ts';
import { principalFromExtra } from '../server.ts';

interface Doc {
  id: string;
  uri: string;
  name: string;
  description: string;
  body: string;
  kind: string;
  topics: string;
}

export function registerSearchStandards(server: McpServer, ctx: AppContext): void {
  let index: MiniSearch<Doc> | null = null;
  let indexedAt = 0;

  async function ensureIndex(): Promise<MiniSearch<Doc>> {
    if (index && Date.now() - indexedAt < 5 * 60_000) return index;
    const docs: Doc[] = [];
    for (const e of ctx.registry.list()) {
      const adapter = ctx.registry.getAdapter(e.adapterId);
      if (!adapter) continue;
      let body = '';
      try {
        const fetched = await adapter.fetch(e.backingId);
        body = fetched.content;
      } catch {
        // skip unavailable on index build; still index name + description
      }
      docs.push({
        id: e.uri,
        uri: e.uri,
        name: e.name,
        description: e.description,
        body,
        kind: uriKind(e.uri),
        topics: (e.topics ?? []).join(' '),
      });
    }
    const ms = new MiniSearch<Doc>({
      fields: ['name', 'description', 'body', 'topics'],
      storeFields: ['uri', 'name', 'description'],
      searchOptions: { boost: { name: 3, description: 2, topics: 2 }, fuzzy: 0.2, prefix: true },
    });
    ms.addAll(docs);
    index = ms;
    indexedAt = Date.now();
    return ms;
  }

  server.registerTool(
    'search_standards',
    {
      description:
        'Semantic search over the Talentech curated corpus of coding conventions, runbooks, and templates. Returns URIs and snippets — call get_resource to read full content. Use this when the user asks for guidance, checklists, or house-style rules; do NOT use this for general KB search (see search_docs).',
      inputSchema: {
        query: z.string().min(1).describe('Free-text query.'),
        scope: z
          .enum(['conventions', 'runbooks', 'templates'])
          .optional()
          .describe('Narrow to one corpus kind.'),
        limit: z.number().int().min(1).max(25).default(10).optional(),
      },
    },
    async (args, extra: McpExtra) => {
      const principal = principalFromExtra(extra);
      if (principal) requireScope(principal, 'standards:read');
      const started = Date.now();
      const idx = await ensureIndex();
      const results = idx
        .search(args.query, args.scope ? { filter: (d) => d.kind === args.scope } : {})
        .slice(0, args.limit ?? 10)
        .map((r) => ({
          uri: r['uri'] as string,
          name: r['name'] as string,
          description: r['description'] as string,
          snippet: renderSnippet((r['description'] as string) ?? ''),
          score: r.score,
        }));
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'tool_call',
        target: 'search_standards',
        outcome: 'ok',
        latencyMs: Date.now() - started,
        argsSummary: `q=${truncate(args.query, 80)} scope=${args.scope ?? '*'}`,
      });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ results }, null, 2) }],
        structuredContent: { results },
      };
    },
  );
}

function uriKind(uri: string): string {
  const m = uri.match(/^([a-z]+):\/\//);
  return m ? m[1]! : 'unknown';
}

function renderSnippet(text: string): string {
  return text.length <= 200 ? text : text.slice(0, 200) + '…';
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n) + '…';
}
