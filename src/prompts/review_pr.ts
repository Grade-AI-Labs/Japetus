import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PromptMessage } from '@modelcontextprotocol/sdk/types.js';
import { embed, userText } from './shared.js';

export function registerReviewPr(server: McpServer): void {
  server.registerPrompt(
    'review_pr',
    {
      description:
        'Review a pull request against Talentech AI Labs conventions. Always applies the review checklist and description template; `focus` pulls additional targeted conventions.',
      argsSchema: {
        pr_url: z.string().describe('Full PR URL (GitHub or Azure DevOps).'),
        focus: z
          .enum(['all', 'security', 'performance', 'accessibility'])
          .optional()
          .describe('Narrow the review to a specific concern.'),
      },
    },
    ({ pr_url, focus }) => {
      const f = focus ?? 'all';
      const messages: PromptMessage[] = [
        userText(
          `Review this PR: ${pr_url}\nFocus: ${f}\n\nApply the Talentech review checklist and call out anything missing from the description template. Be specific; reference file paths and line numbers where relevant.`,
        ),
        embed('conventions://prs/review-checklist'),
        embed('conventions://prs/description-template'),
      ];
      if (f === 'security' || f === 'all') {
        messages.push(embed('conventions://security/secrets-handling'));
        messages.push(embed('conventions://security/dependency-policy'));
      }
      if (f === 'accessibility' || f === 'all') {
        messages.push(embed('conventions://accessibility/wcag-baseline'));
      }
      if (f === 'performance' || f === 'all') {
        messages.push(embed('conventions://testing/integration'));
      }
      return { messages };
    },
  );
}
