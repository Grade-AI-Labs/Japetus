import { describe, expect, it } from 'vitest';
import { redact } from '../../src/audit/redact.ts';

const base = {
  ts: '2026-04-28T12:00:00.000Z',
  user: 'u',
  kind: 'tool_call' as const,
  target: 'search_standards',
  outcome: 'ok' as const,
};

describe('audit redaction', () => {
  it('passes entries with no PII through unchanged', () => {
    const e = { ...base, argsSummary: 'q=python style scope=*' };
    expect(redact(e)).toEqual(e);
  });

  it('replaces a single email in argsSummary with <email>', () => {
    const e = { ...base, argsSummary: 'q=who is alice@example.com scope=*' };
    expect(redact(e).argsSummary).toBe('q=who is <email> scope=*');
  });

  it('replaces multiple emails', () => {
    const e = { ...base, argsSummary: 'a@b.co c@d.io' };
    expect(redact(e).argsSummary).toBe('<email> <email>');
  });

  it('truncates argsSummary that exceeds 80 characters', () => {
    const long = 'q=' + 'x'.repeat(200);
    const out = redact({ ...base, argsSummary: long }).argsSummary!;
    expect(out.length).toBe(80);
    expect(out).toBe(long.slice(0, 80));
  });

  it('truncation runs after redaction so a trailing email is still scrubbed', () => {
    const padding = 'x '.repeat(35);
    const long = `q=${padding}user@talentech.com tail`;
    const out = redact({ ...base, argsSummary: long }).argsSummary!;
    expect(out).not.toContain('user@talentech.com');
    expect(out).not.toContain('@talentech.com');
    expect(out.length).toBeLessThanOrEqual(80);
  });

  it('handles missing argsSummary (e.g. resource_read)', () => {
    const e = { ...base, kind: 'resource_read' as const };
    expect(redact(e).argsSummary).toBeUndefined();
  });

  it('handles empty argsSummary', () => {
    const e = { ...base, argsSummary: '' };
    expect(redact(e).argsSummary).toBe('');
  });

  it('does not mutate the input entry', () => {
    const e = { ...base, argsSummary: 'a@b.co' };
    const before = { ...e };
    redact(e);
    expect(e).toEqual(before);
  });
});
