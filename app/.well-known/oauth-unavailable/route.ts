export function GET() {
  return Response.json(
    {
      error: "authorization_unavailable",
      error_description:
        "This portfolio does not currently issue OAuth access tokens because its APIs are public and read-only.",
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}

export const POST = GET;
