# TNaG Website - Design Document

## Overview

Replace the current Wix-hosted site at technetworkingandgames.com with a self-hosted static site served by nginx. The site is primarily static HTML/CSS/JS with embedded Domo dashboards and a lightweight blog.

## Goals

1. **Cost reduction** — eliminate Wix subscription
2. **CSV-driven content** — adding a new MTG league = one CSV row + one image
3. **Portable** — runs on localhost for dev, deployable to Digital Ocean or a home server
4. **Simple maintenance** — no CMS, no database, no server-side runtime in production
5. **Preserve existing functionality** — embedded Domo content, blog, social links

## Architecture

```
┌─────────────────────────────────────────────┐
│                   nginx                      │
│  (serves static files, reverse proxy later)  │
└──────────────────────┬──────────────────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    Static HTML    Static Assets     Blog Posts
    (pages/)       (assets/)         (blog/)
```

### Build Pipeline

A lightweight build script (Python) reads CSV data and templates to generate static HTML at build time. No runtime dependencies in production.

```
data/leagues.csv  ─┐
templates/*.html  ─┼─→  build.py  ─→  dist/  ─→  nginx serves dist/
assets/           ─┘
```

### Why a build step instead of client-side JS?

- Pages are indexable by search engines without JS
- Fast load times (no fetch-then-render)
- Still trivially simple — one script, Jinja2 templates, CSV input
- Blog posts can be Markdown files rendered at build time

## Site Map

```
/                          → Homepage (hero bg: game room photo, featured posts, newsletter signup)
/mtg-corporate-league      → League landing page (cards for current/active leagues)
/mtg-corporate-league/archive → Archive page (cards for archived leagues)
/leagues/{slug}            → Individual league page (embedded Domo dashboard)
/league-stats              → Trades for League Credit (embedded Domo dashboard)
/calendar                  → Calendar/events page (embedded Domo dashboard)
/blog                      → Blog index (paginated list of posts)
/blog/{slug}               → Individual blog post
/about                     → About page (static text + headshot image)
```

## Navigation Structure

```
HOME | MTG CORPORATE LEAGUE ▾ | LEAGUE STATS ▾ | CALENDAR | BLOG | ABOUT
                 │                      │
                 │                      ├─ League Stats (→ /mtg-corporate-league)
                 │                      └─ Trades for League Credit (→ /league-stats)
                 │
                 ├─ Secrets of Strixhaven       ┐
                 ├─ Lorwyn Eclipsed             │ archived=false
                 ├─ Avatar: The Last Airbender  │ (current leagues)
                 ├─ Edge of Eternities          │
                 ├─ Final Fantasy               │
                 ├─ Tarkir: Dragonstorm         ┘
                 │
                 └─ Archive ▸                   → links to /mtg-corporate-league/archive
```

The MTG Corporate League dropdown shows only current (non-archived) leagues plus a link to the Archive page. The archive page lists all archived leagues as cards.

### MTG Corporate League Landing Page (`/mtg-corporate-league`)

Displays current leagues as image cards (grid layout). Each card links to that league's individual page. This serves as a visual hub for active leagues.

### Archive Page (`/mtg-corporate-league/archive`)

Same card layout, but shows all leagues where `archived=true`. Accessible from the dropdown nav and from the landing page.

Both pages are generated from the same `data/leagues.csv` — the `archived` column determines which page a league appears on.

## CSV-Driven League Management

All leagues — current and archived — live in a single CSV. An `archived` column controls where each league appears in the navigation dropdown.

### data/leagues.csv

```csv
slug,name,image,domo_embed_url,start_date,archived
secrets-of-strixhaven,Secrets of Strixhaven,secrets-of-strixhaven.jpg,https://embed.domo.com/embed/pages/yXo4V,2026-04-27,false
lorwyn-eclipsed,Lorwyn Eclipsed,lorwyn-eclipsed.jpg,https://embed.domo.com/embed/pages/mY0PR,2026-01-26,false
...
murders-at-karlov-manor,Murders at Karlov Manor,murders-at-karlov-manor.jpg,https://public.domo.com/embed/pages/pgEq6,2024-02-12,true
```

Columns:
- `slug` — URL-safe identifier, used for page path and image filename
- `name` — display name in nav and page title
- `image` — filename in `assets/images/leagues/`
- `domo_embed_url` — iframe src for the embedded Domo dashboard
- `start_date` — league start date (used for sort order, newest first)
- `archived` — `true` moves league to archive page/section; `false` shows in main nav

### Dropdown behavior

The MTG Corporate League dropdown renders in two sections based on the `archived` column:

```
MTG CORPORATE LEAGUE ▾
├─ Secrets of Strixhaven        ┐
├─ Lorwyn Eclipsed              │ archived = false
├─ Avatar: The Last Airbender   │ (current leagues, shown first)
├─ ...                          ┘
├─── Archive ───────────────    ← visual separator
├─ Murders at Karlov Manor      ┐
├─ Outlaws of Thunder Junction  │ archived = true
├─ Bloomburrow                  │ (older leagues, shown below)
└─ ...                          ┘
```

Both current and archived leagues get their own page at `/leagues/{slug}` — the only difference is their placement in the nav dropdown.

### Adding a new league

1. Add a row to `data/leagues.csv` with `archived` = `false`
2. Drop the menu image into `assets/images/leagues/`
3. Run `./build.sh`
4. New league appears in the "current" section of the dropdown and gets its own page

### Archiving a league

1. Change `archived` from `false` to `true` in the CSV
2. Run `./build.sh`
3. League moves to the archive section of the dropdown (page still works at the same URL)

## Directory Structure

```
TNaG/
├── docs/                    ← design docs (this file)
├── data/
│   ├── leagues.csv          ← league definitions
│   └── blog/                ← blog post markdown files
│       ├── 2024-10-15-timpcon.md
│       └── 2024-11-01-strixhaven-launch.md
├── templates/
│   ├── base.html            ← shared layout (nav, footer, head)
│   ├── index.html           ← homepage
│   ├── league-landing.html  ← MTG Corporate League card grid (current leagues)
│   ├── league-archive.html  ← Archive card grid (archived leagues)
│   ├── league.html          ← individual league page template
│   ├── league-stats.html    ← stats page
│   ├── calendar.html        ← calendar page
│   ├── blog-index.html      ← blog listing
│   ├── blog-post.html       ← individual blog post
│   └── about.html           ← about page
├── assets/
│   ├── css/
│   │   └── style.css        ← single stylesheet
│   ├── js/
│   │   └── nav.js           ← dropdown behavior, mobile menu
│   ├── images/
│   │   ├── logos/            ← TNG logos (SVG preferred)
│   │   ├── leagues/         ← league menu images
│   │   ├── blog/            ← blog post images
│   │   └── hero/            ← hero/background images
│   └── fonts/               ← if self-hosting any fonts
├── build.py                 ← build script (Jinja2 + CSV → HTML)
├── build.sh                 ← wrapper: installs deps if needed, runs build
├── dist/                    ← generated output (served by nginx)
├── nginx/
│   └── tnag.conf            ← nginx server config
├── Dockerfile               ← optional: containerized nginx + dist
└── docker-compose.yml       ← optional: for local dev / deployment
```

## Technology Choices

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Web server | nginx | Fast, simple config, production-ready |
| Templating | Jinja2 (Python) | Familiar, powerful, minimal deps |
| Blog | Markdown → HTML (python-markdown) | Easy to write, version-controlled |
| Styling | Plain CSS (no framework) | Site is simple, no build tool needed |
| JS | Vanilla JS | Only need dropdown + mobile menu toggle |
| Containerization | Docker (optional) | Consistent dev/prod, easy deployment |

## Embedded Domo Content

League pages embed Domo dashboards via iframes. The embed URLs are stored in `data/leagues.csv` and injected into templates at build time.

Standalone pages with Domo embeds (not data-driven, hardcoded in templates):
- **Calendar**: `https://embed.domo.com/embed/pages/Vm179`
- **Trades for League Credit**: `https://embed.domo.com/embed/pages/79Bww`

Note: "League Stats" is the league landing page that shows cards/links to all individual league pages (each with its own Domo embed from the CSV). It is NOT itself a Domo embed — it's the card grid page at `/mtg-corporate-league`.

```html
<div class="domo-embed">
  <iframe src="{{ embed_url }}"
          width="100%" height="800"
          frameborder="0"
          allowfullscreen>
  </iframe>
</div>
```

## Design / Branding

- **Logo**: White TNG logo on dark/blue backgrounds (preferred); blue logo on light backgrounds
- **Primary color**: `#003366` (extracted from logo SVG)
- **Logo files**: SVGs in `assets/images/logos/` — white version for nav/footer, blue for light contexts
- **Typography**: System font stack (fast, no external requests)
- **Layout**: Clean, minimal — content-focused, not decoration-heavy
- **Responsive**: Mobile-first, hamburger menu on small screens
- **Social links**: Instagram, Twitter/X, LinkedIn, Facebook in header + footer

## About Page

Static content page (no Domo embed). Content:

- **Photo**: `assets/images/michael-headshot.png`
- **Lead**: Michael Swensen
- **Description**: Tech Networking and Games is a group of technical professionals who saw an opportunity to help people build their professional networks using Magic the Gathering, Dungeons & Dragons, and other tabletop games.
- **How it works**: Members volunteer through their various employers and partner with local game stores to schedule events. The goal is helping participants build relationships and grow their professional network.
- **Philosophy**: "We love games and we love tech and we want to see our community grow through both."
- **Location**: Utah (Utah and Salt Lake counties)
- **Contact**: technetworkingandgames@gmail.com
- **Social links**: Instagram, Twitter/X, LinkedIn, Facebook

## Blog System

Blog posts are Markdown files in `data/blog/` with YAML frontmatter:

```markdown
---
title: "TimpCon 2024 Recap"
date: 2024-10-15
image: timpcon-2024.jpg
summary: "A look back at this year's TimpCon event."
tags: [events, timpcon]
---

Post content here...
```

The build script renders these to HTML and generates the blog index page (newest first, paginated).

### Blog Migration

Existing blog posts will be migrated from Wix. Content will be converted to Markdown files with frontmatter. Images will be downloaded from Wix static CDN and stored in `assets/images/blog/`.

## Deployment Options

### Option A: Digital Ocean Droplet (~$4-6/mo)

- Cheapest VPS, static IP included
- Docker or bare nginx install
- Easy DNS setup, Let's Encrypt for HTTPS
- GitHub Actions or simple rsync deploy

### Option B: Home Server

- Free hosting, but needs:
  - Dynamic DNS (e.g., Cloudflare Tunnel, DuckDNS)
  - Port forwarding or Cloudflare Tunnel for HTTPS
  - UPS / reliability considerations
- Good for intranet-first with public access added later

### Option C: Static hosting (Cloudflare Pages, GitHub Pages)

- Free tier available
- No server to manage
- Limitation: no server-side logic (fine for this site)
- Deploy on git push

## Development Workflow

1. Edit templates, CSS, blog posts, or CSV data
2. Run `./build.sh` to regenerate `dist/`
3. nginx serves `dist/` on localhost:8080
4. When satisfied, deploy to production

### Live reload (optional)

Use `fswatch` to watch source files and auto-rebuild + reload browser.

## Phase Plan

### Phase 1: Local Development (current)
- [x] Design document
- [ ] Set up project structure
- [ ] Build script (CSV → HTML generation)
- [ ] Base template with nav (including CSV-driven dropdown)
- [ ] Homepage
- [ ] One league page (prove Domo embed works)
- [ ] nginx config for localhost

### Phase 2: Full Content
- [ ] All league pages
- [ ] League stats pages
- [ ] Blog system (Markdown → HTML)
- [ ] Calendar page
- [ ] About page
- [ ] Mobile responsive styling

### Phase 3: Deployment
- [ ] Choose hosting (DO vs home server vs static host)
- [ ] Docker packaging (if applicable)
- [ ] DNS migration plan
- [ ] HTTPS / Let's Encrypt
- [ ] Redirect old Wix URLs → new paths

### Phase 4: Polish
- [ ] SEO meta tags, Open Graph
- [ ] 404 page
- [ ] Performance (image optimization, caching headers)
- [ ] Analytics (privacy-friendly, e.g., Plausible or simple nginx logs)
