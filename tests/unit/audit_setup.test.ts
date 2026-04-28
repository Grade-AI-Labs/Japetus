import { afterEach, describe, expect, it } from 'vitest';
import { setupAuditSinks } from '../../src/audit/setup.ts';
import { setAuditSink, StdoutAuditSink, audit } from '../../src/audit/logger.ts';
import { MetricsAuditSink } from '../../src/audit/metrics_sink.ts';

afterEach(() => {
  setAuditSink(new StdoutAuditSink());
});

describe('setupAuditSinks', () => {
  it('returns a MetricsAuditSink alongside other sinks when no AppSignal/OTEL env vars are set', async () => {
    const env: NodeJS.ProcessEnv = {};
    const setup = await setupAuditSinks(env);
    expect(setup.metrics).toBeInstanceOf(MetricsAuditSink);
    // Stdout-only path: no AppSignal/OTEL appended; MetricsAuditSink is part of fan-out.
    expect(setup.metrics.snapshot()).toEqual([]);
  });

  it('redaction in audit() runs before any sink sees the entry (still true with stdout-only)', () => {
    let captured: string | undefined;
    setAuditSink({
      emit(e) {
        captured = e.argsSummary;
      },
    });
    audit({
      user: 'u',
      kind: 'tool_call',
      target: 'search_standards',
      outcome: 'ok',
      argsSummary: 'q=ping user@talentech.com',
    });
    expect(captured).toBe('q=ping <email>');
  });
});
