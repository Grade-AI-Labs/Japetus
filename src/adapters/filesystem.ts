import { createHash } from 'node:crypto';
import { readFile, stat, readdir, watch } from 'node:fs/promises';
import { FSWatcher, watch as watchSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { upstreamUnavailable } from '../errors.js';
import type {
  FetchResult,
  ResourceHandle,
  SearchHit,
  SourceAdapter,
  Unsubscribe,
} from './types.js';

export interface FilesystemAdapterOptions {
  root: string;
}

export class FilesystemAdapter implements SourceAdapter {
  readonly id = 'filesystem';
  private readonly root: string;

  constructor(options: FilesystemAdapterOptions) {
    this.root = options.root;
  }

  async list(scope?: string): Promise<ResourceHandle[]> {
    const base = scope ? join(this.root, scope) : this.root;
    const results: ResourceHandle[] = [];
    await this.walk(base, async (absPath) => {
      if (!absPath.endsWith('.md')) return;
      const backingId = relative(this.root, absPath).split(sep).join('/');
      const st = await stat(absPath);
      const { title, description } = await readFrontmatter(absPath);
      results.push({
        backingId,
        title: title ?? backingId,
        description,
        updated: st.mtime.toISOString(),
      });
    });
    return results;
  }

  async fetch(backingId: string): Promise<FetchResult> {
    const abs = join(this.root, backingId);
    try {
      const buf = await readFile(abs);
      const st = await stat(abs);
      const content = buf.toString('utf8');
      const etag = hash(buf);
      return { content, etag, updated: st.mtime.toISOString() };
    } catch (err) {
      throw upstreamUnavailable(this.id, (err as Error).message);
    }
  }

  async search(query: string, scope?: string): Promise<SearchHit[]> {
    const q = query.toLowerCase();
    const handles = await this.list(scope);
    const hits: SearchHit[] = [];
    for (const h of handles) {
      const abs = join(this.root, h.backingId);
      const text = (await readFile(abs, 'utf8')).toLowerCase();
      const idx = text.indexOf(q);
      if (idx === -1) continue;
      const start = Math.max(0, idx - 60);
      const snippet = text.slice(start, Math.min(text.length, idx + 140));
      hits.push({
        backingId: h.backingId,
        snippet: snippet.trim(),
        score: 1 / (1 + start),
      });
    }
    return hits.sort((a, b) => b.score - a.score);
  }

  onChange(cb: (handle: ResourceHandle) => void): Unsubscribe {
    const watcher: FSWatcher = watchSync(this.root, { recursive: true }, async (_event, file) => {
      if (!file || !file.toString().endsWith('.md')) return;
      const backingId = file.toString().split(sep).join('/');
      try {
        const abs = join(this.root, backingId);
        const st = await stat(abs);
        const { title, description } = await readFrontmatter(abs);
        cb({
          backingId,
          title: title ?? backingId,
          description,
          updated: st.mtime.toISOString(),
        });
      } catch {
        // file may have been deleted; surface as a list_changed signal only
        cb({ backingId, title: backingId, updated: new Date().toISOString() });
      }
    });
    return () => watcher.close();
  }

  private async walk(dir: string, visit: (abs: string) => Promise<void>): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        await this.walk(abs, visit);
      } else if (entry.isFile()) {
        await visit(abs);
      }
    }
  }
}

function hash(buf: Buffer): string {
  return `"${createHash('sha1').update(buf).digest('hex').slice(0, 16)}"`;
}

async function readFrontmatter(abs: string): Promise<{ title?: string; description?: string }> {
  const text = await readFile(abs, 'utf8');
  if (!text.startsWith('---\n')) return {};
  const end = text.indexOf('\n---', 4);
  if (end === -1) return {};
  const block = text.slice(4, end);
  const out: Record<string, string> = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.+)$/);
    if (!m) continue;
    const [, key, val] = m as unknown as [string, string, string];
    out[key] = val.replace(/^"|"$/g, '').trim();
  }
  return { title: out['title'], description: out['description'] };
}
// node:fs/promises.watch is imported but unused for the recursive watch;
// kept for type sanity if we swap implementations later.
void watch;
