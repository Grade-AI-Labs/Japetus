import { createRemoteJWKSet, jwtVerify, errors as joseErrors } from 'jose';
import type { Principal } from './scopes.js';

export interface EntraConfig {
  tenantId: string;
  audience: string;
  issuer?: string;
}

export interface EntraValidator {
  validate(bearer: string): Promise<Principal>;
}

export class EntraJwtValidator implements EntraValidator {
  private readonly jwks;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(config: EntraConfig) {
    const jwksUri = `https://login.microsoftonline.com/${config.tenantId}/discovery/v2.0/keys`;
    this.jwks = createRemoteJWKSet(new URL(jwksUri));
    this.issuer = config.issuer ?? `https://login.microsoftonline.com/${config.tenantId}/v2.0`;
    this.audience = config.audience;
  }

  async validate(bearer: string): Promise<Principal> {
    const token = bearer.replace(/^Bearer\s+/i, '').trim();
    if (!token) throw new UnauthorizedError('Missing bearer token');
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
      });
      const scopes = new Set<string>();
      const scp = (payload['scp'] as string | undefined) ?? '';
      const roles = (payload['roles'] as string[] | undefined) ?? [];
      scp
        .split(' ')
        .filter(Boolean)
        .forEach((s) => scopes.add(s));
      roles.forEach((r) => scopes.add(r));
      const isClientCreds = !payload['upn'] && !payload['preferred_username'];
      return {
        sub: (payload.sub as string) ?? 'unknown',
        scopes,
        tokenKind: isClientCreds ? 'client_credentials' : 'user',
      };
    } catch (err) {
      if (err instanceof joseErrors.JWTExpired || err instanceof joseErrors.JWTInvalid) {
        throw new UnauthorizedError(err.message);
      }
      throw new UnauthorizedError((err as Error).message);
    }
  }
}

export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Dev-only validator that accepts any token and returns a principal with all scopes.
 * Selected when AUTH_MODE=dev.
 */
export class DevValidator implements EntraValidator {
  async validate(bearer: string): Promise<Principal> {
    void bearer;
    return {
      sub: 'dev-user',
      scopes: new Set([
        'standards:read',
        'catalog:read',
        'kb:read:ENG',
        'kb:read:PRODUCT',
        'kb:read:SEC',
      ]),
      tokenKind: 'user',
    };
  }
}
