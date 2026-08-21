import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Message Sent',
  description: 'Thank you for reaching out to Tech Networking and Games.',
};

export default function ThanksPage() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>Message Sent!</h1>
        <p style={{ fontSize: '1.1rem', margin: '1.5rem 0' }}>
          Thanks for reaching out. We'll get back to you soon.
        </p>
        <p style={{ margin: '1rem 0 2rem' }}>
          If you included your Discord handle, expect an invite within a day or two.
        </p>
        <Link href="/" className="btn">Back to Home</Link>
      </div>
    </section>
  );
}
