import Link from 'next/link';
import Card from '@/components/Card';
import CardGrid from '@/components/CardGrid';
import { getActiveLeagues } from '@/lib/data';

export const metadata = { title: 'MTG Corporate League - Tech Networking and Games' };

export default function LeagueLandingPage() {
  const activeLeagues = getActiveLeagues();

  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>MTG Corporate League</h1>
        <p className="page-subtitle">Current leagues in our Corporate Magic: The Gathering League.</p>
        <CardGrid>
          {activeLeagues.map(league => (
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
    </section>
  );
}
