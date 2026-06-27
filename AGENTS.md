# AGENTS.md

## Purpose

Personal portfolio site for Anant Gabhane. Next.js App Router + React 19 + TypeScript strict + Tailwind CSS v4. Small, content-heavy, intentionally handcrafted. Prefer precise, low-risk edits that preserve the visual language.

## Stack

- Next.js 16 (`app/` directory, `@/*` path alias from tsconfig)
- React 19, TypeScript strict
- Tailwind CSS v4 via `@import "tailwindcss"` (PostCSS plugin: `@tailwindcss/postcss`)
- `next-themes` for dark mode (class strategy via `suppressHydrationWarning` on `<html>`)
- `framer-motion` for transitions
- `@react-three/fiber` + `@react-three/drei` for neural landscape
- `lucide-react` + `react-icons` for icons
- `qrcode.react`, `react-github-calendar`, `@calcom/embed-react` for interactive features
- `@vercel/analytics` for analytics

## Commands

Use `npm`. No test suite exists.

- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals` + `typescript`)
- `npm run build` — production build
- `npm run dev` / `npm run start`

For most changes, `npm run lint` is sufficient. Also run `npm run build` for routing, metadata, or config changes.

## Repo Map

- `app/page.tsx` — Main landing page (865 lines, `"use client"`). Contains all portfolio sections, human/agent mode toggle, and most interactive UI. Primary entry point.
- `app/layout.tsx` — Root layout. DM Sans font, `ThemeProvider`, `@vercel/analytics`.
- `app/providers.tsx` — Client theme provider with mount guard.
- `app/globals.css` — Tailwind import, `@theme inline` bindings, CSS custom properties, utility classes.
- `app/components/` — Reusable pieces:
  - `ThemeToggle.tsx`, `ExperienceItem.tsx`, `TechStack.tsx`
  - `NeuralNetworkSim.tsx` (heavy — R3F), `PomodoroTimer.tsx`
  - `WebMCPTools.tsx` (Model Context Protocol tools for agent mode)
- `app/data/content.ts` — `getMarkdownContent()` for agent mode text.
- `app/lib/agent-discovery.ts` — Site metadata, contact links, token estimation, agent discovery helpers.
- `app/robots.txt/route.ts` — SEO robots route (note: lives in a `robots.txt/` directory, not `robots.ts`).
- `app/sitemap.ts` — SEO sitemap.
- `app/api/` — API routes: `github-contributions/`, `health/`, `portfolio/`.
- `app/.well-known/` — Agent discovery endpoints: `agent-skills/`, `api-catalog/`, `mcp/`, OAuth configs.
- `app/docs/api/` — API documentation.
- `public/` — Static assets: images, `llm.txt`, `lofi.mp3`, `jingle.mp3`, resume PDF.

## Content Sync Rules

Portfolio content is duplicated across three locations. When updating copy, links, roles, or personal details, check all:

1. `app/page.tsx` — human-facing rendered portfolio
2. `app/data/content.ts` — agent mode text
3. `public/llm.txt` — machine-readable snapshot

Keep in sync unless user explicitly wants divergence.

## Editing Guidelines

- Prefer small edits over broad rewrites. This project is compact; minor changes affect tone and layout.
- Preserve the aesthetic: minimal monochrome, subtle motion, dense intentional content.
- Keep light/dark mode aligned — components use paired `dark:` classes.
- Only `"use client"` where hooks, browser APIs, audio, animation, or theme state require it.
- Follow existing TypeScript style; keep types explicit for non-trivial state/props.
- Reuse components before adding new files. If `app/page.tsx` grows, extract focused components.
- No unnecessary dependency changes — the current feature set is covered.

## UI Notes

- Home page has two modes: human (visual portfolio) and agent (monospaced markdown from `getMarkdownContent`).
- Theme uses `next-themes` with mounted guards. Be careful with hydration-sensitive changes.
- Neural landscape (`NeuralNetworkSim`) is the heaviest interactive element — treat performance changes conservatively.
- Tech stack icons from `https://cdn.simpleicons.org`. Verify `next.config.ts` remote image policy if icon loading changes.
- Audio: `public/lofi.mp3` and `public/jingle.mp3`. Keep filenames stable unless updating callers.
- WebMCPTools exposes Model Context Protocol tools for AI agents browsing the site.

## Validation

- `npm run lint` after code changes.
- `npm run build` for routing/metadata/config changes.
- Quick browser sanity check in dev server for content layout or interaction changes.
