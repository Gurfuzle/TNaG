import './globals.css';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getActiveLeagues } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Tech Networking and Games',
  icons: {
    icon: '/assets/images/logos/TNGheadIcon_whiteonblue.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const activeLeagues = getActiveLeagues();

  return (
    <html lang="en">
      <body>
        <Header activeLeagues={activeLeagues} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
