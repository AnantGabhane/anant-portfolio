# AGENTS.md

## Purpose

This repository is a personal portfolio site built with Next.js App Router, React, TypeScript, and Tailwind CSS v4. The app is small, content-heavy, and intentionally handcrafted. Agents working here should prefer precise, low-risk edits that preserve the current visual language and interaction style.

## Stack

- Next.js 16 with the `app/` directory
- React 19
- TypeScript with `strict` mode enabled
- Tailwind CSS v4 via `@import "tailwindcss"`
- `next-themes` for dark mode
- `framer-motion` for transitions and animated UI
- `@react-three/fiber` and `@react-three/drei` for the neural landscape visualization

## Package Manager And Commands

Use `npm`. This repo includes `package-lock.json`.

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Start production server: `npm run start`

There is no test suite in the repo right now. For most changes, run `npm run lint`. For route, metadata, or config changes, also run `npm run build` when practical.

## Repo Map

- `app/layout.tsx`
  Root layout, font setup, and theme provider wiring.
- `app/providers.tsx`
  Client-side theme provider with mount guard to avoid hydration mismatch.
- `app/page.tsx`
  Main landing page. This is the primary UI entry point and contains most of the portfolio content and interactive sections.
- `app/components/`
  Reusable UI pieces:
  - `ThemeToggle.tsx`
  - `ExperienceItem.tsx`
  - `TechStack.tsx`
  - `GithubGraph.tsx`
  - `PomodoroTimer.tsx`
  - `NeuralNetworkSim.tsx`
- `app/data/content.ts`
  Markdown-style content used for the "agent mode" view.
- `app/globals.css`
  Global theme variables, Tailwind theme bindings, and a few utility animations/helpers.
- `app/robots.ts` and `app/sitemap.ts`
  SEO metadata routes.
- `public/`
  Static assets including profile images, audio files, and `llm.txt`.

## Content Sync Rules

This repo has intentionally duplicated content in more than one place. If you update portfolio copy, links, roles, or personal details, check all of these:

- `app/page.tsx`
  The human-facing rendered portfolio.
- `app/data/content.ts`
  The text shown in agent mode.
- `public/llm.txt`
  Static machine-readable text snapshot.

Keep these in sync unless the user explicitly wants them to diverge.

## Editing Guidelines

- Prefer small edits over broad rewrites. This project is compact, so even minor changes can noticeably affect tone and layout.
- Preserve the existing aesthetic: minimal monochrome styling, subtle motion, dense but intentional content, and handcrafted sections.
- Keep light and dark mode behavior aligned. Most components already use paired `dark:` classes.
- Only use `"use client"` where hooks, browser APIs, audio, animation, or theme state actually require it.
- Follow the existing TypeScript style and keep types explicit when state or props are non-trivial.
- Reuse existing components before adding new files. If `app/page.tsx` grows further, extracting a focused component is preferable to making the page harder to scan.
- Avoid unnecessary dependency changes. The current feature set is already covered by the installed packages.

## UI And Frontend Notes

- The home page has two modes:
  - human mode: the visual portfolio UI
  - agent mode: a monospaced markdown-like representation from `getMarkdownContent`
- Theme handling depends on `next-themes` and mounted guards in client components. Be careful with hydration-sensitive changes.
- The neural landscape component uses React Three Fiber and is the heaviest interactive element in the app. Treat performance-sensitive changes there conservatively.
- The tech stack icons are fetched from `https://cdn.simpleicons.org`. If icon-loading behavior changes, verify `next.config.ts` still reflects the required remote image policy.
- Audio assets in `public/lofi.mp3` and `public/jingle.mp3` are used by interactive components. Keep filenames and public paths stable unless you update callers too.

## Validation Expectations

Before wrapping up:

- Run `npm run lint` after code changes.
- If you touched routing, metadata, Next config, or anything that could affect build output, run `npm run build` too.
- If you changed content layout or interactions, do a quick browser sanity check in the dev server when possible.

## Safe Defaults For Future Agents

- Search with `rg` instead of slower tools.
- Do not overwrite unrelated user changes.
- Do not reformat the whole codebase for a local cleanup unless asked.
- Keep docs and content updates grounded in the current repo, not generic Next.js boilerplate.
