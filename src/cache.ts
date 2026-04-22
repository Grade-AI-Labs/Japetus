import type { FetchResult } from './adapters/types.js';

interface CacheEntry {
  result: FetchResult;
  expiresAt: number;
}

export interface CacheOptions {
  ttlMs?: number;
}

export class ResourceCache {
  private readonly store = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(options: CacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 5 * 60_000;
  }

  get(uri: string): FetchResult | undefined {
    const e = this.store.get(uri);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.store.delete(uri);
      return undefined;
    }
    return e.result;
  }

  set(uri: string, result: FetchResult): void {
    this.store.set(uri, { result, expiresAt: Date.now() + this.ttlMs });
  }

  invalidate(uri: string): void {
    this.store.delete(uri);
  }

  clear(): void {
    this.store.clear();
  }
}
