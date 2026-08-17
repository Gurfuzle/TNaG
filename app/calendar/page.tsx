import DomoEmbed from '@/components/DomoEmbed';

export const metadata = { title: 'Calendar - Tech Networking and Games' };

export default function CalendarPage() {
  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>Calendar</h1>
        <DomoEmbed url="https://embed.domo.com/embed/pages/Vm179" />
      </div>
    </section>
  );
}
