"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}
