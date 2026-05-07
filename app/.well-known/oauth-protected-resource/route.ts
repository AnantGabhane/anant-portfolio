import { getRequestOrigin, urlFor } from "@/app/lib/agent-discovery";

export function GET(request: Request) {
  const origin = getRequestOrigin(request);

  return Response.json(
    {
      resource: origin,
      authorization_servers: [origin],
      bearer_methods_supported: ["header"],
      scopes_supported: ["portfolio:read"],
      resource_documentation: urlFor("/docs/api", origin),
      note: "All current portfolio APIs are public and read-only; this metadata is published for agent discovery.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
