export const metadata = { title: 'About - Tech Networking and Games' };

export default function AboutPage() {
  return (
    <section className="section about-section">
      <div className="container about-page page-bg-content">
        <div className="about-content">
          <h1>About Tech Networking and Games</h1>
          <p className="about-lead">
            Tech Networking and Games is a group of technical professionals who saw an opportunity
            to help people build their professional networks using Magic the Gathering, Dungeons
            &amp; Dragons, and other tabletop games.
          </p>
          <p>
            Members volunteer through their various employers and partner with local game stores
            to schedule events. The goal is helping participants build relationships and grow their
            professional network.
          </p>
          <blockquote>
            &ldquo;We love games and we love tech and we want to see our community grow through both.&rdquo;
          </blockquote>
          <p>Based in Utah, serving the Utah and Salt Lake county areas.</p>
          <h2>Contact</h2>
          <p><a href="mailto:technetworkingandgames@gmail.com">technetworkingandgames@gmail.com</a></p>
        </div>
        <div className="about-photo">
          <img src="/assets/images/michael-headshot.png" alt="Michael Swensen" />
          <p className="about-name">Michael Swensen</p>
        </div>
      </div>
    </section>
  );
}
