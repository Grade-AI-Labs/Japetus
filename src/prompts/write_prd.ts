import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { embed, userText } from './shared.js';

export function registerWritePrd(server: McpServer): void {
  server.registerPrompt(
    'write_prd',
    {
      description:
        'Draft a PRD (product requirements document) following Talentech AI Labs conventions. Pulls the canonical PRD template and relevant product guidance. Produces text only — filing to Azure DevOps is a separate step (see PRD §10 #3).',
      argsSchema: {
        topic: z.string().describe('One-line description of the feature or product problem.'),
        product: z
          .enum(['varbi', 'reachmee', 'jobtip', 'talmund'])
          .optional()
          .describe('Product surface this PRD targets, if any.'),
        ticketing: z
          .string()
          .optional()
          .describe('Ticketing system to reference (e.g. Azure DevOps project name).'),
      },
    },
    ({ topic, product, ticketing }) => ({
      messages: [
        userText(
          `Draft a PRD for: ${topic}` +
            (product ? `\nProduct: ${product}` : '') +
            (ticketing ? `\nTicketing: ${ticketing}` : '') +
            '\n\nFollow the PRD template and conventions referenced below. Structure every section, even if brief; leave TODOs for sections the user must fill in.',
        ),
        embed('templates://prd'),
        embed('conventions://ado/work-item-conventions'),
      ],
    }),
  );
}
