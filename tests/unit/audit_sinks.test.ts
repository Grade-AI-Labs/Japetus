import { describe, expect, it, vi } from 'vitest';
import type { AuditEntry, AuditSink } from '../../src/audit/logger.ts';
import { MultiSink } from '../../src/audit/multi.ts';
import { AppSignalAuditSink, type AppSignalClient } from '../../src/audit/appsignal.ts';
import { OtelAuditSink, type OtelInstruments } from '../../src/audit/otel.ts';

const baseEntry: AuditEntry = {
  ts: '2026-04-28T00:00:00.000Z',
  user: 'u',
  kind: 'tool_call',
  target: 'search_standards',
  outcome: 'ok',
  latencyMs: 12,
};

class CapturingSink implements AuditSink {
  readonly entries: AuditEntry[] = [];
  emit(e: AuditEntry): void {
    this.entries.push(e);
  }
}

describe('MultiSink fan-out', () => {
  it('forwards each entry to every sink', () => {
    const a = new CapturingSink();
    const b = new CapturingSink();
    const multi = new MultiSink([a, b]);
    multi.emit(baseEntry);
    expect(a.entries).toEqual([baseEntry]);
    expect(b.entries).toEqual([baseEntry]);
  });

  it('a failing sink does not block other sinks', () => {
    const failing: AuditSink = {
      emit() {
        throw new Error('boom');
      },
    };
    const ok = new CapturingSink();
    const multi = new MultiSink([failing, ok]);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => multi.emit(baseEntry)).not.toThrow();
    expect(ok.entries).toEqual([baseEntry]);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});

describe('AppSignalAuditSink', () => {
  it('emits an increment per entry, plus a distribution when latency is present', () => {
    const client: AppSignalClient = {
      sendIncrement: vi.fn(),
      sendDistribution: vi.fn(),
    };
    const sink = new AppSignalAuditSink(client);
    sink.emit(baseEntry);
    expect(client.sendIncrement).toHaveBeenCalledWith(
      'japetus.audit.tool_call',
      1,
      expect.objectContaining({ kind: 'tool_call', outcome: 'ok' }),
    );
    expect(client.sendDistribution).toHaveBeenCalledWith(
      'japetus.audit.tool_call.latency_ms',
      12,
      expect.any(Object),
    );
  });

  it('emits an error increment on outcome=error', () => {
    const client: AppSignalClient = {
      sendIncrement: vi.fn(),
      sendDistribution: vi.fn(),
    };
    const sink = new AppSignalAuditSink(client);
    sink.emit({ ...baseEntry, outcome: 'error', errorCode: 1001 });
    expect(client.sendIncrement).toHaveBeenCalledWith(
      'japetus.audit.errors',
      1,
      expect.objectContaining({ errorCode: '1001' }),
    );
  });
});

describe('OtelAuditSink', () => {
  it('records counter + histogram + error counter', () => {
    const instruments: OtelInstruments = {
      callCounter: { add: vi.fn() },
      errorCounter: { add: vi.fn() },
      latencyHistogram: { record: vi.fn() },
    };
    const sink = new OtelAuditSink(instruments);
    sink.emit(baseEntry);
    expect(instruments.callCounter.add).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ kind: 'tool_call', outcome: 'ok' }),
    );
    expect(instruments.latencyHistogram.record).toHaveBeenCalledWith(12, expect.any(Object));

    sink.emit({ ...baseEntry, outcome: 'error', errorCode: 1002 });
    expect(instruments.errorCounter.add).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ errorCode: '1002' }),
    );
  });
});
