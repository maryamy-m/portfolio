# Portfolio

A four-page portfolio site built from the Google Stitch screen
**"Portfolio | Refined Spacing & Compact Footer"**. Next.js 15 (App Router) + Tailwind, fully static.

```
/         Home     — hero, four metrics, selected-work bento grid
/work     Work     — hero, metrics, same case grid
/about    About    — hero, four principles, "me in the wild", timeline, education
/contact  Contact  — hero, contact rows, CTA
```

Typefaces: **Sora** (display), **Manrope** (body), **JetBrains Mono** (labels). Near-monochrome
palette on `#00003c`.

---

## Editing the site

**All content lives in one file: [`content/site.json`](content/site.json).**

Every headline, metric, case study, service tier, timeline entry, nav label and link on the
site is read from that file. You never need to open a `.tsx` file to change wording, numbers,
or links.

```bash
npm run dev      # http://localhost:3000, reloads as you edit
```

### Placeholders you must replace before launching

These ship with dummy values. All of them are in the `identity` block at the top of
`content/site.json`, so it's one edit each:

| Field | Ships as | Notes |
|---|---|---|
| `email` | `hello@example.com` | Contact page, footer, and the "Send a message" button |
| `phone` / `phoneHref` | `+1 (555) 012 3456` | Keep both in sync; `phoneHref` is the `tel:` link |
| `linkedin` / `linkedinLabel` | `/in/profile` | URL and the text shown on the card |
| `resumeUrl` | `/resume.pdf` | **Add `public/resume.pdf`**, or set this to `""` to hide the Résumé link entirely |

Two more, outside `identity`:

- **`about.timeline`** — the three job entries came from the Stitch mockup and are **not real**.
  Replace them before showing this to anyone.
- **`about.wild.image`** — placeholder; needs a real still from the UBC campaign.

### Images

Images live in `public/images/`. To swap one, **overwrite the file and keep the same name** —
no code or JSON changes needed.

| File | Used on |
|---|---|
| `portrait.jpg` | Home hero, Work hero, header avatar |
| `logo.jpg` | Header mark |
| `work-case-01.jpg` … `-04.jpg` | The four case cards |
| `home-keynote.jpg` | About — "Me in the Wild" |

`portrait.jpg` is only 512×343 (it came from a Stitch thumbnail) — swap in a real high-resolution
photo. The four `work-case-*` images are Unsplash stock standing in for real project imagery.
Files from the previous design are still in the folder but unused.

### Icons

Icons are Material Symbols, referenced by name in `content/site.json` (e.g. `"icon": "groups"`).
The font is **subsetted** to only the icons in use, listed in `ICONS` in
[`lib/site.ts`](lib/site.ts). If you add a new icon name to the JSON, add it to that array too —
otherwise the glyph won't be in the downloaded font and nothing will render. (This bit us once:
the LinkedIn footer link rendered as the literal text `LINK` until `link` was added to the array.)

---

## Deploying to Vercel

The app is a standard Next.js project, so Vercel needs no configuration.

**First deploy:**

```bash
npm i -g vercel     # once
vercel login
vercel --prod
```

Accept the detected defaults (Framework: Next.js, Build: `next build`). You'll get a
`*.vercel.app` URL immediately.

**Custom domain:** Vercel dashboard → your project → Settings → Domains → add your domain and
follow the DNS instructions. Then set `identity.siteUrl` in `content/site.json` to that domain
and redeploy, so the sitemap and social previews point at the right place.

**Git-based deploys (recommended):** push this folder to a GitHub repo and import it at
[vercel.com/new](https://vercel.com/new). Every push to `main` then deploys automatically.

```bash
git init && git add -A && git commit -m "Portfolio site"
```

`.vercelignore` excludes `stitch_gtm_strategy_sales_portfolio/` from uploads — that folder is the
original Stitch export, kept as design reference only.

---

## Notes on the build

- **Design tokens** in `tailwind.config.ts` are generated from the inline `tailwind.config` in the
  Stitch screen's HTML, not hand-written.
- **Tailwind v3**, deliberately, because the config uses v3's `fontSize` tuple format
  (`['72px', { lineHeight, letterSpacing, fontWeight }]`). Migrating to v4 would mean rewriting
  the type scale.
- **Icon class is `.msym`, not `.material-symbols-outlined`.** Google's icon stylesheet loads
  after Tailwind's and pins `.material-symbols-outlined` to `font-size: 24px`, which silently
  overrides every Tailwind text-size utility. Owning the class name keeps sizing working.
- **`<main>` uses `overflow-x-clip`** rather than `hidden`, which would create a scroll container
  and break sticky positioning.
- Case cards open a modal instead of navigating. To add real detail pages, create
  `app/work/[slug]/page.tsx` keyed on the `id` already present in each case.
- The "Send a message" button is a `mailto:` link with a prefilled subject. A real form would need
  a Next.js route handler plus an email provider.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve the production build
```
