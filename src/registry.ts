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
  /** URIs that resolve to this entry. Replaces / generalizes the legacy `supersedes` field. */
  aliases?: string[];
  /** Legacy: URIs that this entry supersedes. Treated equivalently to `aliases`. */
  supersedes?: string[];
  priority?: number;
  topics?: string[];
  mimeType?: string;
}

export class Registry {
  private readonly adapters = new Map<string, SourceAdapter>();
  private readonly entries = new Map<string, ResourceEntry>();
  private readonly aliasOf = new Map<string, string>();

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
    if (this.aliasOf.has(entry.uri)) {
      throw new Error(
        `Registry alias collision: '${entry.uri}' is already an alias for '${this.aliasOf.get(entry.uri)}'`,
      );
    }
    this.entries.set(entry.uri, entry);
    const aliases = [...(entry.aliases ?? []), ...(entry.supersedes ?? [])];
    for (const alias of aliases) {
      const existingAlias = this.aliasOf.get(alias);
      if (existingAlias && existingAlias !== entry.uri) {
        throw new Error(
          `Registry alias collision: '${alias}' is already an alias for '${existingAlias}'`,
        );
      }
      if (this.entries.has(alias) && alias !== entry.uri) {
        throw new Error(`Registry alias collision: '${alias}' is already a canonical URI`);
      }
      this.aliasOf.set(alias, entry.uri);
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
   * Follow alias / supersedes links to the current canonical URI.
   */
  canonical(uri: string): string {
    const seen = new Set<string>();
    let cur = uri;
    while (this.aliasOf.has(cur)) {
      if (seen.has(cur)) break;
      seen.add(cur);
      cur = this.aliasOf.get(cur)!;
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
