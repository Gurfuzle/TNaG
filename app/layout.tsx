import './globals.css';
import Script from 'next/script';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getActiveLeagues } from '@/lib/data';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.technetworkingandgames.com'),
  title: {
    default: 'Tech Networking and Games | Tabletop Gaming Community in Utah',
    template: '%s | Tech Networking and Games',
  },
  description: 'A community of tech professionals networking through Magic: The Gathering, Dungeons & Dragons, and board games in Utah and Salt Lake County.',
  keywords: ['Magic: The Gathering', 'MTG', 'Dungeons & Dragons', 'D&D', 'board games', 'tabletop games', 'tech networking', 'Utah', 'Salt Lake County', 'professional networking'],
  icons: {
    icon: '/assets/images/logos/TNGheadIcon_whiteonblue.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Tech Networking and Games',
    images: [{ url: '/assets/images/hero/gameroom-bg.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@technetgames',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const activeLeagues = getActiveLeagues();

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tech Networking and Games',
    url: 'https://www.technetworkingandgames.com',
    logo: 'https://www.technetworkingandgames.com/assets/images/logos/TNGlogowhite_xp.svg',
    description: 'A community of tech professionals networking through Magic: The Gathering, Dungeons & Dragons, and board games in Utah and Salt Lake County.',
    areaServed: {
      '@type': 'Place',
      name: 'Utah and Salt Lake County, Utah',
    },
    sameAs: [
      'https://www.instagram.com/technetworkingandgames/',
      'https://twitter.com/technetgames',
      'https://www.linkedin.com/company/tech-networking-and-games/',
      'https://www.facebook.com/technetworkingandgames',
    ],
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KQ4HKJ8JFT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KQ4HKJ8JFT');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <Header activeLeagues={activeLeagues} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
