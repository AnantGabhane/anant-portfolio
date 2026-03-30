import { NextRequest, NextResponse } from "next/server";

type Activity = {
  date: string;
  count: number;
  level: number;
};

const DAY_ENTRY_PATTERN =
  /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[\s\S]*?<tool-tip[^>]*>([^<]*)<\/tool-tip>/g;

function parseContributionCount(tooltip: string) {
  const countMatch = tooltip.match(/([\d,]+)\s+contributions?\s+on/i);

  if (!countMatch) {
    return 0;
  }

  return Number.parseInt(countMatch[1].replaceAll(",", ""), 10);
}

function parseActivities(html: string): Activity[] {
  const activities: Activity[] = [];

  for (const match of html.matchAll(DAY_ENTRY_PATTERN)) {
    const date = match[1];
    const level = match[2];
    const tooltip = match[3];

    if (!date || level === undefined || !tooltip) {
      continue;
    }

    activities.push({
      date,
      count: parseContributionCount(tooltip),
      level: Number.parseInt(level, 10),
    });
  }

  if (activities.length === 0) {
    throw new Error("No contribution entries were found in GitHub's response.");
  }

  return activities;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "AnantGabhane";

  if (
    !/^[A-Za-z0-9-]{1,39}$/.test(username) ||
    username.startsWith("-") ||
    username.endsWith("-")
  ) {
    return NextResponse.json(
      { error: "Invalid GitHub username." },
      { status: 400 }
    );
  }

  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      "User-Agent": "anant-portfolio-site/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `GitHub returned ${response.status} while fetching contributions.` },
      { status: 502 }
    );
  }

  const html = await response.text();

  try {
    const activities = parseActivities(html);

    return NextResponse.json(
      { username, activities },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse GitHub contribution data.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
