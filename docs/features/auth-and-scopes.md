# Authentication & Scopes

> **Area:** auth-and-scopes
> **Status:** Active
> **Last updated:** 2026-04-22

## Overview

`grade-standards` authenticates every request against Microsoft Entra (OAuth 2.1), extracts a `Principal` from the validated token's claims, and enforces a backend-neutral scope set on every tool call and resource read. Scope names (`standards:read`, `kb:read:<space>`, `catalog:read`) are intentionally decoupled from the underlying source adapters so swapping a backend does not force token reissuance. A dev validator allows local work without Entra; an `off` mode disables auth entirely for diagnostics.

## Responsibilities

- Validate bearer tokens against Entra JWKS on every MCP request
- Extract scopes (from `scp` and `roles` claims) and the principal identifier (`sub`)
- Differentiate user tokens from client-credentials tokens (presence of `upn`/`preferred_username`)
- Enforce per-URI and per-tool scope requirements
- Raise the correct MCP error shape for each failure mode (401 / 1001 / -32002 / 1002) per PRD §6.8

What this feature does NOT own:

- Issuing tokens (Entra does that; see [`docs/ci-client-credentials.md`](../ci-client-credentials.md) for the CI flow)
- Source-system auth — each adapter manages its own upstream credentials (PRD §6.6)
- Audit logging (that's `audit/` — auth surfaces the principal; audit records it)

## Key concepts

- **Principal**: `{ sub, scopes: Set<string>, tokenKind: 'user' | 'client_credentials' }` — what the rest of the code gets after validation
- **Scope**: a string from the fixed set `standards:read`, `kb:read:ENG|PRODUCT|SEC`, `catalog:read`
- **Validator**: strategy interface with one method `validate(bearerHeader): Promise<Principal>`
- **AUTH_MODE**: env-driven selector between `dev`, `entra`, `off`
- **AuthInfo**: the MCP SDK's per-request context object; we populate it in the transport so tools/resource handlers can read scopes from `extra.authInfo`

---

## Validation flow

```
HTTP request
  → transport.ts: resolveAuth(req, validator)
     ↳ AUTH_MODE=off → undefined (no principal)
     ↳ AUTH_MODE=dev → DevValidator → principal with all scopes
     ↳ AUTH_MODE=entra → EntraJwtValidator
        → jwtVerify(token, JWKS, { issuer, audience })
        → extract scp (space-delimited) + roles (array) → Set<string>
        → isClientCreds = !upn && !preferred_username
  → attach as IncomingMessage.auth: AuthInfo
  → StreamableHTTPServerTransport.handleRequest(...)
```

Tool/resource handlers then call `principalFromExtra(extra)` and, if a principal is present, `requireScope(principal, scope, uri?)`.

---

## Scope enforcement

Each URI prefix maps to a scope via `scopeForEntry(entry)` in [`src/server.ts`](../../src/server.ts):

| URI prefix                                       | Required scope    |
| ------------------------------------------------ | ----------------- |
| `catalog://*`                                    | `catalog:read`    |
| `docs://<space>/*`                               | `kb:read:<space>` |
| `conventions://*` `runbooks://*` `templates://*` | `standards:read`  |

Tools declare their own scopes:

| Tool               | Scope                                     |
| ------------------ | ----------------------------------------- |
| `search_standards` | `standards:read`                          |
| `get_resource`     | scope of the target entry                 |
| `current_standard` | `standards:read`                          |
| `search_docs`      | `kb:read:<space>` for the requested space |
| `who_owns`         | `catalog:read`                            |

If `principal.scopes` does not contain the required scope, `requireScope` throws `notEntitled(scope, target?)` which becomes MCP error `1001`.

---

## Technical Implementation

### Validators

- **Location**: [`src/auth/entra.ts`](../../src/auth/entra.ts)
- **`EntraJwtValidator`**:
  - Uses `jose.createRemoteJWKSet(new URL(jwksUri))` for cached JWKS retrieval
  - Verifies tokens with `jwtVerify(token, jwks, { issuer, audience })`
  - `issuer` defaults to `https://login.microsoftonline.com/${tenantId}/v2.0`
  - Maps `jose.errors.JWTExpired` / `JWTInvalid` to `UnauthorizedError` (HTTP 401 with WWW-Authenticate)
- **`DevValidator`**: unconditionally returns a principal with every scope; selected when `AUTH_MODE=dev`
- **`off` mode**: transport returns `undefined` for the `AuthInfo`; downstream handlers skip `requireScope` when `principal` is undefined

### Scope helpers

- **Location**: [`src/auth/scopes.ts`](../../src/auth/scopes.ts)
- **`requireScope(principal, scope, target?)`**: throws `notEntitled(scope, target)` if the scope is missing
- **`kbScopeFor(space)`**: constructs `kb:read:<space>` — used when a tool receives the space argument and needs to build the scope name dynamically

### Transport integration

- **Location**: [`src/transport.ts`](../../src/transport.ts)
- Reads `Authorization` header, delegates to `validator.validate`, builds `AuthInfo` with `clientId=sub`, `scopes=[...]`, and `extra={ tokenKind, sub }`
- On `UnauthorizedError`, returns HTTP 401 with `WWW-Authenticate: Bearer error="invalid_token", error_description="..."`

### Server-side bridge

- **Location**: [`src/server.ts`](../../src/server.ts), `principalFromExtra(extra)`
- Converts the MCP SDK's `RequestHandlerExtra.authInfo` back into the `Principal` shape handlers use

---

## Configuration

### Environment Variables

- `AUTH_MODE` — `dev` | `entra` | `off`. Default: `dev`.
- `ENTRA_TENANT_ID` — required when `AUTH_MODE=entra`; the Entra tenant GUID
- `ENTRA_AUDIENCE` — required when `AUTH_MODE=entra`; the `aud` claim the token must carry (typically `api://grade-standards`)

### Scope set (fixed)

- `standards:read`
- `kb:read:ENG`
- `kb:read:PRODUCT`
- `kb:read:SEC`
- `catalog:read`

---

## Testing

### Integration Tests

- **Location**: [`tests/integration/server.test.ts`](../../tests/integration/server.test.ts)
- **Setup**: tests use `DevValidator` and a real `Client` → `StreamableHTTPClientTransport` with `Authorization: Bearer dev`. This exercises the transport-level auth path end-to-end without needing Entra.
- **Covered**: every tool and resource read carries an auth check; tests confirm successful flow. Explicit tests for 401 (missing header), 1001 (missing scope), and token-expiry are TODO — the groundwork is there but per-scenario coverage should land before production.

### Not covered in CI

- Real Entra token validation — add a contract test against a test tenant before going to production
- JWKS rotation handling — `jose` handles this internally via its JWKS cache, but worth a dedicated test

---

## Error Handling & Edge Cases

### Common Errors

- **Missing `Authorization` header** (when validator is set): transport throws `UnauthorizedError`; HTTP 401 + WWW-Authenticate
- **Invalid/expired token**: `EntraJwtValidator` throws `UnauthorizedError`; HTTP 401
- **Valid token, missing scope**: `requireScope` throws `notEntitled(...)`; MCP error `1001`
- **Valid token, unknown URI**: `Registry.resolve` throws `resourceNotFound(...)`; MCP error `-32002` (auth check runs first; -32002 only lands for entitled-but-missing resources)
- **`AUTH_MODE` mismatch**: `AUTH_MODE=entra` without `ENTRA_TENANT_ID` or `ENTRA_AUDIENCE` throws at server startup

### Edge Cases

- **Client-credentials token (CI)**: detected by absence of `upn`/`preferred_username`; `tokenKind=client_credentials` is recorded in audit for narrower-scope analysis
- **Token with empty `scp`**: treated as "no scopes"; every scope check fails → 1001
- **Multiple spaces in `scp` string**: tolerated (split on whitespace, filter empties)
- **Roles claim**: app roles are merged into the same scope set; an app role named `standards:read` is equivalent to the delegated scope

---

## Security Considerations

- **Never log full bearer tokens.** Transport sets `AuthInfo.token = 'redacted'` — upstream code never sees the raw JWT.
- **Service-principal for Confluence, not per-user** (PRD §6.6 + §10 #1 resolved). Revisit only if we expose per-user-entitled content.
- **JWKS caching is jose's default.** Avoid disabling cache; disabling triggers a network round-trip on every validation.
- **Scope strings are stable even if backends change** (PRD §6.6). When adding a new space or adapter, extend the scope enum rather than rewiring tokens.
- **`AUTH_MODE=dev` is dangerous in shared environments.** Only safe for localhost. Deployment config should set `AUTH_MODE=entra` explicitly; any environment without `AUTH_MODE=entra` that has real tokens is a bug.

## Performance Considerations

- Token validation cost: dominant factor is the first JWKS fetch; subsequent validations verify signature against the cached JWKS (sub-millisecond)
- `requireScope` is a `Set.has()` lookup (O(1))

## Known Issues and Limitations

1. **No explicit 401 vs 403 differentiation on MCP JSON-RPC errors.** HTTP 401 covers "no or invalid token" at transport level; in-flight scope denials surface as JSON-RPC `1001`. Clients get two distinct signals, which is what PRD §6.8 asks for — but the naming isn't exactly "401 vs 403". Document this in client setup.
2. **No token revocation check.** Short token lifetimes + JWKS rotation is the mitigation; a dedicated revocation-list check is Phase 3.
3. **No per-user rate limiting.** Relies on Entra + Azure Container Apps infrastructure protections for now.

## Related Features

- **adapter-layer**: source-level auth (Confluence service principal, etc.) lives inside each adapter — this feature only covers the MCP-facing side
- **mcp-surface**: every tool and prompt hooks through `requireScope`; the surface is the enforcement point

## Changelog

| Date       | Change                |
| ---------- | --------------------- |
| 2026-04-22 | Initial documentation |
