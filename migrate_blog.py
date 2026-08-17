#!/usr/bin/env python3
"""One-time migration script: fetch blog posts from Wix and save as Markdown."""
import os
import re
import subprocess
import time
from pathlib import Path

from bs4 import BeautifulSoup
import html2text

ROOT = Path(__file__).parent
BLOG_DIR = ROOT / "data" / "blog"
IMAGES_DIR = ROOT / "assets" / "images" / "blog"
BASE_URL = "https://www.technetworkingandgames.com/post"

SLUGS = [
    "fall-2019-magic-the-networking-recap",
    "making-us-better-through-games",
    "wilds-of-eldraine-corporate-league",
    "ikoria-lair-of-behemoths-final-results",
    "kamigawa-neon-dynasty-corporate-league",
    "december-meetup",
    "a-modern-resume-in-a-post-shutdown-world",
    "corporate-magic-league-theros-beyond-death",
    "join-us-in-october",
    "meet-people-play-games-build-your-network",
    "dungeons-and-dragons-adventures-in-the-forgotten-realms-utah-corporate-league",
    "2d4-damage",
    "networking-in-a-crazy-world",
    "corporate-magic-league-throne-of-eldraine",
    "core-2021-corporate-league",
    "zendikar-rising-corporate-league",
    "ikoria-lair-of-behemoths-utah-corporate-league",
    "streets-of-new-capenna-corporate-league",
    "lost-caverns-of-ixalan-corporate-league",
    "timpcon-2024",
    "march-of-the-machine-corporate-league",
    "kamigawa-neon-dynasty-corporate-league-wrap-up",
    "kaldheim-corporate-league",
    "magic-the-networking-fall-2019",
    "is-it-time-to-dust-off-your-resume",
    "tech-networking-and-games-mystery-league",
    "the-brothers-war-corporate-league",
]


def curl_fetch(url):
    """Fetch URL using curl to avoid Python SSL issues."""
    result = subprocess.run(
        ["curl", "-sL", "--max-time", "30", url],
        capture_output=True, text=True
    )
    if result.returncode == 0 and result.stdout:
        return result.stdout
    return None


def curl_download(url, filepath):
    """Download binary file using curl."""
    result = subprocess.run(
        ["curl", "-sL", "--max-time", "30", "-o", str(filepath), url],
        capture_output=True
    )
    if result.returncode == 0 and filepath.exists() and filepath.stat().st_size > 100:
        return True
    if filepath.exists():
        filepath.unlink()
    return False


def fetch_post(slug):
    url = f"{BASE_URL}/{slug}"
    print(f"  Fetching: {slug}")
    html = curl_fetch(url)
    if not html:
        print(f"    SKIP (fetch failed)")
        return None

    soup = BeautifulSoup(html, "html.parser")

    # Extract title
    title_el = soup.find("h1")
    title = title_el.get_text(strip=True) if title_el else slug.replace("-", " ").title()

    # Extract date
    date_str = ""
    time_el = soup.find("time")
    if time_el:
        date_str = time_el.get("datetime", "") or time_el.get_text(strip=True)
    if not date_str:
        for span in soup.find_all("span"):
            text = span.get_text(strip=True)
            if re.match(r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d", text):
                date_str = text
                break

    # Extract main content
    content_el = None
    for selector in [
        "[data-hook='post-body']",
        ".blog-post-content",
        "article",
        "[class*='post-content']",
        "[class*='rich-text']",
    ]:
        content_el = soup.select_one(selector)
        if content_el:
            break

    if not content_el:
        content_el = soup.find("main") or soup.find("body")

    # Download images and rewrite URLs
    images_downloaded = []
    if content_el:
        for img in content_el.find_all("img"):
            src = img.get("src", "")
            if not src or "data:" in src:
                continue
            img_filename = download_image(src, slug, len(images_downloaded))
            if img_filename:
                img["src"] = f"/assets/images/blog/{img_filename}"
                images_downloaded.append(img_filename)

    # Get featured image
    featured_image = ""
    og_img = soup.find("meta", property="og:image")
    if og_img and og_img.get("content"):
        featured_image = download_image(og_img["content"], slug, "cover")
    elif images_downloaded:
        featured_image = images_downloaded[0]

    # Convert to markdown
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.body_width = 0
    content_html = str(content_el) if content_el else ""
    body_md = h.handle(content_html).strip()
    body_md = re.sub(r"\n{3,}", "\n\n", body_md)

    # Extract summary
    summary = ""
    for line in body_md.split("\n"):
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith("!") and not line.startswith("["):
            summary = line[:200]
            break

    return {
        "slug": slug,
        "title": title,
        "date": date_str,
        "author": "Michael Swensen",
        "image": featured_image,
        "summary": summary,
        "body": body_md,
    }


def download_image(url, slug, index):
    """Download an image and return the local filename."""
    if not url.startswith("http"):
        return ""

    # Clean Wix image transforms
    url = url.split("/v1/fill/")[0] if "/v1/fill/" in url else url

    ext = "jpg"
    if ".png" in url.lower():
        ext = "png"
    elif ".gif" in url.lower():
        ext = "gif"
    elif ".webp" in url.lower():
        ext = "webp"

    filename = f"{slug}-{index}.{ext}"
    filepath = IMAGES_DIR / filename

    if filepath.exists():
        return filename

    if curl_download(url, filepath):
        return filename
    return ""


def save_post(post):
    """Save a post as a Markdown file with YAML frontmatter."""
    filepath = BLOG_DIR / f"{post['slug']}.md"

    lines = ["---"]
    title_escaped = post["title"].replace('"', '\\"')
    lines.append(f'title: "{title_escaped}"')
    if post["date"]:
        lines.append(f"date: {post['date']}")
    lines.append(f'author: "{post["author"]}"')
    if post["image"]:
        lines.append(f"image: {post['image']}")
    if post["summary"]:
        summary_escaped = post["summary"].replace('"', '\\"')
        lines.append(f'summary: "{summary_escaped}"')
    lines.append("---")
    lines.append("")
    lines.append(post["body"])

    filepath.write_text("\n".join(lines), encoding="utf-8")
    return filepath.name


def main():
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Migrating {len(SLUGS)} blog posts...")
    success = 0
    for slug in SLUGS:
        post = fetch_post(slug)
        if post:
            filename = save_post(post)
            print(f"    Saved: {filename}")
            success += 1
        time.sleep(0.5)

    print(f"\nDone: {success}/{len(SLUGS)} posts migrated to data/blog/")


if __name__ == "__main__":
    main()
