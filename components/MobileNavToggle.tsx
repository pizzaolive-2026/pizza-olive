"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop-2", label: "Menu" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function MobileNavToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="mobile-nav-overlay" role="dialog" aria-modal="true">
          <button
            type="button"
            className="mobile-nav-overlay__close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
          <nav aria-label="Mobile primary">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
