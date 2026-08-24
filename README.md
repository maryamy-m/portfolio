# Portfolio

A five-page portfolio site built from the **Revenue Engineering System** design direction
in the Google Stitch export. Next.js 15 (App Router) + Tailwind, fully static.

```
/            Home        — hero, proof metrics, thesis, bento engagements, principles
/work        Work        — hero, metrics, four case cards
/about       About       — hero, philosophy + toolkit, career timeline
/consulting  Consulting  — hero, three service tiers, visual break, CTA
/contact     Contact     — hero, contact channels, map, capacity CTA
```

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
| `name` | `[YOUR NAME]` | Used in page titles and social previews |
| `siteUrl` | `https://example.com` | Your real domain. Drives `sitemap.xml`, `robots.txt` and OG tags |
| `email` | `hello@example.com` | Contact page + the "Submit RFP" button |
| `phone` / `phoneHref` | `+1 (555) 012 3456` | Keep both in sync; `phoneHref` is the `tel:` link |
| `linkedin` / `linkedinLabel` | `/in/profile` | URL and the text shown on the card |
| `resumeUrl` | `/resume.pdf` | **Add `public/resume.pdf`**, or set this to `""` to hide the Résumé link entirely |
| `location`, `locationCode` | Vancouver, BC | `locationCode` is the mono readout over the map |

Also in `footer.links`: Substack and GitHub are `"#"` — set real URLs or delete those entries.

### Images

Images live in `public/images/`. To swap one, **overwrite the file and keep the same name** —
no code or JSON changes needed.

| File | Used on |
|---|---|
| `home-keynote.jpg` | Home — crisis ops bento tile |
| `work-crisis-steel.jpg` | Work — Case 01 |
| `work-aqualogix.jpg` | Work — Case 02 |
| `work-melliora.jpg` | Work — Case 03 |
| `work-curiosity.jpg` | Work — Case 04 |
| `about-mechanism.jpg` | About — philosophy section |
| `consulting-gears.jpg` | Consulting — hero |
| `consulting-architecture.jpg` | Consulting — visual break |
| `contact-map.png` | Contact — map panel |

These were downloaded from the Stitch CDN (those URLs expire) and are now served locally.
Three of them — Aqualogix, Melliora, Curiosity — are AI mockups that visibly contain the words
*"Strategic GTM & Ops Portfolio"*; you'll probably want to replace those with real project imagery.

### Icons

Icons are Material Symbols, referenced by name in `content/site.json` (e.g. `"icon": "groups"`).
The font is **subsetted** to only the icons in use, listed in `ICONS` in
[`lib/site.ts`](lib/site.ts). If you add a new icon name to the JSON, add it to that array too —
otherwise the glyph won't be in the downloaded font and nothing will render.

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

- **Design tokens** in `tailwind.config.ts` are ported verbatim from the Stitch export's
  `revenue_engineering_system/DESIGN.md` — colours, type scale, spacing, radii.
- **Tailwind v3**, deliberately, because the Stitch config uses v3's `fontSize` tuple format
  (`['72px', { lineHeight, letterSpacing, fontWeight }]`). Migrating to v4 would mean rewriting
  the type scale.
- **Icon class is `.msym`, not `.material-symbols-outlined`.** Google's icon stylesheet loads
  after Tailwind's and pins `.material-symbols-outlined` to `font-size: 24px`, which silently
  overrides every Tailwind text-size utility. Owning the class name keeps sizing working.
- **`<main>` uses `overflow-x-clip`** to contain decorative blurred blobs that extend past the
  right edge on narrow screens. `clip` rather than `hidden` — `hidden` would create a scroll
  container and break the About page's sticky heading.
- **Mobile display type** steps down to the design system's `headline-lg-mobile` (32px) from
  `display-xl` (72px); the Stitch export had no responsive heading sizes.
- Case cards on `/work` are `<article>`, not links — there are no case-study detail pages yet.
  The Stitch export had them as `<a href="#">`. To add detail pages, create
  `app/work/[slug]/page.tsx` keyed on the `id` field already present in each case.
- The "Submit RFP" button is a `mailto:` link with a prefilled subject. A real form would need a
  Next.js route handler plus an email provider.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve the production build
```
