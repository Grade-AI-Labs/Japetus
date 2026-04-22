import { resourceNotFound } from './errors.ts';
import type { SourceAdapter, Space } from './adapters/types.ts';

export type ResourceKind = 'conventions' | 'runbooks' | 'templates' | 'catalog' | 'docs';

export interface ResourceEntry {
  uri: string;
  adapterId: string;
  backingId: string;
  name: string;
  description: string;
  owner?: string;
  product?: string;
  space?: Space;
  supersedes?: string[];
  priority?: number;
  topics?: string[];
  mimeType?: string;
}

export class Registry {
  private readonly adapters = new Map<string, SourceAdapter>();
  private readonly entries = new Map<string, ResourceEntry>();
  private readonly supersededBy = new Map<string, string>();

  registerAdapter(adapter: SourceAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  getAdapter(id: string): SourceAdapter | undefined {
    return this.adapters.get(id);
  }

  listAdapters(): SourceAdapter[] {
    return [...this.adapters.values()];
  }

  register(entry: ResourceEntry): void {
    this.entries.set(entry.uri, entry);
    for (const from of entry.supersedes ?? []) {
      this.supersededBy.set(from, entry.uri);
    }
  }

  list(): ResourceEntry[] {
    return [...this.entries.values()];
  }

  resolve(uri: string): ResourceEntry {
    const canonical = this.canonical(uri);
    const entry = this.entries.get(canonical);
    if (!entry) throw resourceNotFound(uri);
    return entry;
  }

  /**
   * Follow supersedes chains to the current canonical URI. Used by current_standard.
   */
  canonical(uri: string): string {
    const seen = new Set<string>();
    let cur = uri;
    while (this.supersededBy.has(cur)) {
      if (seen.has(cur)) break;
      seen.add(cur);
      cur = this.supersededBy.get(cur)!;
    }
    return cur;
  }

  findByTopic(topic: string): ResourceEntry | undefined {
    const t = topic.toLowerCase();
    return this.list().find(
      (e) =>
        e.topics?.some((x) => x.toLowerCase() === t) ||
        e.name.toLowerCase().includes(t) ||
        e.uri.toLowerCase().includes(t),
    );
  }
}
