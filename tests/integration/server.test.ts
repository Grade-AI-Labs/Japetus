import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { buildServer } from '../../src/server.ts';
import { FilesystemAdapter } from '../../src/adapters/filesystem.ts';
import { Registry } from '../../src/registry.ts';
import { ResourceCache } from '../../src/cache.ts';
import { seedRegistry } from '../../src/seed.ts';
import { startHttpServer } from '../../src/transport.ts';
import { DevValidator } from '../../src/auth/entra.ts';

interface Fixture {
  contentDir: string;
  url: string;
  close(): Promise<void>;
  client: Client;
}

async function setup(): Promise<Fixture> {
  const contentDir = join(tmpdir(), `gs-test-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(join(contentDir, 'conventions', 'prs'), { recursive: true });
  await mkdir(join(contentDir, 'templates'), { recursive: true });
  await writeFile(
    join(contentDir, 'conventions', 'prs', 'review-checklist.md'),
    '---\ntitle: "PR review checklist"\n---\n\n# Review checklist\n\nCover correctness, tests, security, observability.',
  );
  await writeFile(
    join(contentDir, 'templates', 'prd.md'),
    '---\ntitle: "PRD template"\n---\n\n# PRD template\n\nSummary, problem, goals, non-goals.',
  );

  const registry = new Registry();
  registry.registerAdapter(new FilesystemAdapter({ root: contentDir }));
  await seedRegistry(registry);

  const cache = new ResourceCache({ ttlMs: 1000 });
  const http = await startHttpServer({
    buildServer: () => buildServer({ registry, cache }),
    validator: new DevValidator(),
    port: 0,
  });

  const transport = new StreamableHTTPClientTransport(new URL(http.url), {
    requestInit: { headers: { authorization: 'Bearer dev' } },
  });
  const client = new Client({ name: 'test-client', version: '0.0.1' });
  await client.connect(transport);

  return {
    contentDir,
    url: http.url,
    client,
    async close() {
      await client.close();
      await http.close();
      await rm(contentDir, { recursive: true, force: true });
    },
  };
}

describe('Japetus MCP server', () => {
  let fx: Fixture;

  beforeEach(async () => {
    fx = await setup();
  });

  afterEach(async () => {
    await fx.close();
  });

  it('lists the seeded resources', async () => {
    const list = await fx.client.listResources();
    const uris = list.resources.map((r) => r.uri);
    expect(uris).toContain('conventions://prs/review-checklist');
    expect(uris).toContain('templates://prd');
  });

  it('reads a resource and returns markdown + etag', async () => {
    const res = await fx.client.readResource({ uri: 'conventions://prs/review-checklist' });
    expect(res.contents).toHaveLength(1);
    const [first] = res.contents;
    expect(first!.mimeType).toBe('text/markdown');
    expect(String(first!.text)).toContain('Review checklist');
    const meta = first!._meta as { etag?: string; lastModified?: string } | undefined;
    expect(meta?.etag).toBeTruthy();
    expect(meta?.lastModified).toBeTruthy();
  });

  it('returns -32002 for unknown resource URI', async () => {
    await expect(
      fx.client.readResource({ uri: 'conventions://nope/does-not-exist' }),
    ).rejects.toMatchObject({ code: -32002 });
  });

  it('accepts multiple concurrent client sessions', async () => {
    // Regression: a single shared McpServer rejects re-initialization
    // (-32600 "Server already initialized"). The transport mints a fresh
    // server per session.
    const t2 = new StreamableHTTPClientTransport(new URL(fx.url), {
      requestInit: { headers: { authorization: 'Bearer dev' } },
    });
    const c2 = new Client({ name: 'second-client', version: '0.0.1' });
    await c2.connect(t2);
    const res = await c2.readResource({ uri: 'conventions://prs/review-checklist' });
    expect(String(res.contents[0]!.text)).toContain('Review checklist');
    await c2.close();
  });

  it('resources/read on an alias URI returns the canonical content + canonical URI in _meta', async () => {
    const res = await fx.client.readResource({ uri: 'conventions://prs/checklist' });
    expect(res.contents).toHaveLength(1);
    const [first] = res.contents;
    expect(first!.uri).toBe('conventions://prs/review-checklist');
    expect(String(first!.text)).toContain('Review checklist');
  });

  it('search_standards finds the review checklist', async () => {
    const result = await fx.client.callTool({
      name: 'search_standards',
      arguments: { query: 'review checklist' },
    });
    const structured = result.structuredContent as { results: Array<{ uri: string }> };
    expect(structured.results.map((r) => r.uri)).toContain('conventions://prs/review-checklist');
  });

  it('tools/list exposes only search_standards, search_docs, who_owns', async () => {
    const list = await fx.client.listTools();
    const names = list.tools.map((t) => t.name).sort();
    expect(names).toEqual(['search_docs', 'search_standards', 'who_owns']);
  });

  it('prompts/list exposes the five canonical prompts (no onboard_repo)', async () => {
    const list = await fx.client.listPrompts();
    const names = list.prompts.map((p) => p.name).sort();
    expect(names).toEqual([
      'incident_postmortem',
      'review_pr',
      'write_adr',
      'write_prd',
      'write_rfc',
    ]);
  });

  it('who_owns resolves a known service and returns an error payload for unknown', async () => {
    const hit = await fx.client.callTool({
      name: 'who_owns',
      arguments: { path: 'talentech-ats-core' },
    });
    const hitBody = hit.structuredContent as { found: boolean; team: string };
    expect(hitBody.found).toBe(true);
    expect(hitBody.team).toBe('ATS Core');

    const miss = await fx.client.callTool({
      name: 'who_owns',
      arguments: { path: 'nonexistent-service-xyz' },
    });
    expect(miss.isError).toBe(true);
  });

  it('prompts: write_prd embeds templates://prd', async () => {
    const list = await fx.client.listPrompts();
    expect(list.prompts.map((p) => p.name)).toContain('write_prd');
    const result = await fx.client.getPrompt({
      name: 'write_prd',
      arguments: { topic: 'Unified login flow' },
    });
    const uris = result.messages
      .map((m) => m.content)
      .filter((c): c is Extract<typeof c, { type: 'resource' }> => c.type === 'resource')
      .map((c) => c.resource.uri);
    expect(uris).toContain('templates://prd');
  });
});
