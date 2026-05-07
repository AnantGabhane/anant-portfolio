import { getRequestOrigin } from "@/app/lib/agent-discovery";

export function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const openapi = {
    openapi: "3.1.0",
    info: {
      title: "Anant Gabhane Portfolio API",
      version: "1.0.0",
      description:
        "Small public read-only API surface for automated discovery of Anant Gabhane's portfolio.",
    },
    servers: [
      {
        url: origin,
      },
    ],
    paths: {
      "/api/portfolio": {
        get: {
          summary: "Get portfolio profile data",
          description:
            "Returns structured JSON by default. Send Accept: text/markdown for the markdown representation.",
          responses: {
            "200": {
              description: "Portfolio profile data",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PortfolioProfile",
                  },
                },
                "text/markdown": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "Get API health",
          responses: {
            "200": {
              description: "Health status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        enum: ["ok"],
                      },
                    },
                    required: ["status"],
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        PortfolioProfile: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            timezone: {
              type: "string",
            },
            markdown: {
              type: "string",
            },
            resources: {
              type: "object",
              additionalProperties: {
                type: "string",
                format: "uri",
              },
            },
            contact: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: {
                    type: "string",
                  },
                  url: {
                    type: "string",
                  },
                },
                required: ["label", "url"],
              },
            },
          },
          required: ["name", "description", "timezone", "resources", "contact"],
        },
      },
    },
  };

  return new Response(JSON.stringify(openapi), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/vnd.oai.openapi+json; charset=utf-8",
    },
  });
}
