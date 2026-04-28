# CI client-credentials flow

Slice [plans/issues/19-ci-client-credentials.md](../plans/issues/19-ci-client-credentials.md).

CI agents authenticate with Entra using the OAuth 2.1 **client-credentials** grant — no browser, no user. Tokens are typically scoped narrowly (e.g. `standards:read` only) per PRD §6.6 ("Enables narrower tokens for CI jobs than for humans.").

## Issuing a CI credential

1. In the `Japetus` Entra app registration, add a client secret (or federated credential — preferred for GitHub Actions / ADO).
2. Grant the credential only the scopes the CI job needs. Start with `standards:read`.
3. Store the secret in the CI provider's secret manager (GitHub Actions: repo/org secrets; ADO: Library → Variable Group).

## Getting a token

```sh
curl -X POST "https://login.microsoftonline.com/${ENTRA_TENANT_ID}/oauth2/v2.0/token" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "scope=api://japetus/.default" \
  -d "grant_type=client_credentials"
```

The response includes `access_token`. Attach as `Authorization: Bearer <token>` on every MCP call.

## GitHub Actions example

See `examples/ci/github-actions.yml`:

```yaml
- name: Fetch Japetus token
  id: token
  env:
    ENTRA_TENANT_ID: ${{ secrets.ENTRA_TENANT_ID }}
    CLIENT_ID: ${{ secrets.JAPETUS_CLIENT_ID }}
    CLIENT_SECRET: ${{ secrets.JAPETUS_CLIENT_SECRET }}
  run: |
    TOKEN=$(curl -sS -X POST "https://login.microsoftonline.com/${ENTRA_TENANT_ID}/oauth2/v2.0/token" \
      -d "client_id=${CLIENT_ID}" \
      -d "client_secret=${CLIENT_SECRET}" \
      -d "scope=api://japetus/.default" \
      -d "grant_type=client_credentials" | jq -r .access_token)
    echo "::add-mask::${TOKEN}"
    echo "token=${TOKEN}" >> "$GITHUB_OUTPUT"

- name: Call Japetus
  run: |
    curl -sS -H "Authorization: Bearer ${{ steps.token.outputs.token }}" \
      -H "Content-Type: application/json" \
      -X POST "${JAPETUS_URL}/mcp" \
      -d '{"jsonrpc":"2.0","id":1,"method":"resources/read","params":{"uri":"conventions://prs/review-checklist"}}'
```

## Rotation

- Secrets rotate at least quarterly; use federated credentials where possible to avoid manual rotation.
- On suspected exposure, follow [runbooks://rotate-secrets](../content/runbooks/rotate-secrets.md).
