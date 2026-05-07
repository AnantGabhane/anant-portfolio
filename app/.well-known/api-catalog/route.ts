import { getRequestOrigin, urlFor } from "@/app/lib/agent-discovery";

export function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const portfolioApi = urlFor("/api/portfolio", origin);

  const linkset = {
    linkset: [
      {
        anchor: portfolioApi,
        "service-desc": [
          {
            href: urlFor("/openapi.json", origin),
            type: "application/vnd.oai.openapi+json",
          },
        ],
        "service-doc": [
          {
            href: urlFor("/docs/api", origin),
            type: "text/html",
          },
        ],
        status: [
          {
            href: urlFor("/api/health", origin),
            type: "application/json",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/linkset+json; charset=utf-8",
    },
  });
}
