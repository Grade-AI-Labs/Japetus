import { setAuditSink, StdoutAuditSink, type AuditSink } from './logger.ts';
import { MultiSink } from './multi.ts';
import { AppSignalAuditSink, createAppSignalClient } from './appsignal.ts';
import { OtelAuditSink, createOtelInstruments, registerAdoptionGauges } from './otel.ts';
import { MetricsAuditSink } from './metrics_sink.ts';

export interface AuditSetup {
  sink: AuditSink;
  metrics: MetricsAuditSink;
}

/**
 * Configure audit sinks for the running process. Stdout is always included.
 * AppSignal and OTEL are layered on when their respective env vars are set;
 * absence is silently fine, so dev and CI keep their stdout-only behaviour.
 *
 * The `MetricsAuditSink` always runs alongside other sinks — it backs the
 * adoption-metrics OTEL observable gauges (when OTEL is configured) and is
 * available for tests/diagnostics directly.
 */
export async function setupAuditSinks(env: NodeJS.ProcessEnv = process.env): Promise<AuditSetup> {
  const metrics = new MetricsAuditSink();
  const sinks: AuditSink[] = [new StdoutAuditSink(), metrics];

  const appsignal = await createAppSignalClient(env);
  if (appsignal) sinks.push(new AppSignalAuditSink(appsignal));

  const otel = await createOtelInstruments(env);
  if (otel) {
    sinks.push(new OtelAuditSink(otel));
    await registerAdoptionGauges(env, () => metrics.derive());
  }

  const sink = new MultiSink(sinks);
  setAuditSink(sink);
  return { sink, metrics };
}
