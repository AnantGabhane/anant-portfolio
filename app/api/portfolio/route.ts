import {
  acceptsMarkdown,
  AGENT_MARKDOWN,
  CONTACT_LINKS,
  estimateMarkdownTokens,
  getRequestOrigin,
  SITE_DESCRIPTION,
  SITE_NAME,
  urlFor,
} from "@/app/lib/agent-discovery";

export function GET(request: Request) {
  const origin = getRequestOrigin(request);

  if (acceptsMarkdown(request.headers.get("accept"))) {
    return new Response(AGENT_MARKDOWN, {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
        "x-markdown-tokens": String(estimateMarkdownTokens(AGENT_MARKDOWN)),
      },
    });
  }

  return Response.json(
    {
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      timezone: "Asia/Kolkata",
      markdown: AGENT_MARKDOWN,
      resources: {
        homepage: urlFor("/", origin),
        markdown: urlFor("/", origin),
        llmText: urlFor("/llm.txt", origin),
        apiCatalog: urlFor("/.well-known/api-catalog", origin),
        openapi: urlFor("/openapi.json", origin),
      },
      contact: CONTACT_LINKS,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        Vary: "Accept",
      },
    }
  );
}
