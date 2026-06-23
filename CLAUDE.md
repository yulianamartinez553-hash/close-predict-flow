# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page Spanish-language marketing landing page for "Caro Chaparro · CLOSE-PREDICT™" (a sales-system consulting offer for LATAM infoproductores). It is **not** a generic app — it is one route (`/`) composed of heavily-animated landing sections. The "product" is the visual/narrative experience, so most work is on the landing components and their animations.

## Commands

```bash
bun install            # install deps (bun is the package manager — see bun.lock / bunfig.toml)
bun run dev            # Vite dev server
bun run build          # production build (Nitro SSR, Cloudflare target by default)
bun run build:dev      # build in development mode
bun run preview        # preview the production build
bun run lint           # ESLint over the repo
bun run format         # Prettier --write .
```

There is **no test suite** and no test runner configured. Don't invent test commands.

## Stack & framework conventions

- **TanStack Start** (React 19, SSR via Nitro) + **TanStack Router** (file-based) + **TanStack Query**.
- **Tailwind CSS v4** (CSS-first config in `src/styles.css`, no `tailwind.config.js`) + **shadcn/ui** ("new-york" style) in `src/components/ui/`.
- **Framer Motion** for all animation. Path alias `@/` → `src/`.

### Routing (TanStack Start, not Next.js/Remix)
- Routes live in `src/routes/`; each `.tsx` is a route. `__root.tsx` is the app shell (preserve its `<Outlet />`). See `src/routes/README.md` for the file→URL convention table.
- `src/routeTree.gen.ts` is **auto-generated** — never hand-edit it.
- `src/router.tsx` builds the router and provides the QueryClient via route context.
- Do NOT create `src/pages/`, `app/layout.tsx`, or import the `server-only` package — ESLint blocks it. Server-only modules use `*.server.ts` instead.

### SSR error handling (intentional, don't "simplify" away)
- `vite.config.ts` redirects TanStack Start's server entry to **`src/server.ts`**, which wraps SSR to catch h3's swallowed 500s (`{"unhandled":true,"message":"HTTPError"}`) and render `src/lib/error-page.ts`.
- `src/start.ts` adds request middleware doing the same for thrown errors.
- `src/lib/error-capture.ts` + `lovable-error-reporting.ts` forward client/SSR errors to Lovable's `window.__lovableEvents`.

## Vite config — critical constraint

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which **already bundles** tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, the `@` alias, and the error-logger/dev plugins. Do **not** add these plugins manually — duplicates break the build. Add extra config through `defineConfig({ vite: { ... } })`.

## Landing page architecture

`src/routes/index.tsx` composes the whole page in order: `SequenceIntro` (one-time intro overlay gated by `introComplete` state) → `Hero` → `AboutMe` → `InterludeParticles` → `Phases` → then `Sistema, Resultado, Garantia, Testimonios, LeadCapture, CtaFinal, Footer, WhatsAppFloat` — all exported from the single large `src/components/landing/Sections.tsx`.

- `src/components/landing/` — page sections. `Sections.tsx` holds multiple sections + their bespoke animation primitives (funnel, marquees, particles); section boundaries are marked with `/* ===== N. NAME ===== */` comment banners. Content is Spanish.
- `src/components/animations/` — reusable animated primitives (`CursorFollower`, `MetricCounter`, `ShiningButton`, `TickerHorizontal`).
- `src/lib/animations.ts` — shared Framer Motion `Variants` (`fadeInUp`, `staggerContainer`, etc.). Reuse these instead of redefining variants per component.

## Design tokens (use these, not raw hex/ad-hoc classes)

`src/styles.css` defines the brand system as CSS variables + Tailwind v4 `@theme` colors and custom `@utility` classes. Prefer the tokens:
- Brand colors: `ink`, `ink-deep`, `violet`, `violet-bright`, `gold`, `gold-soft`, `mist`, `cloud` (e.g. `bg-ink-deep`, `text-gold`).
- Fonts: `font-serif` (Cormorant Garamond — used for `h1–h4`), `font-sans` (Inter), `font-display` (Montserrat).
- Custom utilities: `aurora-bg`, `glass-card`, `glass-dark`, `btn-gold`, `btn-violet`, `pulse-glow`, `float-y`, `grid-noise`, `animate-glow`, `cursor-blink`, `text-balance`.

## Lovable sync — git rules (important)

This repo is connected to **Lovable** (`AGENTS.md`). Commits pushed to the connected branch sync back into the Lovable editor:
- **Never** force-push, rebase, amend, or squash already-pushed commits — it corrupts Lovable's history and the user can lose project history.
- Keep the branch in a working state when pushing.
- `.lovable/plan.md` holds the current Lovable change plan (Spanish); treat it as the active spec when present.

## Dependency guard

`bunfig.toml` sets `minimumReleaseAge = 86400` (skips packages published <24h ago) to mitigate supply-chain attacks. Only `@lovable.dev/*` packages are excluded. Confirm with the user before adding any new exclusion.

## Static assets

`public/` contains standalone HTML mockups (`hero-v3.html`, `diagnostico.html`, etc.) and `public/images/` (phase/`fase-*.png`, webp). These are reference/preview artifacts served statically, separate from the React app.
