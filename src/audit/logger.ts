import { readCounts } from '../staleness.ts';
import { redact } from './redact.ts';

export interface AuditEntry {
  ts: string;
  user: string;
  kind: 'tool_call' | 'resource_read' | 'session_start';
  target: string;
  outcome: 'ok' | 'error';
  latencyMs?: number;
  cacheHit?: boolean;
  errorCode?: number;
  argsSummary?: string;
  /** Captured at MCP initialize and emitted with session_start. */
  clientName?: string;
  clientVersion?: string;
}

export interface AuditSink {
  emit(entry: AuditEntry): void;
}

export class StdoutAuditSink implements AuditSink {
  emit(entry: AuditEntry): void {
    process.stdout.write(JSON.stringify({ audit: entry }) + '\n');
  }
}

let sink: AuditSink = new StdoutAuditSink();

export function setAuditSink(s: AuditSink): void {
  sink = s;
}

export function getAuditSink(): AuditSink {
  return sink;
}

export function audit(entry: Omit<AuditEntry, 'ts'>): void {
  const redacted = redact({ ts: new Date().toISOString(), ...entry });
  sink.emit(redacted);
  if (redacted.kind === 'resource_read' && redacted.outcome === 'ok') {
    readCounts.set(redacted.target, (readCounts.get(redacted.target) ?? 0) + 1);
  }
}
