import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { EntraValidator } from './auth/entra.ts';
import { UnauthorizedError } from './auth/entra.ts';

export interface TransportOptions {
  server: McpServer;
  validator: EntraValidator | undefined;
  path?: string;
  port?: number;
  host?: string;
}

export interface StartedServer {
  url: string;
  close(): Promise<void>;
}

export async function startHttpServer(options: TransportOptions): Promise<StartedServer> {
  const path = options.path ?? '/mcp';
  const port = options.port ?? 3333;
  const host = options.host ?? '0.0.0.0';

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  await options.server.connect(transport);

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
      await transport.handleRequest(withAuth, res, body);
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
      await options.server.close();
    },
  };
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

function writeWwwAuth(res: ServerResponse, status: number, detail: string): void {
  res.writeHead(status, {
    'content-type': 'application/json',
    'www-authenticate': `Bearer error="invalid_token", error_description="${detail.replace(/"/g, '')}"`,
  });
  res.end(JSON.stringify({ error: detail }));
}
