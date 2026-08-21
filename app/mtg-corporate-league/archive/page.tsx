import Link from 'next/link';
import { Metadata } from 'next';
import Card from '@/components/Card';
import CardGrid from '@/components/CardGrid';
import { getArchivedLeagues } from '@/lib/data';

export const metadata: Metadata = {
  title: 'League Archive',
  description: 'Browse past seasons of the Corporate Magic: The Gathering League — view stats and results from previous sealed deck leagues.',
};

export default function ArchivePage() {
  const archivedLeagues = getArchivedLeagues();

  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>League Archive</h1>
        <p className="page-subtitle">Past leagues from our Corporate Magic: The Gathering League.</p>
        <CardGrid>
          {archivedLeagues.map(league => (
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
          <Link href="/mtg-corporate-league/" className="btn btn-secondary">&larr; Back to Current Leagues</Link>
        </div>
      </div>
    </section>
  );
}
