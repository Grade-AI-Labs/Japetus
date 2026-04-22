import type { Space } from '../adapters/types.js';
import { notEntitled } from '../errors.js';

export type Scope = 'standards:read' | 'catalog:read' | `kb:read:${Space}`;

export interface Principal {
  sub: string;
  scopes: Set<string>;
  tokenKind: 'user' | 'client_credentials';
}

export function requireScope(principal: Principal, scope: Scope, target?: string): void {
  if (!principal.scopes.has(scope)) throw notEntitled(scope, target);
}

export function kbScopeFor(space: Space): Scope {
  return `kb:read:${space}` as Scope;
}
