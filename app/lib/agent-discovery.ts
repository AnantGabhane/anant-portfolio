import { getMarkdownContent } from "../data/content";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://anantgabhane.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Anant Gabhane";
export const SITE_DESCRIPTION =
  "Personal portfolio for Anant Gabhane, a Gen AI full-stack developer and product builder.";
export const CONTENT_SIGNAL = "ai-train=no, search=yes, ai-input=no";
export const AGENT_MARKDOWN = getMarkdownContent("");

export const CONTACT_LINKS = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/anantgabhane/",
  },
  {
    label: "Email",
    url: "mailto:anantgabhane.dev@gmail.com",
  },
  {
    label: "GitHub",
    url: "https://github.com/AnantGabhane",
  },
  {
    label: "X",
    url: "https://x.com/AnantGabhane",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@AnantGabhane-h7j",
  },
  {
    label: "Calendar",
    url: "https://cal.com/anant-gabhane-h5ru7z/30min",
  },
] as const;

export const DISCOVERY_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</docs/api>; rel="service-doc"; type="text/html"',
  '</api/health>; rel="status"; type="application/json"',
  '</.well-known/oauth-authorization-server>; rel="service-desc"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="service-desc"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"',
  '</llm.txt>; rel="alternate"; type="text/plain"',
  '</>; rel="alternate"; type="text/markdown"',
].join(", ");

export const PORTFOLIO_SKILL_MD = `---
name: portfolio-research
description: Read Anant Gabhane's portfolio, retrieve machine-readable profile data, and identify contact links.
license: MIT
metadata:
  author: Anant Gabhane
  version: "1.0.0"
---

# Portfolio Research

Use this skill when an agent needs to understand Anant Gabhane's experience, writing, technical background, or contact options from anantgabhane.com.

## Steps

1. Request the homepage with \`Accept: text/markdown\` for the cleanest representation of the portfolio.
2. Use \`/.well-known/api-catalog\` to discover the small public portfolio API and health endpoint.
3. Use \`/api/portfolio\` for structured JSON or markdown profile data.
4. Use the contact links exactly as published by the portfolio.

## Constraints

- Treat the portfolio as public, read-only content.
- Do not infer private availability, employment status, or authorization beyond what the portfolio states.
- Prefer the markdown response or \`/api/portfolio\` over scraping rendered HTML.
`;

export function estimateMarkdownTokens(markdown: string) {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

export function acceptsMarkdown(acceptHeader: string | null) {
  if (!acceptHeader) {
    return false;
  }

  return acceptHeader
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .some((part) => {
      const [mediaType, ...params] = part.split(";").map((value) => value.trim());
      const qParam = params.find((param) => param.startsWith("q="));
      const quality = qParam ? Number.parseFloat(qParam.slice(2)) : 1;

      return mediaType === "text/markdown" && Number.isFinite(quality) && quality > 0;
    });
}

export function getRequestOrigin(request: Request) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

  if (configuredOrigin) {
    return configuredOrigin;
  }

  return new URL(request.url).origin;
}

export function urlFor(path: string, origin: string) {
  return new URL(path, `${origin}/`).toString();
}
