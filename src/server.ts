import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  type ServerRequest,
  type ServerNotification,
} from '@modelcontextprotocol/sdk/types.js';
import { FilesystemAdapter } from './adapters/filesystem.js';
import { ConfluenceAdapter } from './adapters/confluence.js';
import { Registry, type ResourceEntry } from './registry.js';
import { ResourceCache } from './cache.js';
import { audit } from './audit/logger.js';
import { requireScope, type Principal, type Scope, kbScopeFor } from './auth/scopes.js';
import { DevValidator, EntraJwtValidator, type EntraValidator } from './auth/entra.js';
import { resourceNotFound } from './errors.js';
import { seedRegistry } from './seed.js';
import { registerSearchStandards } from './tools/search_standards.js';
import { registerGetResource } from './tools/get_resource.js';
import { registerCurrentStandard } from './tools/current_standard.js';
import { registerSearchDocs } from './tools/search_docs.js';
import { registerWhoOwns } from './tools/who_owns.js';
import { registerWritePrd } from './prompts/write_prd.js';
import { registerReviewPr } from './prompts/review_pr.js';
import { registerWriteRfc } from './prompts/write_rfc.js';
import { registerWriteAdr } from './prompts/write_adr.js';
import { registerIncidentPostmortem } from './prompts/incident_postmortem.js';
import { registerOnboardRepo } from './prompts/onboard_repo.js';
import type { Space } from './adapters/types.js';
import type { SourceAdapter } from './adapters/types.js';
import { startHttpServer } from './transport.js';
import { startStalenessServer } from './staleness.js';

export type McpExtra = RequestHandlerExtra<ServerRequest, ServerNotification>;

export interface AppContext {
  registry: Registry;
  cache: ResourceCache;
}

export function buildServer(ctx: AppContext): McpServer {
  const server = new McpServer(
    { name: 'grade-standards', version: '0.1.0' },
    { capabilities: { resources: { listChanged: true }, tools: {}, prompts: {}, logging: {} } },
  );

  registerResourceHandlers(server, ctx);

  registerSearchStandards(server, ctx);
  registerGetResource(server, ctx);
  registerCurrentStandard(server, ctx);
  registerSearchDocs(server, ctx);
  registerWhoOwns(server);

  registerWritePrd(server);
  registerReviewPr(server);
  registerWriteRfc(server);
  registerWriteAdr(server);
  registerIncidentPostmortem(server);
  registerOnboardRepo(server);

  wireChangeNotifications(server, ctx);
  return server;
}

function registerResourceHandlers(server: McpServer, ctx: AppContext): void {
  const lowLevel = server.server;

  lowLevel.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: ctx.registry.list().map((entry) => {
      const annotations: {
        audience: Array<'assistant' | 'user'>;
        priority?: number;
      } = { audience: ['assistant'] };
      if (entry.priority !== undefined) annotations.priority = entry.priority;
      return {
        uri: entry.uri,
        name: entry.name,
        description: entry.description,
        mimeType: entry.mimeType ?? 'text/markdown',
        annotations,
      };
    }),
  }));

  lowLevel.setRequestHandler(ReadResourceRequestSchema, async (request, extra) => {
    const uri = request.params.uri;
    const entry: ResourceEntry = ctx.registry.resolve(uri); // throws -32002 if unknown
    const principal = principalFromExtra(extra as McpExtra);
    if (principal) requireScope(principal, scopeForEntry(entry), entry.uri);
    const started = Date.now();
    let cacheHit = false;
    try {
      const cached = ctx.cache.get(entry.uri);
      let result;
      if (cached) {
        cacheHit = true;
        result = cached;
      } else {
        const adapter = ctx.registry.getAdapter(entry.adapterId);
        if (!adapter) throw resourceNotFound(entry.uri);
        result = await adapter.fetch(entry.backingId);
        ctx.cache.set(entry.uri, result);
      }
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'resource_read',
        target: entry.uri,
        outcome: 'ok',
        latencyMs: Date.now() - started,
        cacheHit,
      });
      return {
        contents: [
          {
            uri: entry.uri,
            mimeType: entry.mimeType ?? 'text/markdown',
            text: result.content,
            _meta: { etag: result.etag, lastModified: result.updated, owner: entry.owner },
          },
        ],
      };
    } catch (err) {
      audit({
        user: principal?.sub ?? 'anonymous',
        kind: 'resource_read',
        target: entry.uri,
        outcome: 'error',
        latencyMs: Date.now() - started,
        errorCode: (err as { code?: number }).code,
      });
      throw err;
    }
  });
}

function scopeForEntry(entry: ResourceEntry): Scope {
  if (entry.uri.startsWith('catalog://')) return 'catalog:read';
  if (entry.uri.startsWith('docs://') && entry.space) return kbScopeFor(entry.space);
  return 'standards:read';
}

export function principalFromExtra(extra: McpExtra): Principal | undefined {
  const auth = extra.authInfo as AuthInfo | undefined;
  if (!auth) return undefined;
  const xt = auth.extra as { tokenKind?: 'user' | 'client_credentials'; sub?: string } | undefined;
  return {
    sub: xt?.sub ?? auth.clientId,
    scopes: new Set(auth.scopes),
    tokenKind: xt?.tokenKind ?? 'user',
  };
}

function wireChangeNotifications(server: McpServer, ctx: AppContext): void {
  for (const adapter of ctx.registry.listAdapters()) {
    if (!adapter.onChange) continue;
    adapter.onChange((handle) => {
      for (const e of ctx.registry.list()) {
        if (e.adapterId === adapter.id && e.backingId === handle.backingId) {
          ctx.cache.invalidate(e.uri);
        }
      }
      server.sendResourceListChanged();
    });
  }
}

function buildAdapters(): SourceAdapter[] {
  const adapters: SourceAdapter[] = [];
  const contentDir = process.env['CONTENT_DIR'] ?? resolve(process.cwd(), 'content');
  adapters.push(new FilesystemAdapter({ root: contentDir }));

  if (
    process.env['CONFLUENCE_BASE_URL'] &&
    process.env['CONFLUENCE_EMAIL'] &&
    process.env['CONFLUENCE_API_TOKEN']
  ) {
    const spaceKeys: Record<Space, string> = {
      ENG: process.env['CONFLUENCE_SPACE_ENG'] ?? 'ENG',
      PRODUCT: process.env['CONFLUENCE_SPACE_PRODUCT'] ?? 'PRODUCT',
      SEC: process.env['CONFLUENCE_SPACE_SEC'] ?? 'SEC',
    };
    adapters.push(
      new ConfluenceAdapter({
        baseUrl: process.env['CONFLUENCE_BASE_URL']!,
        email: process.env['CONFLUENCE_EMAIL']!,
        apiToken: process.env['CONFLUENCE_API_TOKEN']!,
        spaceKeys,
      }),
    );
  }
  return adapters;
}

function buildValidator(): EntraValidator | undefined {
  const mode = process.env['AUTH_MODE'] ?? 'dev';
  if (mode === 'dev') return new DevValidator();
  if (mode === 'off') return undefined;
  if (mode === 'entra') {
    const tenantId = process.env['ENTRA_TENANT_ID'];
    const audience = process.env['ENTRA_AUDIENCE'];
    if (!tenantId || !audience) {
      throw new Error('AUTH_MODE=entra requires ENTRA_TENANT_ID and ENTRA_AUDIENCE');
    }
    return new EntraJwtValidator({ tenantId, audience });
  }
  throw new Error(`Unknown AUTH_MODE: ${mode}`);
}

export async function main(): Promise<void> {
  const registry = new Registry();
  const cache = new ResourceCache({ ttlMs: 5 * 60_000 });
  for (const a of buildAdapters()) registry.registerAdapter(a);
  seedRegistry(registry);

  const server = buildServer({ registry, cache });
  const http = await startHttpServer({
    server,
    validator: buildValidator(),
    port: Number(process.env['PORT'] ?? 3333),
  });
  console.error(`grade-standards listening on ${http.url}`);

  if (process.env['STALENESS_PORT']) {
    const s = startStalenessServer({
      registry,
      port: Number(process.env['STALENESS_PORT']),
    });
    console.error(`staleness dashboard on ${s.url}`);
  }
}

const entry = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(entry)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
