import Link from "next/link";

const HOURS = [
  ["Monday", "10:30 AM – 8:00 PM"],
  ["Tuesday", "10:30 AM – 8:00 PM"],
  ["Wednesday", "10:30 AM – 8:00 PM"],
  ["Thursday", "10:30 AM – 8:00 PM"],
  ["Friday", "10:30 AM – 8:00 PM"],
  ["Saturday", "11:30 AM – 7:00 PM"],
  ["Sunday", "Closed"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bg" />

      <div className="site-footer__contact-bar">
        <div className="site-footer__contact-item">
          <div className="site-footer__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <p>275 Dundas St W<br />Toronto, Canada M5T 3K1</p>
        </div>
        <div className="site-footer__contact-item">
          <div className="site-footer__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <p><a href="tel:+16472211145">(647) 221-1145</a></p>
        </div>
        <div className="site-footer__contact-item">
          <div className="site-footer__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <p><a href="mailto:info@pizzaolive.ca">info@pizzaolive.ca</a></p>
        </div>
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__hours">
          <h3>Hours :</h3>
          <ul>
            {HOURS.map(([day, time]) => (
              <li key={day}>
                <strong>{day}</strong> <span>{time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop-2">Shop</Link></li>
            <li><Link href="/contact-us">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__payments">
        <span className="site-footer__pay-badge">VISA</span>
        <span className="site-footer__pay-badge">MasterCard</span>
        <span className="site-footer__pay-badge">AMEX</span>
        <span className="site-footer__pay-badge">Discover</span>
      </div>

      <p className="site-footer__copyright">All rights Reserved by Pizza Olive</p>
    </footer>
  );
}
