import Link from "next/link";

export default function ApiDocsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-16 text-black dark:text-white">
      <Link
        href="/"
        className="mb-12 text-sm text-gray-500 underline underline-offset-4 transition-colors hover:text-black dark:hover:text-white"
      >
        Back to portfolio
      </Link>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Portfolio API
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
        A small public read-only API for agents and automated clients that need
        to discover Anant Gabhane&apos;s portfolio content without scraping the
        rendered page.
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Endpoints
        </h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <code>/api/portfolio</code> returns profile data as JSON, or markdown
            when requested with <code>Accept: text/markdown</code>.
          </li>
          <li>
            <code>/api/health</code> returns a simple health status.
          </li>
          <li>
            <code>/.well-known/api-catalog</code> advertises the API catalog in
            Linkset JSON.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Discovery
        </h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <Link href="/openapi.json" className="underline underline-offset-4">
              OpenAPI description
            </Link>
          </li>
          <li>
            <Link
              href="/.well-known/agent-skills/index.json"
              className="underline underline-offset-4"
            >
              Agent skills index
            </Link>
          </li>
          <li>
            <Link
              href="/.well-known/mcp/server-card.json"
              className="underline underline-offset-4"
            >
              MCP server card
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
