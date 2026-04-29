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
import { setAuditSink, StdoutAuditSink } from '../../src/audit/logger.ts';
import { MetricsAuditSink } from '../../src/audit/metrics_sink.ts';

let contentDir: string;
let metrics: MetricsAuditSink;

beforeEach(async () => {
  contentDir = join(tmpdir(), `metrics-test-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(join(contentDir, 'conventions', 'prs'), { recursive: true });
  await mkdir(join(contentDir, 'templates'), { recursive: true });
  await writeFile(
    join(contentDir, 'conventions', 'prs', 'review-checklist.md'),
    '---\ntitle: "x"\n---\n\n# x',
  );
  await writeFile(join(contentDir, 'templates', 'prd.md'), '---\ntitle: "PRD"\n---\n\n# PRD');
  metrics = new MetricsAuditSink();
  setAuditSink(metrics);
});

afterEach(async () => {
  setAuditSink(new StdoutAuditSink());
  await rm(contentDir, { recursive: true, force: true });
});

describe('adoption metrics — clientInfo capture and derivation', () => {
  it('emits a session_start audit entry on initialize with clientInfo populated', async () => {
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
    const client = new Client({ name: 'metrics-test-client', version: '9.9.9' });
    await client.connect(transport);
    // call something so the server records a tool call too
    await client.callTool({ name: 'search_standards', arguments: { query: 'review' } });
    // Give the server a moment to record the session_start (initialized notification is async)
    await new Promise((r) => setTimeout(r, 50));

    const snap = metrics.snapshot();
    const sessionStarts = snap.filter((e) => e.kind === 'session_start');
    expect(sessionStarts).toHaveLength(1);
    expect(sessionStarts[0]!.clientName).toBe('metrics-test-client');
    expect(sessionStarts[0]!.clientVersion).toBe('9.9.9');

    const m = metrics.derive();
    expect(m.distinctSubClientVersion).toBe(1);
    expect(m.distinctActiveUsersMau).toBeGreaterThanOrEqual(1);

    await client.close();
    await http.close();
  });
});
