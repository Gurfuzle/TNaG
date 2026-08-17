import DomoEmbed from '@/components/DomoEmbed';

export const metadata = { title: 'League Stats - Tech Networking and Games' };

export default function LeagueStatsPage() {
  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>League Stats</h1>
        <DomoEmbed url="https://embed.domo.com/embed/pages/oYErz" />
      </div>
    </section>
  );
}
