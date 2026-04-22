import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { embed, userText } from './shared.ts';

export function registerWriteRfc(server: McpServer): void {
  server.registerPrompt(
    'write_rfc',
    {
      description:
        'Draft an RFC for a proposed technical change, following Talentech conventions. Uses the canonical RFC template.',
      argsSchema: {
        topic: z.string().describe('One-line problem statement or proposed change.'),
      },
    },
    ({ topic }) => ({
      messages: [
        userText(
          `Draft an RFC for: ${topic}\n\nFollow the template below. Be opinionated about the recommended option; the goal is to drive a decision.`,
        ),
        embed('templates://rfc'),
      ],
    }),
  );
}
