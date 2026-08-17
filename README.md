# Tech Networking and Games (TNaG)

A static site for the Tech Networking and Games community, featuring the Corporate Magic: The Gathering League, blog posts, event calendar, and league statistics.

## Prerequisites

- Python 3.8+
- Docker & Docker Compose (for local serving)

## Quick Start

```bash
# Install dependencies and build
./build.sh

# Serve locally at http://localhost:8181
docker compose up
```

Or manually:

```bash
pip3 install jinja2 markdown pyyaml
python3 build.py
docker compose up
```

## Project Structure

```
TNaG/
├── assets/
│   ├── css/style.css          # Site-wide styles
│   ├── images/
│   │   ├── blog/              # Blog post images
│   │   ├── leagues/           # League cover images
│   │   ├── hero/              # Homepage hero images
│   │   └── logos/             # Brand logos
│   └── js/nav.js              # Mobile nav toggle
├── data/
│   ├── leagues.csv            # League definitions
│   └── blog/                  # Blog posts (Markdown + frontmatter)
├── templates/                 # Jinja2 HTML templates
├── nginx/tnag.conf            # Nginx config for local dev
├── dist/                      # Built output (do not edit directly)
├── build.py                   # Static site generator
├── build.sh                   # Build helper script
└── docker-compose.yml         # Local dev server
```

## Adding a New League

1. **Add the league image** to `assets/images/leagues/`. The filename should match the slug (e.g., `my-new-set.jpg`). Use a square or near-square image for best results.

2. **Add a row to `data/leagues.csv`** with the following columns:

   | Column | Description | Example |
   |--------|-------------|---------|
   | `slug` | URL-safe identifier (lowercase, hyphens) | `my-new-set` |
   | `name` | Display name | `My New Set` |
   | `image` | Filename in `assets/images/leagues/` | `my-new-set.jpg` |
   | `domo_embed_url` | Domo dashboard embed URL | `https://embed.domo.com/embed/pages/abc12` |
   | `start_date` | League start date (YYYY-MM-DD) | `2026-09-01` |
   | `archived` | `false` for active, `true` for archived | `false` |

   Example row:
   ```
   my-new-set,My New Set,my-new-set.jpg,https://embed.domo.com/embed/pages/abc12,2026-09-01,false
   ```

3. **Rebuild the site:**
   ```bash
   python3 build.py
   ```

4. The league will appear on the [MTG Corporate League](/mtg-corporate-league/) page. When the league ends, change `archived` to `true` in the CSV to move it to the archive page.

## Adding a New Blog Post

1. **Create a Markdown file** in `data/blog/` named with the desired URL slug (e.g., `my-new-post.md`). The filename becomes the URL: `/blog/my-new-post/`.

2. **Add YAML frontmatter** at the top of the file:

   ```markdown
   ---
   title: "My New Blog Post"
   date: Aug 17, 2026
   author: "Your Name"
   image: my-new-post-cover.jpg
   summary: "A brief description of the post for the blog index."
   tags:
     - mtg
     - league
   ---

   # My New Blog Post

   Your markdown content goes here. You can use standard Markdown syntax
   including **bold**, *italic*, [links](https://example.com), images, and more.
   ```

   | Field | Required | Description |
   |-------|----------|-------------|
   | `title` | Yes | Post title displayed on the page and in the card |
   | `date` | Yes | Publication date in `Mon DD, YYYY` format (e.g., `Aug 17, 2026`) |
   | `author` | No | Author name |
   | `image` | No | Cover image filename (stored in `assets/images/blog/`) |
   | `summary` | No | Short description (not currently displayed on index, but used internally) |
   | `tags` | No | List of tags for categorization |

3. **Add the cover image** (if using one) to `assets/images/blog/`. The image is displayed as a square on the blog index, so square or near-square images work best.

4. **Rebuild the site:**
   ```bash
   python3 build.py
   ```

5. The post will automatically appear as the featured (large, centered) card at the top of the blog index since posts are sorted newest-first by date.

### Date Format

Dates **must** follow the format `Mon DD, YYYY` where `Mon` is the 3-letter month abbreviation:

> Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec

Example: `Sep 15, 2026`

### Markdown Support

Blog post bodies support [Python-Markdown](https://python-markdown.github.io/) with the `extra` and `smarty` extensions, which includes:

- Tables
- Fenced code blocks
- Footnotes
- Abbreviations
- Smart quotes and dashes

## Archiving a League

To move a league from the active page to the archive, edit `data/leagues.csv` and change the `archived` column from `false` to `true`, then rebuild.

## Development

The site is a pure static site generator — edit templates, data, or assets, then run `python3 build.py` to regenerate `dist/`. The Docker Compose setup serves `dist/` via Nginx with clean URLs (trailing slashes).

To preview changes locally:

```bash
python3 build.py
docker compose up
# Visit http://localhost:8181
```
