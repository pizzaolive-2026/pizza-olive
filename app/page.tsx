import Link from "next/link";
import type { Metadata } from "next";
import { categories, getProductsByCategory } from "@/data/products";
import MenuBrowser from "@/components/MenuBrowser";

export const metadata: Metadata = {
  title: "Pizza Olive – Authentic Italian Pizza & Pasta",
  description:
    "Order authentic Italian pizza, pasta and more from Pizza Olive, 275 Dundas St W, Toronto. (647) 221-1145.",
};

// Home page preserves the original's structure: hero with phone number and
// CTA buttons, tappable category shortcuts, then the product listing itself
// (which doubles as the mobile-optimized browsing experience described in
// the brief — customers land straight in a scrollable, categorized menu).
export default function HomePage() {
  const productsByCategory = Object.fromEntries(
    categories.map((c) => [c.slug, getProductsByCategory(c.slug)])
  );

  return (
    <>
      <section className="hero">
        <h1>Authentic Italian Pizza &amp; Pasta</h1>
        <h2>(647) 221-1145</h2>
        <div className="hero__actions">
          <Link href="/shop-2" className="hero__cta">
            Order Now
          </Link>
          <Link href="/shop-2" className="hero__cta hero__cta--secondary">
            Gift Cards
          </Link>
        </div>
      </section>

      <nav className="category-shortcuts" aria-label="Shop by category">
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/product-category/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <MenuBrowser categories={categories} productsByCategory={productsByCategory} />
    </>
  );
}
