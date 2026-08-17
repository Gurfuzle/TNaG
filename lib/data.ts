import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface League {
  slug: string;
  name: string;
  image: string;
  domo_embed_url: string;
  start_date: string;
  archived: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  tags: string[];
  bodyHtml: string;
}

export function getLeagues(): League[] {
  const csvPath = path.join(DATA_DIR, 'leagues.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true, bom: true });
  return records.map((row: any) => ({
    slug: row.slug,
    name: row.name,
    image: row.image,
    domo_embed_url: row.domo_embed_url,
    start_date: row.start_date,
    archived: row.archived.trim().toLowerCase() === 'true',
  }));
}

export function getActiveLeagues(): League[] {
  return getLeagues().filter(l => !l.archived);
}

export function getArchivedLeagues(): League[] {
  return getLeagues().filter(l => l.archived);
}

function parseDate(dateStr: string): Date {
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date(0);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(DATA_DIR, 'blog');
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const { data, content } = matter(raw);
    const processed = await remark().use(html).process(content);

    posts.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title || file.replace(/\.md$/, '').replace(/-/g, ' '),
      date: data.date ? String(data.date) : '',
      author: data.author || '',
      image: data.image || '',
      summary: data.summary || '',
      tags: data.tags || [],
      bodyHtml: processed.toString(),
    });
  }

  posts.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  return posts;
}
