import { createServer } from 'node:http';
import type { Registry } from './registry.ts';

export interface StalenessOptions {
  registry: Registry;
  port: number;
  thresholdDays?: number;
}

export interface StalenessHandle {
  url: string;
  close(): Promise<void>;
}

/**
 * Minimal HTTP dashboard exposing per-resource ownership + age.
 * Read counts are kept in memory from audit events; wire the real audit
 * sink to this for cross-process data.
 */
export const readCounts = new Map<string, number>();

export function startStalenessServer(options: StalenessOptions): StalenessHandle {
  const threshold = (options.thresholdDays ?? 90) * 24 * 60 * 60 * 1000;

  const http = createServer(async (_req, res) => {
    const rows = options.registry.list().map((entry) => {
      const adapter = options.registry.getAdapter(entry.adapterId);
      let updated: string | undefined;
      if (adapter) {
        // best-effort: list() is cheap for the filesystem adapter; Confluence list is cached.
        updated = undefined;
      }
      return {
        uri: entry.uri,
        owner: entry.owner ?? 'unassigned',
        updated,
        stale: false,
        reads: readCounts.get(entry.uri) ?? 0,
      };
    });
    // Decorate with actual mtimes on demand.
    for (const row of rows) {
      const e = options.registry.resolve(row.uri);
      const adapter = options.registry.getAdapter(e.adapterId);
      if (!adapter) continue;
      try {
        const r = await adapter.fetch(e.backingId);
        row.updated = r.updated;
        row.stale = Date.now() - Date.parse(r.updated) > threshold;
      } catch {
        // skip
      }
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({ thresholdDays: options.thresholdDays ?? 90, resources: rows }, null, 2),
    );
  });

  http.listen(options.port);
  return {
    url: `http://localhost:${options.port}`,
    async close() {
      await new Promise<void>((resolve, reject) =>
        http.close((err) => (err ? reject(err) : resolve())),
      );
    },
  };
}
