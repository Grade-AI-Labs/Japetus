import type { AuditEntry, AuditSink } from './logger.ts';
import type { AdoptionMetrics } from './metrics.ts';

/**
 * Minimal counter/histogram interface so the sink can be exercised in tests
 * with stub instruments without requiring the full OpenTelemetry SDK.
 */
export interface OtelInstruments {
  callCounter: { add(value: number, attributes?: Record<string, string>): void };
  errorCounter: { add(value: number, attributes?: Record<string, string>): void };
  latencyHistogram: { record(value: number, attributes?: Record<string, string>): void };
}

/**
 * AuditSink that emits OTEL counters + a latency histogram on every entry.
 * Counters are named with the `japetus.audit.*` namespace; the metrics module
 * (slice 28) layers adoption-specific counters on top of the same audit
 * stream.
 */
export class OtelAuditSink implements AuditSink {
  private readonly instruments: OtelInstruments;

  constructor(instruments: OtelInstruments) {
    this.instruments = instruments;
  }

  emit(entry: AuditEntry): void {
    const attrs = {
      kind: entry.kind,
      target: entry.target,
      outcome: entry.outcome,
    };
    this.instruments.callCounter.add(1, attrs);
    if (typeof entry.latencyMs === 'number') {
      this.instruments.latencyHistogram.record(entry.latencyMs, attrs);
    }
    if (entry.outcome === 'error') {
      this.instruments.errorCounter.add(1, {
        ...attrs,
        errorCode: String(entry.errorCode ?? 'unknown'),
      });
    }
  }
}

/**
 * Build OTEL instruments backed by the real SDK if `OTEL_EXPORTER_OTLP_ENDPOINT`
 * is set; otherwise return undefined. The MeterProvider, exporter, and reader
 * are constructed once and live for the process lifetime.
 */
export async function createOtelInstruments(
  env: NodeJS.ProcessEnv = process.env,
): Promise<OtelInstruments | undefined> {
  if (!env['OTEL_EXPORTER_OTLP_ENDPOINT']) return undefined;
  const apiMod = await import('@opentelemetry/api');
  const sdkMod = await import('@opentelemetry/sdk-metrics');
  const exporterMod = await import('@opentelemetry/exporter-metrics-otlp-http');
  const resourcesMod = await import('@opentelemetry/resources');

  const exporter = new exporterMod.OTLPMetricExporter();
  const reader = new sdkMod.PeriodicExportingMetricReader({ exporter });
  const provider = new sdkMod.MeterProvider({
    readers: [reader],
    resource: resourcesMod.resourceFromAttributes({ 'service.name': 'japetus' }),
  });
  apiMod.metrics.setGlobalMeterProvider(provider);
  const meter = apiMod.metrics.getMeter('japetus');
  return {
    callCounter: meter.createCounter('japetus.audit.calls', {
      description: 'Count of audit entries emitted by Japetus.',
    }),
    errorCounter: meter.createCounter('japetus.audit.errors', {
      description: 'Count of audit entries with outcome=error.',
    }),
    latencyHistogram: meter.createHistogram('japetus.audit.latency_ms', {
      description: 'Latency in ms for audited tool calls and resource reads.',
      unit: 'ms',
    }),
  };
}

/**
 * Register OTEL observable gauges that read adoption-metric values from the
 * provided callback (typically `MetricsAuditSink.derive`). Called at most once
 * per process; if OTEL isn't configured the function is a no-op.
 */
export async function registerAdoptionGauges(
  env: NodeJS.ProcessEnv,
  read: () => AdoptionMetrics,
): Promise<void> {
  if (!env['OTEL_EXPORTER_OTLP_ENDPOINT']) return;
  const apiMod = await import('@opentelemetry/api');
  const meter = apiMod.metrics.getMeter('japetus');

  meter
    .createObservableGauge('japetus.users.active', {
      description: 'Distinct users (sub) over a rolling 30-day window.',
    })
    .addCallback((result) => {
      result.observe(read().distinctActiveUsersMau);
    });

  meter
    .createObservableGauge('japetus.calls.total', {
      description: 'Total tool calls in the most recent ISO week.',
    })
    .addCallback((result) => {
      const m = read();
      const week = currentIsoWeek();
      const bucket = m.callsPerUserPerWeek[week] ?? {};
      const total = Object.values(bucket).reduce((a, b) => a + b, 0);
      result.observe(total);
    });

  meter
    .createObservableGauge('japetus.users.firstseen', {
      description: 'First-seen sub count for the most recent ISO week.',
    })
    .addCallback((result) => {
      const week = currentIsoWeek();
      result.observe(read().firstSeenPerWeek[week] ?? 0);
    });

  meter
    .createObservableGauge('japetus.clients.distinct', {
      description: 'Distinct sub × clientName × clientVersion triples.',
    })
    .addCallback((result) => {
      result.observe(read().distinctSubClientVersion);
    });
}

function currentIsoWeek(): string {
  // Local re-import to avoid a hard dep cycle at top level.
  const d = new Date();
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() === 0 ? 7 : date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const year = date.getUTCFullYear();
  const yearStart = Date.UTC(year, 0, 1);
  const weekNum = Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}
