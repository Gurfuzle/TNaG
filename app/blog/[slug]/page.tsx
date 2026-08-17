import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { Metadata } from 'next';

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
  return { title: `${post?.title || 'Post'} - Tech Networking and Games` };
}

export default async function BlogPostPage({ params }: Props) {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug);
  if (!post) return null;

  return (
    <section className="section">
      <div className="container page-bg-content">
        <article className="blog-post">
          <header className="blog-post-header">
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              {post.author && <span className="author">{post.author}</span>}
              {post.date && <time>{post.date}</time>}
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
