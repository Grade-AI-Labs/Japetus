import { readCounts } from '../staleness.ts';

export interface AuditEntry {
  ts: string;
  user: string;
  kind: 'tool_call' | 'resource_read';
  target: string;
  outcome: 'ok' | 'error';
  latencyMs?: number;
  cacheHit?: boolean;
  errorCode?: number;
  argsSummary?: string;
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

export function audit(entry: Omit<AuditEntry, 'ts'>): void {
  sink.emit({ ts: new Date().toISOString(), ...entry });
  if (entry.kind === 'resource_read' && entry.outcome === 'ok') {
    readCounts.set(entry.target, (readCounts.get(entry.target) ?? 0) + 1);
  }
}
