import { PORTFOLIO_SKILL_MD } from "@/app/lib/agent-discovery";

export function GET() {
  return new Response(PORTFOLIO_SKILL_MD, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
