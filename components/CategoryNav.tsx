"use client";

import { useEffect, useState } from "react";

interface Category {
  slug: string;
  name: string;
}

// Sticky, horizontally-scrollable category pills. This is the primary fix for
// the original site's mobile browsing problem: categories stay visible and
// tappable while the customer scrolls through the full product list below,
// instead of relying on desktop-only dropdown filters.
export default function CategoryNav({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.slug);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`category-${c.slug}`))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id.replace("category-", ""));
      },
      { rootMargin: "-120px 0px -70% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  function scrollTo(slug: string) {
    document
      .getElementById(`category-${slug}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="category-nav" aria-label="Menu categories">
      <ul>
        {categories.map((c) => (
          <li key={c.slug}>
            <button
              type="button"
              className={active === c.slug ? "is-active" : undefined}
              onClick={() => scrollTo(c.slug)}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
