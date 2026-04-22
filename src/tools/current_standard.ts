import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { audit } from '../audit/logger.ts';
import { requireScope } from '../auth/scopes.ts';
import { principalFromExtra, type AppContext, type McpExtra } from '../server.ts';
import { resourceNotFound } from '../errors.ts';

export function registerCurrentStandard(server: McpServer, ctx: AppContext): void {
  server.registerTool(
    'current_standard',
    {
      description:
        'Resolve a topic (e.g. "python style", "PR description", "incident response") to the current canonical URI. Follows supersedes chains so callers stay at the right doc even after merges or renames.',
      inputSchema: {
        topic: z.string().min(1).describe('Topic keyword, e.g. "python style" or "GDPR PII".'),
      },
    },
    async ({ topic }, extra: McpExtra) => {
      const principal = principalFromExtra(extra);
      if (principal) requireScope(principal, 'standards:read');
      const started = Date.now();
      const direct = ctx.registry.findByTopic(topic);
      if (!direct) throw resourceNotFound(`topic:${topic}`);
      const canonical = ctx.registry.canonical(direct.uri);
      const target = ctx.registry.resolve(canonical);
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'tool_call',
        target: 'current_standard',
        outcome: 'ok',
        latencyMs: Date.now() - started,
        argsSummary: `topic=${topic}`,
      });
      const payload = {
        topic,
        uri: target.uri,
        name: target.name,
        description: target.description,
        redirectedFrom: direct.uri !== target.uri ? direct.uri : undefined,
      };
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload,
      };
    },
  );
}
