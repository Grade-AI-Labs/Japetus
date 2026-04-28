import { notEntitled } from '../errors.ts';

export type Scope = 'standards:read' | 'kb:read' | 'catalog:read';

export interface Principal {
  sub: string;
  scopes: Set<string>;
  tokenKind: 'user' | 'client_credentials';
}

export function requireScope(principal: Principal, scope: Scope, target?: string): void {
  if (!principal.scopes.has(scope)) throw notEntitled(scope, target);
}
