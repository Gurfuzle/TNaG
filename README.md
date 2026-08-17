# Tech Networking and Games (TNaG)

A static site for the Tech Networking and Games community, built with Next.js. Features the Corporate Magic: The Gathering League, blog posts, event calendar, and league statistics.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for local serving via Nginx)

## Quick Start

```bash
# Install dependencies and build
./build.sh

# Serve locally at http://localhost:8181
docker compose up
```

Or for development with hot reload:

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Project Structure

```
TNaG/
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                 # Root layout (header/footer)
│   ├── globals.css                # Site-wide styles
│   ├── page.tsx                   # Homepage
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx               # Blog index
│   │   └── [slug]/page.tsx        # Individual posts
│   ├── calendar/page.tsx
│   ├── league-stats/
│   │   ├── page.tsx
│   │   └── trades/page.tsx
│   ├── leagues/[slug]/page.tsx    # Individual league pages
│   └── mtg-corporate-league/
│       ├── page.tsx               # Active leagues
│       └── archive/page.tsx       # Archived leagues
├── components/                    # Shared React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Card.tsx
│   ├── CardGrid.tsx
│   └── DomoEmbed.tsx
├── lib/
│   └── data.ts                    # Build-time data loading (CSV + Markdown)
├── data/
│   ├── leagues.csv                # League definitions
│   └── blog/                      # Blog posts (Markdown + frontmatter)
├── public/
│   └── assets/images/             # Static images (leagues, blog, hero, logos)
├── nginx/tnag.conf                # Nginx config for production serving
├── docker-compose.yml             # Local dev server (Nginx)
├── next.config.js                 # Static export configuration
├── package.json
└── tsconfig.json
```

## Adding a New League

1. **Add the league image** to `public/assets/images/leagues/`. Use a square or near-square image. Filename should match the slug (e.g., `my-new-set.jpg`).

2. **Add a row to `data/leagues.csv`** with these columns:

   | Column | Description | Example |
   |--------|-------------|---------|
   | `slug` | URL-safe identifier (lowercase, hyphens) | `my-new-set` |
   | `name` | Display name | `My New Set` |
   | `image` | Filename in `public/assets/images/leagues/` | `my-new-set.jpg` |
   | `domo_embed_url` | Domo dashboard embed URL | `https://embed.domo.com/embed/pages/abc12` |
   | `start_date` | League start date (YYYY-MM-DD) | `2026-09-01` |
   | `archived` | `false` for active, `true` for archived | `false` |

   Example row:
   ```
   my-new-set,My New Set,my-new-set.jpg,https://embed.domo.com/embed/pages/abc12,2026-09-01,false
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

4. The league will appear on the [MTG Corporate League](/mtg-corporate-league/) page and in the navigation dropdown. When the league ends, change `archived` to `true` to move it to the archive.

## Adding a New Blog Post

1. **Create a Markdown file** in `data/blog/` named with the desired URL slug (e.g., `my-new-post.md`). The filename becomes the URL: `/blog/my-new-post/`.

2. **Add YAML frontmatter** at the top:

   ```markdown
   ---
   title: "My New Blog Post"
   date: Aug 17, 2026
   author: "Your Name"
   image: my-new-post-cover.jpg
   summary: "A brief description of the post."
   tags:
     - mtg
     - league
   ---

   # My New Blog Post

   Your markdown content goes here.
   ```

   | Field | Required | Description |
   |-------|----------|-------------|
   | `title` | Yes | Post title |
   | `date` | Yes | Publication date in `Mon DD, YYYY` format (e.g., `Aug 17, 2026`) |
   | `author` | No | Author name |
   | `image` | No | Cover image filename (stored in `public/assets/images/blog/`) |
   | `summary` | No | Short description |
   | `tags` | No | List of tags |

3. **Add the cover image** (if using one) to `public/assets/images/blog/`. Square images display best on the blog index cards.

4. **Rebuild:**
   ```bash
   npm run build
   ```

5. The post will automatically appear as the featured (large, centered) card at the top of the blog index since posts are sorted newest-first.

### Date Format

Dates **must** follow the format `Mon DD, YYYY`:

> Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec

Example: `Sep 15, 2026`

### Markdown Support

Blog posts support standard Markdown plus:
- Tables
- Fenced code blocks
- HTML within Markdown

## Archiving a League

Edit `data/leagues.csv` and change `archived` from `false` to `true`, then rebuild.

## Development

```bash
npm run dev        # Start dev server with hot reload at localhost:3000
npm run build      # Build static export to out/
docker compose up  # Serve out/ via Nginx at localhost:8181
```

The site is statically exported — no Node.js server needed in production. Deploy the `out/` directory to any static hosting (Nginx, S3, Netlify, etc.).
