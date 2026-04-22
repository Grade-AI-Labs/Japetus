import { upstreamUnavailable } from '../errors.js';
import type {
  FetchResult,
  ResourceHandle,
  SearchHit,
  SourceAdapter,
  Space,
  Unsubscribe,
} from './types.js';

export interface ConfluenceAdapterOptions {
  baseUrl: string;
  email: string;
  apiToken: string;
  spaceKeys: Record<Space, string>;
  pollIntervalMs?: number;
}

interface ConfluencePage {
  id: string;
  title: string;
  spaceId: string;
  version: { number: number; createdAt: string };
  body?: { storage?: { value: string } };
}

export class ConfluenceAdapter implements SourceAdapter {
  readonly id = 'confluence';
  private readonly baseUrl: string;
  private readonly authHeader: string;
  private readonly spaceKeys: Record<Space, string>;
  private readonly pollIntervalMs: number;

  constructor(options: ConfluenceAdapterOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    const creds = Buffer.from(`${options.email}:${options.apiToken}`).toString('base64');
    this.authHeader = `Basic ${creds}`;
    this.spaceKeys = options.spaceKeys;
    this.pollIntervalMs = options.pollIntervalMs ?? 60_000;
  }

  async list(scope?: string): Promise<ResourceHandle[]> {
    const spaces = scope ? [scope] : Object.keys(this.spaceKeys);
    const out: ResourceHandle[] = [];
    for (const s of spaces) {
      const key = this.spaceKeys[s as Space];
      if (!key) continue;
      const pages = await this.api<{ results: ConfluencePage[] }>(
        `/wiki/api/v2/spaces/${key}/pages?limit=250`,
      );
      for (const p of pages.results) {
        out.push({
          backingId: p.id,
          title: p.title,
          updated: p.version.createdAt,
          space: s as Space,
        });
      }
    }
    return out;
  }

  async fetch(backingId: string): Promise<FetchResult> {
    const page = await this.api<ConfluencePage>(
      `/wiki/api/v2/pages/${backingId}?body-format=storage`,
    );
    const storage = page.body?.storage?.value ?? '';
    const content = storageToMarkdown(storage);
    return {
      content,
      etag: `"v${page.version.number}"`,
      updated: page.version.createdAt,
    };
  }

  async search(query: string, scope?: string): Promise<SearchHit[]> {
    const spaceFilter = scope
      ? ` AND space.key="${this.spaceKeys[scope as Space] ?? ''}"`
      : ` AND (${Object.values(this.spaceKeys)
          .map((k) => `space.key="${k}"`)
          .join(' OR ')})`;
    const cql = `text ~ "${query.replace(/"/g, '')}" AND type=page${spaceFilter}`;
    const result = await this.api<{ results: Array<{ content: { id: string }; excerpt: string }> }>(
      `/wiki/rest/api/search?cql=${encodeURIComponent(cql)}&limit=20`,
    );
    return result.results.map((r, i) => ({
      backingId: r.content.id,
      snippet: stripHtml(r.excerpt),
      score: 1 / (1 + i),
    }));
  }

  onChange(cb: (handle: ResourceHandle) => void): Unsubscribe {
    const lastSeen = new Map<string, string>();
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      try {
        const handles = await this.list();
        for (const h of handles) {
          const prev = lastSeen.get(h.backingId);
          if (prev !== h.updated) {
            lastSeen.set(h.backingId, h.updated);
            if (prev !== undefined) cb(h);
          }
        }
      } catch {
        // swallow; next tick will retry
      }
      if (!cancelled) setTimeout(tick, this.pollIntervalMs);
    };
    void tick();
    return () => {
      cancelled = true;
    };
  }

  private async api<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { Authorization: this.authHeader, Accept: 'application/json' },
      });
    } catch (err) {
      throw upstreamUnavailable(this.id, (err as Error).message);
    }
    if (!res.ok) {
      throw upstreamUnavailable(this.id, `${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  }
}

function storageToMarkdown(storage: string): string {
  // Minimal MVP conversion. A production path should use a proper parser.
  return storage
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, lvl, inner) => {
      const level = Number(lvl);
      return `\n${'#'.repeat(level)} ${stripHtml(inner).trim()}\n`;
    })
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, inner) => `\n${stripHtml(inner).trim()}\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner) => `- ${stripHtml(inner).trim()}\n`)
    .replace(/<\/?ul[^>]*>/gi, '\n')
    .replace(/<\/?ol[^>]*>/gi, '\n')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, inner) => '`' + stripHtml(inner) + '`')
    .replace(
      /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
      (_m, inner) => `\n\`\`\`\n${stripHtml(inner)}\n\`\`\`\n`,
    )
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
