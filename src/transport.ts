import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { EntraValidator } from './auth/entra.ts';
import { UnauthorizedError } from './auth/entra.ts';

export interface TransportOptions {
  /**
   * Factory that returns a fresh `McpServer` instance per MCP session. The
   * underlying SDK `Server` tracks initialization state per instance and a
   * single instance can only be initialized once, so multi-client deployments
   * must mint one per session.
   */
  buildServer: () => McpServer;
  validator: EntraValidator | undefined;
  path?: string;
  port?: number;
  host?: string;
}

export interface StartedServer {
  url: string;
  close(): Promise<void>;
}

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  server: McpServer;
}

export async function startHttpServer(options: TransportOptions): Promise<StartedServer> {
  const path = options.path ?? '/mcp';
  const port = options.port ?? 3333;
  const host = options.host ?? '0.0.0.0';

  const sessions = new Map<string, SessionEntry>();

  const http = createServer(async (req, res) => {
    if (req.url && req.url.startsWith('/healthz')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    if (!req.url || !req.url.startsWith(path)) {
      res.writeHead(404);
      res.end();
      return;
    }
    try {
      const auth = await resolveAuth(req, options.validator);
      const withAuth = req as IncomingMessage & { auth?: AuthInfo };
      withAuth.auth = auth;
      const body = await readBody(req);
      const sessionId = headerValue(req.headers['mcp-session-id']);
      let entry = sessionId ? sessions.get(sessionId) : undefined;
      if (!entry) {
        entry = await openSession(options, sessions);
      }
      await entry.transport.handleRequest(withAuth, res, body);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        writeWwwAuth(res, 401, err.message);
      } else {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: (err as Error).message }));
      }
    }
  });

  await new Promise<void>((resolve) => http.listen(port, host, resolve));
  const addr = http.address();
  const actualPort = typeof addr === 'object' && addr ? addr.port : port;
  const hostForUrl = host === '0.0.0.0' || host === '::' ? '127.0.0.1' : host;
  return {
    url: `http://${hostForUrl}:${actualPort}${path}`,
    async close() {
      await new Promise<void>((resolve, reject) =>
        http.close((err) => (err ? reject(err) : resolve())),
      );
      for (const { server } of sessions.values()) {
        await server.close().catch(() => {});
      }
      sessions.clear();
    },
  };
}

async function openSession(
  options: TransportOptions,
  sessions: Map<string, SessionEntry>,
): Promise<SessionEntry> {
  const server = options.buildServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId) => {
      sessions.set(sessionId, { transport, server });
    },
  });
  await server.connect(transport);
  // The SDK's `Server.connect` installs its own `transport.onclose`. Wrap it
  // so we also evict the session entry. Do NOT call `server.close()` here —
  // it would cascade back into `transport.close()` and recurse.
  const sdkOnClose = transport.onclose;
  transport.onclose = () => {
    const id = transport.sessionId;
    if (id) sessions.delete(id);
    sdkOnClose?.call(transport);
  };
  return { transport, server };
}

async function resolveAuth(
  req: IncomingMessage,
  validator: EntraValidator | undefined,
): Promise<AuthInfo | undefined> {
  if (!validator) return undefined;
  const header = req.headers['authorization'];
  if (!header) throw new UnauthorizedError('Missing Authorization header');
  const principal = await validator.validate(Array.isArray(header) ? header[0]! : header);
  return {
    token: 'redacted',
    clientId: principal.sub,
    scopes: [...principal.scopes],
    extra: { tokenKind: principal.tokenKind, sub: principal.sub },
  };
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  if (req.method === 'GET' || req.method === 'DELETE') return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return undefined;
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function headerValue(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function writeWwwAuth(res: ServerResponse, status: number, detail: string): void {
  res.writeHead(status, {
    'content-type': 'application/json',
    'www-authenticate': `Bearer error="invalid_token", error_description="${detail.replace(/"/g, '')}"`,
  });
  res.end(JSON.stringify({ error: detail }));
}
