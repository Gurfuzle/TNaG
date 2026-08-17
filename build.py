#!/usr/bin/env python3
import csv
import os
import shutil
from datetime import datetime
from pathlib import Path

import yaml
import markdown
from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).parent
DIST = ROOT / "dist"
TEMPLATES = ROOT / "templates"
DATA = ROOT / "data"
ASSETS = ROOT / "assets"


def load_leagues():
    leagues = []
    with open(DATA / "leagues.csv", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row["archived"] = row["archived"].strip().lower() == "true"
            leagues.append(row)
    return leagues


def load_blog_posts():
    blog_dir = DATA / "blog"
    if not blog_dir.exists():
        return []

    posts = []
    for md_file in blog_dir.glob("*.md"):
        text = md_file.read_text(encoding="utf-8")
        if not text.startswith("---"):
            continue

        # Split frontmatter from body
        parts = text.split("---", 2)
        if len(parts) < 3:
            continue

        frontmatter = yaml.safe_load(parts[1])
        body_md = parts[2].strip()
        body_html = markdown.markdown(body_md, extensions=["extra", "smarty"])

        post = {
            "slug": md_file.stem,
            "title": frontmatter.get("title", md_file.stem.replace("-", " ").title()),
            "date": str(frontmatter.get("date", "")),
            "author": frontmatter.get("author", ""),
            "image": frontmatter.get("image", ""),
            "summary": frontmatter.get("summary", ""),
            "tags": frontmatter.get("tags", []),
            "body_html": body_html,
        }
        posts.append(post)

    def parse_date(p):
        try:
            return datetime.strptime(p["date"], "%b %d, %Y")
        except (ValueError, TypeError):
            return datetime.min

    posts.sort(key=parse_date, reverse=True)
    return posts


def build():
    # Clear dist contents without deleting the directory (preserves Docker mount)
    if DIST.exists():
        for item in DIST.iterdir():
            if item.is_dir():
                shutil.rmtree(item)
            else:
                item.unlink()
    else:
        DIST.mkdir()

    env = Environment(loader=FileSystemLoader(str(TEMPLATES)))

    leagues = load_leagues()
    active_leagues = [l for l in leagues if not l["archived"]]
    archived_leagues = [l for l in leagues if l["archived"]]
    blog_posts = load_blog_posts()

    ctx = {
        "active_leagues": active_leagues,
        "archived_leagues": archived_leagues,
        "all_leagues": leagues,
        "blog_posts": blog_posts,
        "recent_posts": blog_posts[:3],
    }

    # Homepage
    render(env, "index.html", DIST / "index.html", ctx)

    # League landing (active leagues card grid)
    render(env, "league-landing.html", DIST / "mtg-corporate-league" / "index.html", ctx)

    # Archive page
    render(env, "league-archive.html", DIST / "mtg-corporate-league" / "archive" / "index.html", ctx)

    # Individual league pages
    for league in leagues:
        out = DIST / "leagues" / league["slug"] / "index.html"
        render(env, "league.html", out, {**ctx, "league": league})

    # League Stats
    render(env, "league-stats.html", DIST / "league-stats" / "index.html", ctx)

    # Trades for League Credit
    render(env, "league-stats-trades.html", DIST / "league-stats" / "trades" / "index.html", ctx)

    # Calendar
    render(env, "calendar.html", DIST / "calendar" / "index.html", ctx)

    # About
    render(env, "about.html", DIST / "about" / "index.html", ctx)

    # Blog index
    render(env, "blog-index.html", DIST / "blog" / "index.html", ctx)

    # Individual blog posts
    for post in blog_posts:
        out = DIST / "blog" / post["slug"] / "index.html"
        render(env, "blog-post.html", out, {**ctx, "post": post})

    # Copy assets
    dest_assets = DIST / "assets"
    if dest_assets.exists():
        shutil.rmtree(dest_assets)
    shutil.copytree(ASSETS, dest_assets)

    print(f"Built {len(leagues)} league pages + {len(blog_posts)} blog posts + 8 static pages into dist/")


def render(env, template_name, output_path, context):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    template = env.get_template(template_name)
    html = template.render(**context)
    output_path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    build()
