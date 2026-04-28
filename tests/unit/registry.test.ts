import { describe, expect, it } from 'vitest';
import { Registry, type ResourceEntry } from '../../src/registry.ts';

const baseEntry: ResourceEntry = {
  uri: 'conventions://prs/review-checklist',
  adapterId: 'filesystem',
  backingId: 'conventions/prs/review-checklist.md',
  name: 'PR review checklist',
  description: 'PR review checklist',
};

describe('Registry alias / supersedes resolution', () => {
  it('resolves a canonical URI to its entry', () => {
    const reg = new Registry();
    reg.register(baseEntry);
    expect(reg.resolve('conventions://prs/review-checklist').uri).toBe(
      'conventions://prs/review-checklist',
    );
  });

  it('resolves an alias URI to the canonical entry (alias support)', () => {
    const reg = new Registry();
    reg.register({
      ...baseEntry,
      aliases: ['conventions://prs/checklist'],
    });
    const viaAlias = reg.resolve('conventions://prs/checklist');
    expect(viaAlias.uri).toBe('conventions://prs/review-checklist');
    expect(viaAlias).toBe(reg.resolve('conventions://prs/review-checklist'));
  });

  it('preserves existing supersedes semantics (legacy field)', () => {
    const reg = new Registry();
    reg.register({
      ...baseEntry,
      supersedes: ['conventions://prs/old-checklist'],
    });
    const viaOld = reg.resolve('conventions://prs/old-checklist');
    expect(viaOld.uri).toBe('conventions://prs/review-checklist');
  });

  it('list() does not include alias URIs (only canonical entries)', () => {
    const reg = new Registry();
    reg.register({ ...baseEntry, aliases: ['conventions://prs/checklist'] });
    const uris = reg.list().map((e) => e.uri);
    expect(uris).toEqual(['conventions://prs/review-checklist']);
  });

  it('throws -32002 for unknown URI', () => {
    const reg = new Registry();
    reg.register(baseEntry);
    expect(() => reg.resolve('conventions://nope')).toThrow(/Resource not found/);
  });

  it('throws at seed time on alias collision (two entries claim the same alias)', () => {
    const reg = new Registry();
    reg.register({ ...baseEntry, aliases: ['conventions://prs/checklist'] });
    expect(() =>
      reg.register({
        uri: 'conventions://prs/different',
        adapterId: 'filesystem',
        backingId: 'conventions/prs/different.md',
        name: 'Different',
        description: 'Different',
        aliases: ['conventions://prs/checklist'],
      }),
    ).toThrow(/alias collision|already (an alias|defined)/i);
  });

  it('throws at seed time when an alias collides with another entry’s canonical URI', () => {
    const reg = new Registry();
    reg.register(baseEntry);
    expect(() =>
      reg.register({
        uri: 'conventions://prs/different',
        adapterId: 'filesystem',
        backingId: 'conventions/prs/different.md',
        name: 'Different',
        description: 'Different',
        aliases: ['conventions://prs/review-checklist'],
      }),
    ).toThrow(/alias collision|already (an alias|defined)/i);
  });

  it('canonical(uri) returns the canonical URI for an alias', () => {
    const reg = new Registry();
    reg.register({ ...baseEntry, aliases: ['conventions://prs/checklist'] });
    expect(reg.canonical('conventions://prs/checklist')).toBe('conventions://prs/review-checklist');
    expect(reg.canonical('conventions://prs/review-checklist')).toBe(
      'conventions://prs/review-checklist',
    );
  });
});
