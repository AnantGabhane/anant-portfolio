import {
  getRequestOrigin,
  PORTFOLIO_SKILL_MD,
  urlFor,
} from "@/app/lib/agent-discovery";

async function sha256Digest(input: string) {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const digest = await sha256Digest(PORTFOLIO_SKILL_MD);

  return Response.json(
    {
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        {
          name: "portfolio-research",
          type: "skill-md",
          description:
            "Read Anant Gabhane's portfolio, retrieve machine-readable profile data, and identify contact links.",
          url: urlFor(
            "/.well-known/agent-skills/portfolio-research/SKILL.md",
            origin
          ),
          digest: `sha256:${digest}`,
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
