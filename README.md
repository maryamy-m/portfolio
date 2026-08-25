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

### Editing on the live site

You can also edit the site from the site itself, without opening this file or touching git.

1. Go to **your editor URL** and sign in. There is no `/edit` or `/admin` — the sign-in page lives
   at a long random path stored in the `CMS_PATH` environment variable, so it can't be found by
   guessing. Look it up in `.env.local` locally, or in Vercel → Settings → Environment Variables
   for the live site.
2. You land back on the homepage with a bar along the bottom. Every piece of text is now
   click-to-edit — click it, type over it, press `Enter` or click away.
3. Navigate between pages and keep editing; unpublished changes are held until you publish.
4. Hit **Publish** (or `⌘S`). The bar tracks the rebuild and tells you when it's live.

While edit mode is on, clicking text edits it instead of following the link. **`⌘`-click** to
navigate normally, or flip the toggle at the left of the bar from *Editing* to *Browsing*.

**Pictures work the same way.** In edit mode every replaceable picture picks up a dashed outline —
click one, choose a photo, and it uploads. Big photos are shrunk in the browser first (down to
2400px, JPEG or WebP), so a photo straight off your phone is fine. Each upload lands under a new
filename, so no browser or CDN can keep showing the old picture, and the one it replaced stays in
git history rather than being destroyed.

Nine pictures are replaceable this way: both hero portraits, the four case cards, the About
"Me in the Wild" still, the header logo and the header avatar.

**What Publish actually does:** it writes your changes into `content/site.json` — and, for a
picture, the new file into `public/images/` — and commits to GitHub. The commit is what makes
Vercel rebuild, so the live site updates about a minute later. The file stays the single source of
truth: editing it by hand and editing it through the browser are the same thing, and every change
through the editor is an ordinary commit you can read, diff or revert.

Inline editing reaches every visible piece of text and every picture. For everything else — links,
SEO titles and descriptions, image alt text, and adding, removing or reordering items like case
studies, metrics or timeline entries — use the **Raw JSON** button in the bar, which opens the
whole file with live validation. Case-study detail text lives in the card modals: `⌘`-click a card
to open one, then edit it there.

#### Turning it on

The editor is off until it has credentials, and stays off for everyone who isn't signed in — a
visitor never even downloads it. Copy [`.env.example`](.env.example) to `.env.local` for local
use, and set the same variables in Vercel → Settings → Environment Variables for the live site.

| Variable | What it's for |
|---|---|
| `CMS_PATH` | The secret URL the sign-in page lives at. `openssl rand -hex 16` |
| `CMS_PASSWORD` | The password for it. Make it long. |
| `CMS_SECRET` | Signs the session cookie. `openssl rand -base64 32` |
| `GITHUB_TOKEN` | Lets Publish commit. Fine-grained token, this repo only, **Contents: Read and write** |
| `GITHUB_REPO` / `GITHUB_BRANCH` | Defaults to `maryamy-m/portfolio` and `main` |

With no `GITHUB_TOKEN` — i.e. during `npm run dev` — Publish writes to disk instead of committing,
so you can try edits locally and see them hot-reload.

Two things to know about the secret URL. Changing `CMS_PATH` moves the page on the next deploy, so
it's easy to rotate if you ever paste it somewhere by accident. And it does appear in the Vercel
build log (as the one prerendered path of the `/[cmsPath]` route) — those logs are visible to
anyone on the Vercel project, which for a solo project means only you.

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

The easiest way to change a picture is to click it in the editor (above). Failing that, drop a new
file into `public/images/` and point the matching path in `content/site.json` at it.

Uploaded pictures are named `<original>-<hash>.jpg`, so `public/images/` accumulates the ones you
have replaced. Deleting a file no longer referenced from `site.json` is safe.

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
