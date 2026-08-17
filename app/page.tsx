import Link from 'next/link';
import Card from '@/components/Card';
import CardGrid from '@/components/CardGrid';
import { getActiveLeagues, getBlogPosts } from '@/lib/data';

export default async function HomePage() {
  const activeLeagues = getActiveLeagues();
  const blogPosts = await getBlogPosts();
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <>
      <section className="hero" style={{ backgroundImage: "url('/assets/images/hero/gameroom-bg.jpg')" }}>
        <div className="hero-overlay">
          <h1>Tech Networking and Games</h1>
          <p className="hero-tagline">Casual Networking across Utah and Salt Lake counties.</p>
        </div>
      </section>

      <section className="section featured-leagues">
        <div className="container">
          <h2>Current Leagues</h2>
          <CardGrid>
            {activeLeagues.slice(0, 6).map(league => (
              <Card
                key={league.slug}
                href={`/leagues/${league.slug}/`}
                image={`/assets/images/leagues/${league.image}`}
                alt={league.name}
                title={league.name}
              />
            ))}
          </CardGrid>
          <div className="section-cta">
            <Link href="/mtg-corporate-league/" className="btn">View All Leagues</Link>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <h2>Sign Up and Stay Updated!</h2>
          <p>Join our community of tech professionals who love games.</p>
          <a href="mailto:technetworkingandgames@gmail.com" className="btn">Get In Touch</a>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="section">
          <div className="container">
            <h2>Latest from the Blog</h2>
            <div className="blog-grid">
              {recentPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}/`} className="blog-card">
                  {post.image && (
                    <img src={`/assets/images/blog/${post.image}`} alt={post.title} loading="lazy" />
                  )}
                  <div className="blog-card-content">
                    <h3>{post.title}</h3>
                    {post.date && <time>{post.date}</time>}
                    {post.summary && <p>{post.summary.slice(0, 120)}...</p>}
                  </div>
                </Link>
              ))}
            </div>
            <div className="section-cta">
              <Link href="/blog/" className="btn">View All Posts</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
