import type { AuditEntry, AuditSink } from './logger.ts';

/**
 * Minimal interface so callers can substitute a stub in tests; production wires
 * a thin shim around the AppSignal Node SDK in `setupSinks`.
 */
export interface AppSignalClient {
  sendIncrement(name: string, value?: number, tags?: Record<string, string>): void;
  sendDistribution(name: string, value: number, tags?: Record<string, string>): void;
}

/**
 * AuditSink that emits operational counters/distributions to AppSignal. Names
 * follow the `japetus.*` namespace convention.
 */
export class AppSignalAuditSink implements AuditSink {
  private readonly client: AppSignalClient;

  constructor(client: AppSignalClient) {
    this.client = client;
  }

  emit(entry: AuditEntry): void {
    const tags: Record<string, string> = {
      kind: entry.kind,
      target: entry.target,
      outcome: entry.outcome,
    };
    this.client.sendIncrement(`japetus.audit.${entry.kind}`, 1, tags);
    if (typeof entry.latencyMs === 'number') {
      this.client.sendDistribution(`japetus.audit.${entry.kind}.latency_ms`, entry.latencyMs, tags);
    }
    if (entry.outcome === 'error') {
      this.client.sendIncrement('japetus.audit.errors', 1, {
        ...tags,
        errorCode: String(entry.errorCode ?? 'unknown'),
      });
    }
  }
}

/**
 * Build an AppSignalClient backed by the real SDK if the push API key is
 * configured; otherwise return undefined. Imports are dynamic so test
 * environments without `@appsignal/nodejs` configured don't pay the SDK init
 * cost or trigger network setup.
 */
export async function createAppSignalClient(
  env: NodeJS.ProcessEnv = process.env,
): Promise<AppSignalClient | undefined> {
  const key = env['APPSIGNAL_PUSH_API_KEY'];
  if (!key) return undefined;
  const mod = (await import('@appsignal/nodejs')) as {
    Appsignal: new (config: { active: boolean; pushApiKey: string; name?: string }) => {
      metrics(): { incrementCounter: Function; addDistributionValue: Function };
    };
  };
  const client = new mod.Appsignal({
    active: true,
    pushApiKey: key,
    name: env['APPSIGNAL_APP_NAME'] ?? 'japetus',
  });
  const m = client.metrics();
  return {
    sendIncrement(name, value = 1, tags = {}) {
      m.incrementCounter(name, value, tags);
    },
    sendDistribution(name, value, tags = {}) {
      m.addDistributionValue(name, value, tags);
    },
  };
}
