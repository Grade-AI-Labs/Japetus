import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { embed, userText } from './shared.js';

export function registerWriteAdr(server: McpServer): void {
  server.registerPrompt(
    'write_adr',
    {
      description:
        'Write an Architecture Decision Record for a decision that has already been made. Captures context, decision, and consequences; does NOT re-litigate.',
      argsSchema: {
        decision: z.string().describe('The decision itself, in one sentence.'),
        context: z.string().optional().describe('Surrounding context, constraints, or discussion.'),
      },
    },
    ({ decision, context }) => ({
      messages: [
        userText(
          `Decision: ${decision}` +
            (context ? `\n\nContext: ${context}` : '') +
            '\n\nWrite an ADR. Be crisp. Include rejected alternatives.',
        ),
        embed('templates://adr'),
      ],
    }),
  );
}
