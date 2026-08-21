import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLeagues } from '@/lib/data';
import DomoEmbed from '@/components/DomoEmbed';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getLeagues().map(league => ({ slug: league.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const league = getLeagues().find(l => l.slug === params.slug);
  if (!league) return { title: 'Not Found' };
  const description = `View stats and standings for the ${league.name} Corporate Magic: The Gathering League for tech professionals in Utah.`;
  return {
    title: league.name,
    description,
    openGraph: {
      title: league.name,
      description,
      images: [{ url: `/assets/images/leagues/${league.image}`, width: 1080, height: 1080 }],
    },
  };
}

export default function LeaguePage({ params }: Props) {
  const league = getLeagues().find(l => l.slug === params.slug);
  if (!league) notFound();

  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>{league.name}</h1>
        <DomoEmbed url={league.domo_embed_url} title={`${league.name} league statistics dashboard`} />
      </div>
    </section>
  );
}
