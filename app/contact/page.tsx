import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Tech Networking and Games. Join our Discord community or send us a message.',
  openGraph: {
    title: 'Contact Us | Tech Networking and Games',
    description: 'Get in touch with Tech Networking and Games. Join our Discord community or send us a message.',
  },
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Get In Touch</h1>
        <p className="contact-intro">
          Want to join our community, ask a question, or just say hello? Fill out the form below and
          we'll get back to you. Include your Discord handle if you'd like an invite to our server!
        </p>

        <form
          className="contact-form"
          action="https://formsubmit.co/technetworkingandgames@gmail.com"
          method="POST"
        >
          <input type="hidden" name="_subject" value="New Contact from TNaG Website" />
          <input type="hidden" name="_captcha" value="true" />
          <input type="hidden" name="_next" value="https://www.technetworkingandgames.com/contact/thanks" />
          <input type="text" name="_honey" style={{ display: 'none' }} />

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input type="text" id="name" name="name" required placeholder="Your name" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required placeholder="your@email.com" />
          </div>

          <div className="form-group">
            <label htmlFor="discord">Discord Handle <span className="optional">(optional)</span></label>
            <input type="text" id="discord" name="discord" placeholder="username#1234 or just username" />
            <span className="form-hint">Include this if you'd like an invite to our Discord server</span>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea id="message" name="message" required rows={5} placeholder="What's on your mind?" />
          </div>

          <button type="submit" className="btn">Send Message</button>
        </form>
      </div>
    </section>
  );
}
