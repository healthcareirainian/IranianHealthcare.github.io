# Implementation plan: IranianHealthcare.github.io

> **Status (2026-10-07):** phases 0–3 built and verified locally (96 pages, Persian search, RSS, sitemap, JSON-LD, 0 broken links). Not yet deployed. Next: Lighthouse pass, then phase 4 (CMS).

A Persian (RTL) healthcare news and information portal, modeled on the structure of
Becker's Hospital Review: sectioned news, top stories, most read, lists, newsletters, events.
Content is original Persian writing; we copy the *format*, never the articles.

---

## 0. Constraints that shape every decision

| Constraint | Consequence |
|---|---|
| Hosted on **GitHub Pages** (static only) | No server, no database. Everything is built at deploy time; dynamic parts use build-time data or third-party services. |
| Repo is `healthcareirainian/IranianHealthcare.github.io`, a **project site** | Served at `https://healthcareirainian.github.io/IranianHealthcare.github.io/`. Every link and asset needs the base path. To serve at the root, rename the repo to `healthcareirainian.github.io` or add a custom domain later. |
| Main audience is in **Iran** | Many foreign CDNs (Google Fonts, some analytics, some JS CDNs) are slow or blocked. **Self-host fonts and scripts**; prefer services reachable from Iran. Mobile-first: most traffic is on phones. |
| Health content | Needs author credentials, medical review, sources, and a disclaimer on every clinical page. |

## 1. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output) | Content-first, ships almost no JS, Markdown/MDX content collections with typed frontmatter. |
| Styling | **Plain CSS** with design tokens (`src/styles/global.css`) and logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) | RTL works without mirrored CSS; no build plugin to keep in sync. (Changed from Tailwind during phase 0.) |
| Fonts | **Vazirmatn** (body/UI) + **Noto Naskh Arabic** (headlines), self-hosted via `@fontsource-variable` | Serif headlines over a sans body, the editorial pairing of the reference site; no external font request. |
| Dates | `Intl.DateTimeFormat('fa-IR-u-ca-persian')` | Native Jalali dates and Persian digits, no library. Store ISO dates in content. |
| Search | **Pagefind** | Static full-text search index built after the site builds. |
| CMS (phase 4) | **Sveltia CMS** (Decap-compatible) at `/admin` | Git-based editing in the browser; can sign in with a GitHub token, so no OAuth server is needed on Pages. |
| Analytics | **GoatCounter** or self-hosted Umami | Lightweight, privacy-friendly; also feeds "most read". |
| Deploy | GitHub Actions → GitHub Pages | Build on every push to `main`. |

## 2. Repository structure

```
/
├─ .github/workflows/
│  ├─ deploy.yml            # build + Pagefind + publish to Pages
│  └─ most-read.yml         # nightly: pull analytics, write most-read.json, rebuild (phase 5)
├─ public/
│  ├─ admin/                # CMS (phase 4)
│  └─ images/
├─ src/
│  ├─ content/
│  │  ├─ articles/          # one .md/.mdx per article
│  │  ├─ authors/           # one .yaml per author (name, title, credentials, photo)
│  │  ├─ sections/          # section metadata (slug, Persian title, description, order)
│  │  └─ events/            # phase 5
│  ├─ content.config.ts     # zod schemas for the collections
│  ├─ data/most-read.json   # editor-curated first, analytics-generated later
│  ├─ components/
│  ├─ layouts/
│  ├─ lib/                  # date formatting, Persian text normalisation, SEO helpers
│  └─ pages/
├─ scripts/normalize-fa.mjs # ي→ی, ك→ک, fix half-spaces; run in CI on content
└─ astro.config.mjs         # site + base set for the project-site URL
```

## 3. Content model

**Article frontmatter**

| Field | Type | Notes |
|---|---|---|
| `title` | string | Persian headline |
| `summary` | string | 1-2 sentences; used on cards, meta description, Telegram post |
| `section` | ref → sections | exactly one |
| `tags` | string[] | |
| `author` | ref → authors | |
| `medicalReviewer` | ref → authors, optional | required when `section` is clinical or pharmacy |
| `publishedAt` / `updatedAt` | ISO date | displayed as Jalali |
| `cover` | image + `coverAlt` | alt text is required |
| `sources` | `{title, url}[]` | rendered as a references block |
| `type` | `news` \| `brief` \| `list` \| `analysis` | drives the badge and card style |
| `featured` | `lead` \| `top` \| none | homepage placement |
| `draft` | boolean | excluded from the build |

**Sections (navigation order)**

| slug | Persian title |
|---|---|
| `management` | مدیریت بیمارستان |
| `finance` | اقتصاد سلامت |
| `health-it` | فناوری سلامت و هوش مصنوعی |
| `clinical` | بالینی |
| `pharmacy` | دارو |
| `dentistry` | دندانپزشکی (links out to dentalmind.github.io) |
| `workforce` | نیروی انسانی |
| `policy` | قوانین و سیاست‌گذاری |

## 4. Pages

| Route | Contents |
|---|---|
| `/` | Lead story + 4 top stories, latest feed, most read (today/week), lists rail, one block per section, newsletter sign-up |
| `/[section]/` (paginated) | Section header, featured article, article list |
| `/articles/[slug]/` | Headline, summary, byline + reviewer badge, Jalali date, reading time, body, sources, disclaimer, share buttons, related articles |
| `/authors/[slug]/` | Bio, credentials, articles |
| `/tags/[tag]/` | Tagged articles |
| `/lists/` | All "list" articles (۱۰ بیمارستان برتر…) |
| `/search/` | Pagefind UI, styled RTL |
| `/rss.xml` and `/[section]/rss.xml` | Feeds |
| `/about/`, `/editorial-policy/`, `/disclaimer/`, `/contact/`, `/privacy/` | Static pages. Editorial policy covers sourcing, medical review, corrections. |
| `/404` | Persian not-found page |

## 5. Components

`Header` (logo, section nav, search, mobile drawer) · `Footer` · `LeadStory` · `ArticleCard`
(large / medium / compact) · `SectionBlock` · `MostRead` · `ListBadge` · `Byline` ·
`ReviewedBadge` · `JalaliDate` · `ReadingTime` · `SourcesBlock` · `MedicalDisclaimer` ·
`ShareButtons` (Telegram, WhatsApp, X, LinkedIn, copy link) · `NewsletterForm` · `Pagination` ·
`Breadcrumbs` · `AdSlot` (phase 6; always labelled «تبلیغ»)

## 6. Phases

### Phase 0: Setup
- [x] Scaffold Astro + Tailwind + TypeScript; set `site` and `base` for the project-site URL
- [x] `<html lang="fa" dir="rtl">`, self-hosted Vazirmatn, base typography (line-height ~1.9 for Persian)
- [x] `deploy.yml`: install → build → Pagefind → `actions/deploy-pages`
- [ ] Turn on Pages in repo settings with "GitHub Actions" as the source

**Done when:** a "سلام" page is live at the Pages URL with the right font and RTL.

### Phase 1: Design system and layout
- [x] Colour tokens (light and dark), spacing, type scale with Persian digits
- [x] Header with 8-section nav and mobile drawer; footer
- [x] All card variants and homepage blocks built with placeholder data

**Done when:** the homepage layout works at 360 px, 768 px and 1280 px with no horizontal scroll.

### Phase 2: Content model and pages
- [x] Collections and zod schemas from §3; the build fails on an unknown section/topic or missing author. (No cover images yet, so no alt-text rule; articles without a reviewer show an "awaiting medical review" notice instead of failing the build.)
- [x] Every route in §4
- [x] `normalize-fa.mjs` runs in CI and fails on Arabic ي/ك in content
- [~] Seed content: 15 original, sourced articles across all 8 sections (incl. 2 lists) + editorial-team author. Target is still 3 per section.

**Done when:** every section, article, author and tag page renders from Markdown with no hard-coded content.

### Phase 3: Search, feeds, SEO
- [x] Pagefind search page; check that Persian queries match words with and without half-spaces
- [x] RSS feeds (site-wide and per section)
- [x] `@astrojs/sitemap`, canonical URLs, Open Graph/Twitter cards (previews for Telegram and WhatsApp)
- [x] JSON-LD: `NewsArticle` for news, `MedicalWebPage` with `reviewedBy` for clinical articles
- [ ] Lighthouse target: Performance ≥ 90, Accessibility ≥ 95, SEO 100

### Phase 4: Editorial workflow
- [ ] Sveltia CMS at `/admin` mapped to the collections; editorial workflow (draft → review → publish via PR)
- [ ] Roles via GitHub permissions: writers open PRs, editors and medical reviewers approve, admins merge
- [ ] Scheduled publishing: a daily Action that publishes articles whose `publishedAt` has passed
- [ ] Short guide for writers (`docs/WRITING_GUIDE.md`, in Persian)

### Phase 5: Engagement
- [ ] Newsletter: an embedded form from a provider reachable in Iran, or collect sign-ups and send weekly digests manually at first
- [ ] Telegram channel: Action posts title + summary + link when a new article reaches `main`
- [ ] Most read: GoatCounter API → `most-read.json` nightly → rebuild
- [ ] Events and webinars collection, with registration links
- [ ] Podcast/video pages (embeds or self-hosted audio)

### Phase 6: Later
- [ ] Job board: listings as Markdown, submitted through a GitHub Issue form and approved by an editor
- [ ] White papers and reports to download
- [ ] Ad slots and sponsored-content label
- [ ] Custom domain (e.g. a `.ir` domain) and `CNAME`

## 7. Rules for content
- Original writing only. When covering another outlet's story, summarise in our own words and link the source.
- Every clinical or pharmacy article has a named medical reviewer and a sources block.
- Every article page shows the disclaimer: «این مطلب جایگزین مشاوره با پزشک نیست.» ("This article does not replace a consultation with a doctor.")
- Corrections are noted at the bottom of the article with a date.

## 8. Open decisions
1. Final brand name and logo (working name: سلامت ایران / Iranian Healthcare).
2. Keep the project-site URL, rename the repo to `healthcareirainian.github.io`, or buy a custom domain?
3. Newsletter provider that is reachable from Iran.
4. Who are the first medical reviewers?
