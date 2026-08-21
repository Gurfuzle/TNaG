import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPosts } from '@/lib/data';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug);
  return {
    title: post?.title || 'Post',
    description: post?.summary || `Read ${post?.title || 'this article'} on Tech Networking and Games.`,
    openGraph: {
      type: 'article',
      title: post?.title,
      description: post?.summary || undefined,
      images: post?.image ? [{ url: `/assets/images/blog/${post.image}`, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    datePublished: post.date,
    image: post.image ? `https://www.technetworkingandgames.com/assets/images/blog/${post.image}` : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Tech Networking and Games',
      logo: { '@type': 'ImageObject', url: 'https://www.technetworkingandgames.com/assets/images/logos/TNGlogowhite_xp.svg' },
    },
  };

  return (
    <section className="section">
      <div className="container page-bg-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <article className="blog-post">
          <header className="blog-post-header">
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              {post.author && <span className="author">{post.author}</span>}
              {post.date && <time dateTime={new Date(post.date).toISOString().split('T')[0]}>{post.date}</time>}
            </div>
          </header>
          <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          <footer className="blog-post-footer">
            <Link href="/blog/" className="btn btn-secondary">&larr; Back to Blog</Link>
          </footer>
        </article>
      </div>
    </section>
  );
}
