import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  audit,
  setAuditSink,
  StdoutAuditSink,
  type AuditEntry,
  type AuditSink,
} from '../../src/audit/logger.ts';

class CapturingSink implements AuditSink {
  readonly entries: AuditEntry[] = [];
  emit(entry: AuditEntry): void {
    this.entries.push(entry);
  }
}

let sink: CapturingSink;

beforeEach(() => {
  sink = new CapturingSink();
  setAuditSink(sink);
});

afterEach(() => {
  setAuditSink(new StdoutAuditSink());
});

describe('audit() pipeline', () => {
  it('redacts before the sink sees the entry', () => {
    audit({
      user: 'u',
      kind: 'tool_call',
      target: 'search_standards',
      outcome: 'ok',
      argsSummary: 'q=mailto user@talentech.com',
    });
    expect(sink.entries).toHaveLength(1);
    expect(sink.entries[0]!.argsSummary).toBe('q=mailto <email>');
    expect(sink.entries[0]!.argsSummary).not.toContain('@talentech.com');
  });

  it('truncates oversize argsSummary before emit', () => {
    audit({
      user: 'u',
      kind: 'tool_call',
      target: 'search_standards',
      outcome: 'ok',
      argsSummary: 'q=' + 'x'.repeat(200),
    });
    expect(sink.entries[0]!.argsSummary!.length).toBe(80);
  });

  it('attaches an ISO timestamp', () => {
    audit({
      user: 'u',
      kind: 'resource_read',
      target: 'conventions://x',
      outcome: 'ok',
    });
    expect(sink.entries[0]!.ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
