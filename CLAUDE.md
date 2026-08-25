# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server on :3000, hot-reloads
npm run build    # production build — the only check that exists
npm start        # serve the production build
```

There are no tests, no linter, and no ESLint config. `npm run build` is the verification step: it
type-checks and must produce all routes as `○ (Static)`. If a route turns Dynamic, something
introduced a runtime dependency that shouldn't be there.

Deploys are git-based: push to `main` on GitHub → Vercel rebuilds automatically. Nothing is ever
edited on Vercel itself.

## Architecture

Next.js 15 App Router, React 18, Tailwind v3, fully static prerender. Four pages, no data layer,
no API routes.

The site was rebuilt in Aug 2026 from a new Stitch design system (Sora / Manrope / JetBrains Mono,
near-black navy `#00003c`). The earlier lavender "Revenue Engineering" look and the `/consulting`
route are gone — don't reintroduce either.

### Content is centralized by design

**Every string, number, link, image path and icon name on the site lives in
[`content/site.json`](content/site.json).** This is a hard constraint the owner asked for, not a
convention — she edits that file directly and expects never to open a `.tsx` to change copy.

`site.json` is keyed by page (`identity`, `nav`, `footer`, `home`, `work`, `about`, `contact`). [`lib/site.ts`](lib/site.ts) re-exports it with types inferred from the JSON itself
(`export type Site = typeof data`), so adding a key in JSON immediately types through to the pages.

**Never hardcode user-visible text in a component.** If a page needs a new string, add it to
`site.json` first and read it from there.

The owner edits `site.json` concurrently while Claude is working. **Always re-read it immediately
before editing** — a stale read will make Edit fail or silently clobber her changes.

### Icons are a subsetted font — two places must agree

Icons are Material Symbols, named as strings in `site.json` (`"icon": "groups"`). `ICON_FONT_HREF`
in `lib/site.ts` builds a Google Fonts URL with `icon_names=` listing exactly the `ICONS` array.
**Adding an icon name to `site.json` without adding it to `ICONS` renders nothing** — the glyph
isn't in the downloaded font.

The CSS class is `.msym` (defined in `app/globals.css`), deliberately **not**
`.material-symbols-outlined`. Google's stylesheet loads after Tailwind's and pins that class to
`font-size: 24px`, which silently defeats every Tailwind text-size utility. Owning the class name
keeps sizing in Tailwind's hands. Don't rename it back.

### Design tokens

`tailwind.config.ts` is generated from the inline `tailwind.config` in the Stitch screen
**"Portfolio | Refined Spacing & Compact Footer"** (project `1000797297664788185`, screen
`295198633b0740a7bf53bed06175e1a3`). Semantic names (`bg-surface-container`,
`text-on-surface-variant`, `px-margin-desktop`, `py-stack-gap`) come from there; use them rather
than raw Tailwind values so a token change propagates.

Three typefaces, each with a role, all loaded in `app/layout.tsx` via `next/font/google`:
`display-lg` / `headline-md` → **Sora**, `body-md` / `body-lg` → **Manrope**, `label-mono` →
**JetBrains Mono**. Type utilities come in pairs — `font-display-lg` (family) and `text-[72px]`
or `text-display-lg` (size). Both are needed; the family utility alone leaves the size wrong.

`primary` is near-black navy `#00003c`, used for nearly all text and fills — this system is
deliberately near-monochrome. There is no accent hue.

**Tailwind stays on v3.** The type scale uses v3's `fontSize` tuple format
(`['72px', { lineHeight, letterSpacing, fontWeight }]`). Upgrading to v4 means rewriting it.

### JSON-driven layout needs literal class maps

Tailwind's scanner can't see class names built at runtime, so any layout value that comes from JSON
must map through a literal lookup. `components/CaseGrid.tsx` has `SPAN`, driven by the `span` field
(`"wide"` / `"narrow"`) on each case. Adding a new value to the JSON requires adding the literal
string to the map, or the class is purged from the build.

### Shared components

`components/Metrics.tsx` renders the four-figure strip used on both `/` and `/work` — same numbers,
different order, driven by `home.metrics` and `work.metrics`. `components/CaseGrid.tsx` is the
bento grid plus its detail modals; it's a client component (modal state, Escape-to-close) and is
reused verbatim on both pages.

`components/Footer.tsx` is a client component solely so it can read `usePathname()` and suppress
its headline on `/contact` — that page's hero opens with the same sentence, and printing it twice
on one page looks like a bug.

### Layout gotchas already fixed — don't undo

- `<main>` in `app/layout.tsx` uses **`overflow-x-clip`, not `overflow-hidden`**. `hidden` would
  create a scroll container and break any sticky positioning inside.
- Headless-Chrome screenshots below ~430px lie: Chrome enforces a minimum window width, so a
  `--window-size=390` shot is a crop of a wider render and the right edge looks cut off. Verify
  narrow layouts at 760px or with an in-page `scrollWidth` probe, not by eyeballing a 390px PNG.

## Images

`public/images/`. To swap one, overwrite the file keeping the same name — no code or JSON change.
Filenames are referenced from `site.json`.

In use: `portrait.jpg` (hero + header avatar), `logo.jpg`, `work-case-01..04.jpg`,
`home-keynote.jpg` (About "Me in the Wild"). `portrait.jpg` came from the Stitch thumbnail and is
only 512×343 — it needs a real high-resolution photo. The `work-case-*` images are Unsplash stock
standing in for real project imagery. Files from the previous design (`work-aqualogix.jpg`,
`consulting-*.jpg`, `contact-map.png`, etc.) are unused but left in place.

## Placeholders still unreplaced

In `identity`: `email` (`hello@example.com`), `phone`/`phoneHref`, `linkedin`/`linkedinLabel`,
`resumeUrl` (`/resume.pdf` — **the file does not exist**; set to `""` to hide the Résumé link,
which is conditionally rendered in `components/Header.tsx`).

**`about.timeline` is fabricated.** The three roles came from the Stitch mockup, not from the
owner's real career, and the JSON carries a `_note` saying so. This must not go public as-is.
`about.wild.image` is likewise a stand-in.

`identity.siteUrl` drives `metadataBase`, `app/sitemap.ts` and `app/robots.ts`. It must be a bare
origin with no path and no deployment build hash — a deployment-specific Vercel URL is ephemeral.

## Stitch

The Stitch MCP server is configured for this project (`claude mcp list` → `stitch`). Note the CLI's
`--header` flag is variadic and will swallow a trailing URL — put the URL *before* `--header`.
Screens can be read live with `mcp__stitch__list_screens` / `get_screen` on project
`1000797297664788185`; `get_screen` returns signed `downloadUrl`s for both `code.html` and the
screenshot.

The project contains **four** design systems across 34 screens. Only the newest (Sora/Manrope) is
built. Classify a screen by fingerprint: Sora+Manrope = current; `#0b1326` = Executive Precision
(dark); `#fbf9f8` = Premium Revenue Editorial; `#faf8ff` = Revenue Engineering (the retired build).

## The Stitch export

`stitch_gtm_strategy_sales_portfolio/` is the original Google Stitch design export, gitignored and
`.vercelignore`d — local design reference only. It contains three design systems; only **Revenue
Engineering System** is built. The other two (Executive Precision, a dark variant with six
case-study deep-dive screens; and Premium Revenue Editorial) are unused but intact, and are the
source to pull from if the owner asks to change direction.

Case cards open a modal rather than navigating — there are no detail pages. Each case carries an
`id`, so `app/work/[slug]/page.tsx` is the path to adding them.
