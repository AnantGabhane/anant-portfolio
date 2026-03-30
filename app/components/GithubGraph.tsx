"use client";

import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ContributionsResponse = {
    username: string;
    activities: Activity[];
};

function isContributionsResponse(payload: unknown): payload is ContributionsResponse {
    return (
        typeof payload === "object" &&
        payload !== null &&
        "activities" in payload &&
        Array.isArray((payload as { activities?: unknown }).activities)
    );
}

function getErrorMessage(payload: unknown) {
    if (
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof (payload as { error?: unknown }).error === "string"
    ) {
        return (payload as { error: string }).error;
    }

    return "Unable to load GitHub contributions.";
}

const githubTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function GithubGraph() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function loadContributions() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/github-contributions?username=AnantGabhane", {
                    signal: controller.signal,
                });

                const payload: unknown = await response.json();

                if (!response.ok || !isContributionsResponse(payload)) {
                    throw new Error(getErrorMessage(payload));
                }

                setActivities(payload.activities);
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load GitHub contributions."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadContributions();

        return () => controller.abort();
    }, []);

    if (!mounted) return null;

    if (error) {
        return (
            <div className="rounded-xl border border-gray-200 px-4 py-6 text-sm text-gray-500 dark:border-zinc-800 dark:text-gray-400">
                Contribution graph is temporarily unavailable.{" "}
                <a
                    href="https://github.com/AnantGabhane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-black dark:hover:text-white"
                >
                    View activity on GitHub
                </a>
                .
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex min-w-max justify-center text-xs px-4">
                <ActivityCalendar
                    data={activities}
                    loading={loading}
                    colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                    blockSize={10}
                    blockMargin={4}
                    fontSize={12}
                    theme={githubTheme}
                    showColorLegend={false}
                    showTotalCount={false}
                    showWeekdayLabels={["mon", "wed", "fri"]}
                    tooltips={{
                        activity: {
                            text: (activity) =>
                                activity.count === 1
                                    ? `1 contribution on ${activity.date}`
                                    : `${activity.count} contributions on ${activity.date}`,
                        },
                    }}
                />
            </div>
        </div>
    );
}
