import Card from '@/components/Card';
import CardGrid from '@/components/CardGrid';
import { getBlogPosts } from '@/lib/data';

export const metadata = { title: 'Blog - Tech Networking and Games' };

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <section className="section">
      <div className="container page-bg-content">
        <h1>Blog</h1>
        {featured && (
          <div className="featured-card-wrapper">
            <Card
              href={`/blog/${featured.slug}/`}
              image={featured.image ? `/assets/images/blog/${featured.image}` : undefined}
              alt={featured.title}
              title={featured.title}
              featured
            />
          </div>
        )}
        <CardGrid>
          {rest.map(post => (
            <Card
              key={post.slug}
              href={`/blog/${post.slug}/`}
              image={post.image ? `/assets/images/blog/${post.image}` : undefined}
              alt={post.title}
              title={post.title}
            />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}
