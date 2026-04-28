import type { AuditEntry, AuditSink } from './logger.ts';
import { deriveAdoptionMetrics, type AdoptionMetrics } from './metrics.ts';

const DEFAULT_MAX_ENTRIES = 50_000;

/**
 * In-memory audit-entry store backing the adoption-metrics observable gauges.
 * Bounds memory at `maxEntries` (FIFO eviction). At Japetus's expected
 * traffic (a few thousand calls/day at most), 50k entries spans well over the
 * 30-day MAU window with comfortable headroom.
 */
export class MetricsAuditSink implements AuditSink {
  private readonly entries: AuditEntry[] = [];
  private readonly maxEntries: number;

  constructor(maxEntries: number = DEFAULT_MAX_ENTRIES) {
    this.maxEntries = maxEntries;
  }

  emit(entry: AuditEntry): void {
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  snapshot(): AuditEntry[] {
    return [...this.entries];
  }

  derive(now: Date = new Date()): AdoptionMetrics {
    return deriveAdoptionMetrics(this.entries, now);
  }
}
