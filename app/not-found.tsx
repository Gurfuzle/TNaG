import Link from 'next/link';
import dynamic from 'next/dynamic';

const Tetris = dynamic(() => import('@/components/Tetris'), { ssr: false });

export default function NotFound() {
  return (
    <section className="section">
      <div className="container page-bg-content" style={{ textAlign: 'center' }}>
        <h1>Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist. Play some Tetris while you figure out where to go!</p>
        <div style={{ marginTop: '1.5rem' }}>
          <Tetris />
        </div>
        <div className="section-cta" style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn">Back to Home</Link>
          <Link href="/blog/" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>Browse the Blog</Link>
        </div>
      </div>
    </section>
  );
}
