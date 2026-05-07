export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "anant-portfolio",
      checks: {
        homepage: "ok",
        portfolioApi: "ok",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}
