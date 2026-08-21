import Link from 'next/link';
import { Metadata } from 'next';
import Card from '@/components/Card';
import CardGrid from '@/components/CardGrid';
import DomoEmbed from '@/components/DomoEmbed';
import { getActiveLeagues } from '@/lib/data';

export const metadata: Metadata = {
  title: 'MTG Corporate League',
  description: 'Join the Corporate Magic: The Gathering League for tech professionals in Utah. Sealed deck leagues with stats tracking and prizes.',
};

export default function LeagueLandingPage() {
  const activeLeagues = getActiveLeagues();
  const [featuredLeague, ...otherLeagues] = activeLeagues;

  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1 className="league-banner">MTG Corporate League</h1>
        <div className="league-layout">
          <aside className="league-sidebar">
            <h3 className="sidebar-heading">Next League</h3>
            <DomoEmbed url="https://embed.domo.com/embed/cards/PQvW4" title="League info card" height={300} />
            <h3 className="sidebar-heading">Important Dates</h3>
            <DomoEmbed url="https://embed.domo.com/embed/cards/4L7Kx" title="League info card" height={300} />
          </aside>
          <div className="league-main">
            {featuredLeague && (
              <div className="featured-league">
                <Card
                  href={`/leagues/${featuredLeague.slug}/`}
                  image={`/assets/images/leagues/${featuredLeague.image}`}
                  alt={featuredLeague.name}
                  title={featuredLeague.name}
                  featured
                />
              </div>
            )}
            <CardGrid>
              {otherLeagues.map(league => (
                <Card
                  key={league.slug}
                  href={`/leagues/${league.slug}/`}
                  image={`/assets/images/leagues/${league.image}`}
                  alt={league.name}
                  title={league.name}
                />
              ))}
            </CardGrid>
            <div className="section-cta">
              <Link href="/mtg-corporate-league/archive/" className="btn btn-secondary">View Archive</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
