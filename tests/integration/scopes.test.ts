import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { buildServer } from '../../src/server.ts';
import { Registry } from '../../src/registry.ts';
import { ResourceCache } from '../../src/cache.ts';
import { seedRegistry } from '../../src/seed.ts';
import { startHttpServer } from '../../src/transport.ts';
import type { EntraValidator } from '../../src/auth/entra.ts';
import type { Principal } from '../../src/auth/scopes.ts';
import { FilesystemAdapter } from '../../src/adapters/filesystem.ts';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

class StubValidator implements EntraValidator {
  constructor(private readonly scopes: string[]) {}
  async validate(): Promise<Principal> {
    return {
      sub: 'stub-user',
      scopes: new Set(this.scopes),
      tokenKind: 'user',
    };
  }
}

interface Started {
  client: Client;
  close(): Promise<void>;
}

async function startWithScopes(scopes: string[]): Promise<Started> {
  const contentDir = join(
    tmpdir(),
    `scope-test-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  await mkdir(contentDir, { recursive: true });
  await mkdir(join(contentDir, 'conventions', 'prs'), { recursive: true });
  await mkdir(join(contentDir, 'templates'), { recursive: true });
  await writeFile(
    join(contentDir, 'conventions', 'prs', 'review-checklist.md'),
    '---\ntitle: "PR review checklist"\n---\n\n# Review checklist',
  );
  await writeFile(join(contentDir, 'templates', 'prd.md'), '---\ntitle: "PRD"\n---\n\n# PRD');

  const registry = new Registry();
  registry.registerAdapter(new FilesystemAdapter({ root: contentDir }));
  await seedRegistry(registry);
  const cache = new ResourceCache({ ttlMs: 1000 });
  const http = await startHttpServer({
    buildServer: () => buildServer({ registry, cache }),
    validator: new StubValidator(scopes),
    port: 0,
  });
  const transport = new StreamableHTTPClientTransport(new URL(http.url), {
    requestInit: { headers: { authorization: 'Bearer stub' } },
  });
  const client = new Client({ name: 'scope-test', version: '0.0.1' });
  await client.connect(transport);
  return {
    client,
    async close() {
      await client.close();
      await http.close();
      await rm(contentDir, { recursive: true, force: true });
    },
  };
}

describe('kb:read scope enforcement (collapsed from kb:read:<space>)', () => {
  let fx: Started;
  afterEach(async () => {
    if (fx) await fx.close();
  });

  it('search_docs is rejected with 1001 when token is missing kb:read', async () => {
    fx = await startWithScopes(['standards:read', 'catalog:read']);
    const result = await fx.client.callTool({
      name: 'search_docs',
      arguments: { space: 'ENG', query: 'anything' },
    });
    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0]!.text;
    expect(text).toContain('1001');
    expect(text).toContain('kb:read');
  });

  it('search_docs succeeds when token carries kb:read (any space)', async () => {
    fx = await startWithScopes(['standards:read', 'catalog:read', 'kb:read']);
    const result = await fx.client.callTool({
      name: 'search_docs',
      arguments: { space: 'ENG', query: 'anything' },
    });
    expect(result.isError).toBeFalsy();
  });

  it('a kb:read:ENG token (legacy) is no longer accepted', async () => {
    fx = await startWithScopes(['kb:read:ENG']);
    const result = await fx.client.callTool({
      name: 'search_docs',
      arguments: { space: 'ENG', query: 'anything' },
    });
    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0]!.text;
    expect(text).toContain('1001');
  });
});
