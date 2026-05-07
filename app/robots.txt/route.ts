import { CONTENT_SIGNAL, SITE_URL } from "@/app/lib/agent-discovery";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
