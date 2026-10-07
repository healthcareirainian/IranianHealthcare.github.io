# IranianHealthcare.github.io

**سلامت ایران**: a Persian-language (RTL) healthcare news and information portal. Its structure
follows a hospital-industry news site: section mega-menu, lead and top stories, a "most read" rail,
latest feed, lists, per-section blocks, and newsletter bands.

Built with [Astro](https://astro.build) as a static site for GitHub Pages. Plan and status:
[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321/IranianHealthcare.github.io/  (search needs a build)
npm run build      # astro build + Pagefind search index → dist/
npm run preview    # serve dist/
npm run check:fa   # fail on Arabic ي/ك or Arabic-Indic digits in content
```

## Writing an article

Add `src/content/articles/<slug>.md`. The file name becomes the URL (`/articles/<slug>/`).

```yaml
---
title: عنوان مطلب
summary: یک یا دو جمله خلاصه؛ روی کارت‌ها، توضیح متا و اشتراک‌گذاری استفاده می‌شود.
section: clinical          # management | finance | health-it | clinical | pharmacy | dentistry | workforce | policy
topic: diabetes            # optional; must be a topic of that section (src/data/sections.ts)
tags: [دیابت, غربالگری]
author: editorial          # file name in src/content/authors/
medicalReviewer: dr-x      # optional; clinical/pharmacy/dentistry articles show "awaiting review" without it
publishedAt: 2026-10-06
type: explainer            # news | brief | list | analysis | explainer
featured: lead             # optional: lead (one) | top (up to four) on the homepage
sources:
  - title: 'WHO – Diabetes fact sheet'   # quote titles that contain ": " or " #"
    url: https://www.who.int/news-room/fact-sheets/detail/diabetes
---
```

The homepage "most read" rail is curated in `src/data/most-read.json` until analytics are connected.

## Layout

| Path | What |
|---|---|
| `src/data/sections.ts` | Sections and topics (navigation, mega menu, routes) |
| `src/data/site.ts` | Site name, tagline, social links |
| `src/content/` | Articles, authors, static pages (Markdown/YAML) |
| `src/components/`, `src/layouts/` | Header, footer, cards, most-read, listing and base layouts |
| `src/pages/` | Routes: home, `/section/…`, `/articles/…`, `/authors/…`, `/tags/…`, `/latest/`, `/lists/`, `/search/`, `/rss.xml` |
| `.github/workflows/deploy.yml` | CI: Persian check → build → deploy to Pages |

## Deploy

Push to `main`, then in the repo's **Settings → Pages** set **Source: GitHub Actions**. The site is served at
`https://healthcareirainian.github.io/IranianHealthcare.github.io/`. If the repo is renamed to
`healthcareirainian.github.io` or a custom domain is added, set `base: '/'` in `astro.config.mjs`.
