import { Metadata } from 'next';
import DomoEmbed from '@/components/DomoEmbed';

export const metadata: Metadata = {
  title: 'League Stats',
  description: 'View all-time player statistics, win rates, and standings across all Corporate Magic: The Gathering League seasons.',
};

export default function LeagueStatsPage() {
  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>League Stats</h1>
        <DomoEmbed url="https://embed.domo.com/embed/pages/oYErz" title="All-time league statistics dashboard" />
      </div>
    </section>
  );
}
