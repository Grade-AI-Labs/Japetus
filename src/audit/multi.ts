import type { AuditEntry, AuditSink } from './logger.ts';

/**
 * Composite sink that fans out every entry to all configured sinks. A failure
 * in one sink is logged to stderr and does NOT crash the server or block other
 * sinks (PRD §4.8 requirement).
 */
export class MultiSink implements AuditSink {
  private readonly sinks: AuditSink[];

  constructor(sinks: AuditSink[]) {
    this.sinks = sinks;
  }

  emit(entry: AuditEntry): void {
    for (const sink of this.sinks) {
      try {
        sink.emit(entry);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[audit] sink failed: ${(err as Error).message ?? String(err)}`);
      }
    }
  }
}
