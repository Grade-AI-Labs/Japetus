import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { embed, userText } from './shared.ts';

export function registerOnboardRepo(server: McpServer): void {
  server.registerPrompt(
    'onboard_repo',
    {
      description:
        'Generate an AGENTS.md draft for a repository. Inspects the repo (the agent does this; no tool call here) and combines findings with Talentech org defaults. The resulting AGENTS.md should link to talentech-standards:// URIs for anything that ought to be pulled live, not copy-paste the content.',
      argsSchema: {
        repo_url: z.string().describe('Git URL of the repository to onboard.'),
      },
    },
    ({ repo_url }) => ({
      messages: [
        userText(
          `Inspect ${repo_url} and draft an AGENTS.md.\n\nRules:\n- Detect primary language(s) and frameworks; reference the matching talentech-standards URIs below rather than duplicating their content.\n- Keep repo-specific sections (build, test, deploy) concrete; keep org-level sections as links.\n- If the repo has its own conventions that override the org default, note them explicitly.`,
        ),
        embed('conventions://git/commit-messages'),
        embed('conventions://git/branch-naming'),
        embed('conventions://prs/description-template'),
        embed('conventions://prs/review-checklist'),
        embed('conventions://testing/unit'),
        embed('conventions://testing/integration'),
      ],
    }),
  );
}
