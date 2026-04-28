import { describe, expect, it } from 'vitest';
import { deriveAdoptionMetrics, isoWeek } from '../../src/audit/metrics.ts';
import type { AuditEntry } from '../../src/audit/logger.ts';

const at = (
  ts: string,
  user: string,
  kind: AuditEntry['kind'],
  extras: Partial<AuditEntry> = {},
): AuditEntry => ({
  ts,
  user,
  kind,
  target: extras.target ?? 'x',
  outcome: extras.outcome ?? 'ok',
  ...extras,
});

describe('deriveAdoptionMetrics', () => {
  it('counts distinct sub MAU over a rolling 30 days', () => {
    const now = new Date('2026-04-30T00:00:00Z');
    const entries: AuditEntry[] = [
      at('2026-04-29T10:00:00Z', 'alice', 'tool_call'),
      at('2026-04-15T10:00:00Z', 'bob', 'resource_read'),
      at('2026-03-01T10:00:00Z', 'carol', 'tool_call'), // outside 30d window
    ];
    const m = deriveAdoptionMetrics(entries, now);
    expect(m.distinctActiveUsersMau).toBe(2);
  });

  it('groups tool calls per user per ISO week', () => {
    const entries: AuditEntry[] = [
      at('2026-04-27T10:00:00Z', 'alice', 'tool_call'),
      at('2026-04-29T10:00:00Z', 'alice', 'tool_call'),
      at('2026-04-29T10:00:00Z', 'bob', 'tool_call'),
      at('2026-04-22T10:00:00Z', 'alice', 'tool_call'), // previous ISO week
    ];
    const m = deriveAdoptionMetrics(entries);
    expect(m.callsPerUserPerWeek['2026-W17']?.['alice']).toBe(1);
    expect(m.callsPerUserPerWeek['2026-W18']?.['alice']).toBe(2);
    expect(m.callsPerUserPerWeek['2026-W18']?.['bob']).toBe(1);
  });

  it('counts first-seen sub per ISO week (net-new adopters)', () => {
    const entries: AuditEntry[] = [
      at('2026-04-13T10:00:00Z', 'alice', 'tool_call'),
      at('2026-04-15T10:00:00Z', 'alice', 'tool_call'), // not first-seen
      at('2026-04-22T10:00:00Z', 'bob', 'tool_call'), // first-seen
      at('2026-04-29T10:00:00Z', 'carol', 'tool_call'), // first-seen
      at('2026-04-29T10:00:00Z', 'bob', 'tool_call'), // not first-seen
    ];
    const m = deriveAdoptionMetrics(entries);
    expect(m.firstSeenPerWeek['2026-W16']).toBe(1);
    expect(m.firstSeenPerWeek['2026-W17']).toBe(1);
    expect(m.firstSeenPerWeek['2026-W18']).toBe(1);
  });

  it('counts distinct sub × clientName × clientVersion from session_start entries', () => {
    const entries: AuditEntry[] = [
      at('2026-04-29T10:00:00Z', 'alice', 'session_start', {
        clientName: 'claude-code',
        clientVersion: '1.0.0',
      }),
      at('2026-04-29T11:00:00Z', 'alice', 'session_start', {
        clientName: 'claude-code',
        clientVersion: '1.0.0',
      }),
      at('2026-04-29T12:00:00Z', 'alice', 'session_start', {
        clientName: 'claude-code',
        clientVersion: '1.0.1',
      }),
      at('2026-04-29T13:00:00Z', 'bob', 'session_start', {
        clientName: 'cursor',
        clientVersion: '0.42',
      }),
    ];
    const m = deriveAdoptionMetrics(entries);
    expect(m.distinctSubClientVersion).toBe(3);
  });

  it('isoWeek formats keys like "YYYY-Www"', () => {
    expect(isoWeek(new Date('2026-04-29T00:00:00Z'))).toBe('2026-W18');
    expect(isoWeek(new Date('2026-01-01T00:00:00Z'))).toBe('2026-W01');
  });

  it('returns zeros for an empty stream', () => {
    const m = deriveAdoptionMetrics([]);
    expect(m.distinctActiveUsersMau).toBe(0);
    expect(m.distinctSubClientVersion).toBe(0);
    expect(Object.keys(m.callsPerUserPerWeek)).toHaveLength(0);
    expect(Object.keys(m.firstSeenPerWeek)).toHaveLength(0);
  });
});
