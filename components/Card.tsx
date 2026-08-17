import Link from 'next/link';

interface CardProps {
  href: string;
  image?: string;
  alt: string;
  title: string;
  featured?: boolean;
}

export default function Card({ href, image, alt, title, featured }: CardProps) {
  return (
    <Link href={href} className={`card${featured ? ' card-featured' : ''}`}>
      {image && <img src={image} alt={alt} loading="lazy" />}
      <span className="card-title">{title}</span>
    </Link>
  );
}
