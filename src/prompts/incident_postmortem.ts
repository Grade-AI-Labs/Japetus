import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { embed, userText } from './shared.js';

export function registerIncidentPostmortem(server: McpServer): void {
  server.registerPrompt(
    'incident_postmortem',
    {
      description:
        'Draft a blameless postmortem for an incident, following Talentech AI Labs conventions. Pulls both the postmortem template and the incident-response runbook.',
      argsSchema: {
        incident_id: z.string().describe('Incident identifier (e.g. INC-2026-0042).'),
      },
    },
    ({ incident_id }) => ({
      messages: [
        userText(
          `Write a postmortem for ${incident_id}.\n\nUse the template below. Follow the incident-response runbook for terminology (severity levels, mitigation vs remediation, etc). Be blameless — focus on system and process.`,
        ),
        embed('templates://postmortem'),
        embed('runbooks://incident-response'),
      ],
    }),
  );
}
