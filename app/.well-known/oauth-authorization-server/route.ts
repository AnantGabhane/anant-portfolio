import { getRequestOrigin, urlFor } from "@/app/lib/agent-discovery";

export function GET(request: Request) {
  const origin = getRequestOrigin(request);

  return Response.json(
    {
      issuer: origin,
      authorization_endpoint: urlFor("/.well-known/oauth-unavailable", origin),
      token_endpoint: urlFor("/.well-known/oauth-unavailable", origin),
      jwks_uri: urlFor("/.well-known/jwks.json", origin),
      service_documentation: urlFor("/docs/api", origin),
      response_types_supported: [],
      grant_types_supported: [],
      scopes_supported: ["portfolio:read"],
      token_endpoint_auth_methods_supported: [],
      protected_resources: [origin],
      note: "This portfolio currently exposes public read-only APIs and does not issue OAuth access tokens.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
