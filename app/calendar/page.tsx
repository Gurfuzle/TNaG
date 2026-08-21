import { Metadata } from 'next';
import DomoEmbed from '@/components/DomoEmbed';

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Upcoming events for Tech Networking and Games — MTG league nights, D&D sessions, and board game meetups in Utah and Salt Lake County.',
};

export default function CalendarPage() {
  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>Calendar</h1>
        <DomoEmbed url="https://embed.domo.com/embed/pages/Vm179" title="Upcoming events calendar" />
      </div>
    </section>
  );
}
