# Architecture

## Overview

TNaG is a **statically-exported Next.js site**. All content is rendered at build
time into plain HTML/CSS/JS in the `out/` directory, then served by any static
host (locally via Nginx in Docker; in production via Nginx). There is **no
runtime application server** — the site is fully static.

```
Data files (CSV + Markdown)  ──build──▶  Next.js (App Router, SSG)  ──export──▶  out/  ──serve──▶  Nginx
```

## Tech stack

- **Next.js 14** (App Router) with `output: 'export'` — static site generation.
- **React 18** for components.
- **TypeScript**.
- **Build-time data pipeline**: `gray-matter` (Markdown frontmatter), `remark` +
  `remark-html` (Markdown → HTML), `csv-parse` (league data).
- **Nginx** (via Docker Compose) for local and production serving.

## Directory layout

```
TNaG/
├── app/                    # Next.js App Router pages (each folder = a route)
│   ├── layout.tsx          # Root layout: header + footer wrap every page
│   ├── globals.css         # Site-wide styles
│   ├── page.tsx            # Homepage
│   ├── sitemap.ts          # Generated sitemap
│   ├── robots.ts           # Generated robots.txt
│   ├── not-found.tsx       # 404 page
│   ├── about/, contact/, calendar/
│   ├── blog/
│   │   ├── page.tsx        # Blog index
│   │   └── [slug]/page.tsx # Individual post (one per Markdown file)
│   ├── league-stats/
│   │   ├── page.tsx
│   │   └── trades/page.tsx
│   ├── leagues/[slug]/page.tsx        # Individual league pages
│   └── mtg-corporate-league/
│       ├── page.tsx        # Active leagues
│       └── archive/page.tsx# Archived leagues
├── components/             # Shared React components (Header, Footer, Card,
│                           #   CardGrid, DomoEmbed, Tetris)
├── lib/data.ts             # Build-time data loading (CSV + Markdown)
├── data/
│   ├── leagues.csv         # League definitions (source of truth for leagues)
│   └── blog/               # Blog posts (Markdown + YAML frontmatter)
├── public/assets/images/   # Static images (leagues, blog, hero, logos)
├── nginx/tnag.conf         # Nginx config for production serving
├── docker-compose.yml      # Local dev server (Nginx serving out/)
├── next.config.js          # Static export configuration
├── build.sh                # install + build helper
└── docs/                   # This documentation
```

## Data model

Content is **data-file driven**, not database-backed. `lib/data.ts` is the
single module that loads and shapes all content at build time.

### Leagues — `data/leagues.csv`

One row per league. Columns: `slug`, `name`, `image`, `domo_embed_url`,
`start_date`, `archived`. `lib/data.ts` exposes:

- `getLeagues()` — all leagues.
- `getActiveLeagues()` — `archived === false`.
- `getArchivedLeagues()` — `archived === true`.

Each league renders a page at `/leagues/[slug]/` and appears in the
active/archive listings and the nav dropdown. The `domo_embed_url` powers the
embedded Domo stats dashboard via the `DomoEmbed` component.

### Blog posts — `data/blog/*.md`

One Markdown file per post; the filename becomes the URL slug. Frontmatter
fields: `title`, `date` (`Mon DD, YYYY`), `author`, `image`, `summary`, `tags`.
`getBlogPosts()` parses frontmatter, converts the body to HTML, and returns
posts sorted newest-first. The newest post is featured at the top of the blog
index.

## Rendering model

- Every route under `app/` is rendered to static HTML at build time.
- Dynamic routes (`blog/[slug]`, `leagues/[slug]`) use Next.js
  `generateStaticParams` to enumerate pages from the data files.
- `images.unoptimized: true` and `trailingSlash: true` are set because there is
  no image-optimization server and static hosts expect trailing-slash paths.
- `DomoEmbed` renders client-side iframes for interactive dashboards; core
  content does not depend on JavaScript.

## Build & serve

```bash
./build.sh          # npm install + npm run build → out/
docker compose up   # Nginx serves out/ at http://localhost:8181
npm run dev         # Dev server with hot reload at http://localhost:3000
```

Production deploys the `out/` directory to a static host. See `nginx/tnag.conf`
for MIME-type and routing configuration (important: missing MIME types have
previously caused unstyled pages in production).

## Design constraints

- **No runtime server** — anything requiring a backend (form submissions, live
  data) is delegated to external services (e.g., Domo for stats, a form handler
  for contact).
- **Content is code-adjacent, not code** — publishing a league or post means
  editing a data file and rebuilding, never touching React components.
- **Keep it static-exportable** — any new feature must survive
  `next build && next export`; avoid server-only Next.js features (server
  actions, ISR, route handlers that run at request time).
