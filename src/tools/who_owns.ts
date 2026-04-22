import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { audit } from '../audit/logger.js';
import { requireScope } from '../auth/scopes.js';
import { principalFromExtra, type McpExtra } from '../server.js';

interface CatalogEntry {
  keys: string[];
  team: string;
  primary_contact: string;
  slack_channel: string;
  repos: string[];
}

interface Catalog {
  services: CatalogEntry[];
}

let cached: Catalog | null = null;

function loadCatalog(): Catalog {
  if (cached) return cached;
  const path = process.env['CATALOG_FILE'] ?? resolve(process.cwd(), 'catalog/services.json');
  cached = JSON.parse(readFileSync(path, 'utf8')) as Catalog;
  return cached;
}

export function registerWhoOwns(server: McpServer): void {
  server.registerTool(
    'who_owns',
    {
      description:
        'Resolve a repo path, service name, or package name to its owning team, primary contact, Slack channel, and associated repos. Backed by a static catalog at MVP; shape is stable when the real catalog is wired up in Phase 3.',
      inputSchema: {
        path: z
          .string()
          .min(1)
          .describe('Repo path, service name, or package name — e.g. "talentech-ats-core".'),
      },
    },
    async ({ path }, extra: McpExtra) => {
      const principal = principalFromExtra(extra);
      if (principal) requireScope(principal, 'catalog:read');
      const started = Date.now();
      const catalog = loadCatalog();
      const needle = path.toLowerCase();
      const hit = catalog.services.find((s) =>
        s.keys.some((k) => needle === k.toLowerCase() || needle.includes(k.toLowerCase())),
      );
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'tool_call',
        target: 'who_owns',
        outcome: hit ? 'ok' : 'error',
        latencyMs: Date.now() - started,
        argsSummary: `path=${path}`,
      });
      if (!hit) {
        const payload = { found: false, path };
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
          structuredContent: payload,
          isError: true,
        };
      }
      const payload = {
        found: true,
        team: hit.team,
        primary_contact: hit.primary_contact,
        slack_channel: hit.slack_channel,
        repos: hit.repos,
      };
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload,
      };
    },
  );
}
