import { Metadata } from 'next';
import DomoEmbed from '@/components/DomoEmbed';

export const metadata: Metadata = {
  title: 'Trades for League Credit',
  description: 'Track card trades and league credit transactions in the Corporate Magic: The Gathering League.',
};

export default function TradesPage() {
  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>Trades for League Credit</h1>
        <DomoEmbed url="https://embed.domo.com/embed/pages/79Bww" title="Trades for league credit dashboard" />
      </div>
    </section>
  );
}
