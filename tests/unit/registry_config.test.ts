import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadRegistryConfig } from '../../src/config/registry_config.ts';
import { Registry } from '../../src/registry.ts';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'reg-cfg-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('Registry config loader', () => {
  it('loads a valid config and seeds the registry', async () => {
    const path = join(dir, 'cfg.json');
    await writeFile(
      path,
      JSON.stringify({
        entries: [
          {
            uri: 'conventions://prs/review-checklist',
            adapterId: 'filesystem',
            backingId: 'conventions/prs/review-checklist.md',
            name: 'PR review checklist',
            description: 'PR review checklist',
            owner: 'platform-dx',
            priority: 0.9,
            topics: ['pr review'],
            aliases: ['conventions://prs/checklist'],
          },
        ],
      }),
    );
    const reg = new Registry();
    await loadRegistryConfig(reg, path);
    expect(reg.list().map((e) => e.uri)).toEqual(['conventions://prs/review-checklist']);
    expect(reg.resolve('conventions://prs/checklist').uri).toBe(
      'conventions://prs/review-checklist',
    );
  });

  it('rejects a config with a malformed entry', async () => {
    const path = join(dir, 'bad.json');
    await writeFile(
      path,
      JSON.stringify({
        entries: [{ uri: 'conventions://x', adapterId: 'filesystem' /* missing required */ }],
      }),
    );
    const reg = new Registry();
    await expect(loadRegistryConfig(reg, path)).rejects.toThrow(/Invalid registry config/);
  });

  it('rejects a config that is not JSON', async () => {
    const path = join(dir, 'broken.json');
    await writeFile(path, 'not json {');
    const reg = new Registry();
    await expect(loadRegistryConfig(reg, path)).rejects.toThrow();
  });

  it('rejects a missing config file with a clear error', async () => {
    const reg = new Registry();
    await expect(loadRegistryConfig(reg, join(dir, 'nope.json'))).rejects.toThrow();
  });

  it('the dev config bundled in config/registry.dev.json loads cleanly', async () => {
    const reg = new Registry();
    await loadRegistryConfig(reg, 'config/registry.dev.json');
    const uris = reg.list().map((e) => e.uri);
    expect(uris).toContain('conventions://prs/review-checklist');
    expect(uris).toContain('templates://prd');
    expect(reg.resolve('conventions://prs/checklist').uri).toBe(
      'conventions://prs/review-checklist',
    );
  });
});
