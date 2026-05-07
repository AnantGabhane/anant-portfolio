import { NextRequest, NextResponse } from "next/server";
import {
  acceptsMarkdown,
  AGENT_MARKDOWN,
  CONTENT_SIGNAL,
  DISCOVERY_LINK_HEADER,
  estimateMarkdownTokens,
} from "./app/lib/agent-discovery";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const wantsMarkdown =
    (request.method === "GET" || request.method === "HEAD") &&
    acceptsMarkdown(request.headers.get("accept"));

  if (wantsMarkdown) {
    return new NextResponse(request.method === "HEAD" ? null : AGENT_MARKDOWN, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Signal": CONTENT_SIGNAL,
        Link: DISCOVERY_LINK_HEADER,
        Vary: "Accept",
        "x-markdown-tokens": String(estimateMarkdownTokens(AGENT_MARKDOWN)),
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Content-Signal", CONTENT_SIGNAL);
  response.headers.set("Link", DISCOVERY_LINK_HEADER);
  response.headers.set("Vary", "Accept");

  return response;
}

export const config = {
  matcher: "/",
};
