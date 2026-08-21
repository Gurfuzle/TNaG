import { MetadataRoute } from 'next';
import { getLeagues, getBlogPosts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.technetworkingandgames.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/mtg-corporate-league/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/mtg-corporate-league/archive/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/calendar/`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/league-stats/`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/league-stats/trades/`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/about/`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const leagues = getLeagues();
  const leaguePages: MetadataRoute.Sitemap = leagues.map(league => ({
    url: `${baseUrl}/leagues/${league.slug}/`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const posts = await getBlogPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...leaguePages, ...blogPages];
}
