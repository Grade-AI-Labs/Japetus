import { describe, expect, it } from 'vitest';
import { requireScope, type Principal, type Scope } from '../../src/auth/scopes.ts';

const principalWith = (scopes: string[]): Principal => ({
  sub: 'test-user',
  scopes: new Set(scopes),
  tokenKind: 'user',
});

describe('Auth scopes (kb:read collapsed)', () => {
  it('Scope union includes standards:read, kb:read, catalog:read', () => {
    const ok: Scope[] = ['standards:read', 'kb:read', 'catalog:read'];
    expect(ok).toHaveLength(3);
  });

  it('requireScope passes when the principal carries the required scope', () => {
    const p = principalWith(['kb:read']);
    expect(() => requireScope(p, 'kb:read')).not.toThrow();
  });

  it('requireScope throws notEntitled when scope missing', () => {
    const p = principalWith(['standards:read']);
    expect(() => requireScope(p, 'kb:read')).toThrowError(/Not entitled/);
  });

  it('a per-space scope (kb:read:ENG) is no longer recognized as kb:read', () => {
    const p = principalWith(['kb:read:ENG']);
    expect(() => requireScope(p, 'kb:read')).toThrowError(/Not entitled/);
  });
});
