import { McpError } from '@modelcontextprotocol/sdk/types.js';

export const MCP_ERROR = {
  RESOURCE_NOT_FOUND: -32002,
  NOT_ENTITLED: 1001,
  UPSTREAM_UNAVAILABLE: 1002,
} as const;

export function resourceNotFound(uri: string): McpError {
  return new McpError(MCP_ERROR.RESOURCE_NOT_FOUND, `Resource not found: ${uri}`);
}

export function notEntitled(scope: string, uri?: string): McpError {
  const detail = uri ? ` for ${uri}` : '';
  return new McpError(MCP_ERROR.NOT_ENTITLED, `Not entitled${detail}: requires scope ${scope}`);
}

export function upstreamUnavailable(source: string, detail?: string): McpError {
  const tail = detail ? ` — ${detail}` : '';
  return new McpError(
    MCP_ERROR.UPSTREAM_UNAVAILABLE,
    `Upstream source unavailable: ${source}${tail}`,
  );
}

export { McpError };
