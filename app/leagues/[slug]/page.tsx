import { getLeagues } from '@/lib/data';
import DomoEmbed from '@/components/DomoEmbed';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getLeagues().map(league => ({ slug: league.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const league = getLeagues().find(l => l.slug === params.slug);
  return { title: `${league?.name || 'League'} - MTG Corporate League` };
}

export default function LeaguePage({ params }: Props) {
  const league = getLeagues().find(l => l.slug === params.slug);
  if (!league) return null;

  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>{league.name}</h1>
        <DomoEmbed url={league.domo_embed_url} />
      </div>
    </section>
  );
}
