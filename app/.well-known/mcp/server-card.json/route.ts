import {
  getRequestOrigin,
  SITE_DESCRIPTION,
  SITE_NAME,
  urlFor,
} from "@/app/lib/agent-discovery";

export function GET(request: Request) {
  const origin = getRequestOrigin(request);

  return Response.json(
    {
      $schema: "https://modelcontextprotocol.io/schemas/draft/server-card.json",
      serverInfo: {
        name: "anant-portfolio",
        version: "1.0.0",
      },
      name: "com.anantgabhane.portfolio",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      websiteUrl: origin,
      transport: {
        type: "webmcp",
        endpoint: urlFor("/", origin),
        description:
          "Browser-native WebMCP tools are registered on the homepage when navigator.modelContext is available.",
      },
      transports: [
        {
          type: "webmcp",
          url: urlFor("/", origin),
        },
      ],
      capabilities: {
        tools: {
          listChanged: false,
          names: [
            "get_portfolio_markdown",
            "get_contact_links",
            "set_portfolio_mode",
          ],
        },
        resources: {
          read: true,
        },
      },
      tools: [
        {
          name: "get_portfolio_markdown",
          description: "Return the portfolio content as markdown.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          readOnlyHint: true,
        },
        {
          name: "get_contact_links",
          description: "Return Anant Gabhane's public contact links.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          readOnlyHint: true,
        },
        {
          name: "set_portfolio_mode",
          description: "Switch the visible portfolio between human and agent modes.",
          inputSchema: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["human", "agent"],
              },
            },
            required: ["mode"],
            additionalProperties: false,
          },
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
