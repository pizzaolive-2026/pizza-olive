import Link from "next/link";
import Image from "next/image";
import CartButton from "@/components/CartButton";
import MobileNavToggle from "@/components/MobileNavToggle";

// Matches original header structure: logo left, primary nav center, cart right.
// Nav labels/links preserved exactly from the original site (Home / Menu / Contact Us).
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop-2", label: "Menu" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="Pizza Olive home">
          <Image
            src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/36fdce25-f849-4f1c-9661-26c125e8f9a4-removebg-preview-1-1.png"
            alt="Pizza Olive"
            width={160}
            height={70}
            priority
          />
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <CartButton />
          <MobileNavToggle />
        </div>
      </div>
    </header>
  );
}
