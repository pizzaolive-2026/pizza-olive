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
      <div className="site-footer__inner">
        <div className="site-footer__contact">
          <p>
            275 Dundas St W
            <br />
            Toronto, Canada M5T 3K1
          </p>
          <p>(647) 221-1145</p>
          <p>info@pizzaolive.ca</p>
        </div>

        <div className="site-footer__hours">
          <h3>Hours :</h3>
          <ul>
            {HOURS.map(([day, time]) => (
              <li key={day}>
                <strong>{day}</strong> {time}
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop-2">Shop</Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="site-footer__copyright">All rights Reserved by Pizza Olive</p>
    </footer>
  );
}
