import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { categories, getProductsByCategory } from "@/data/products";
import MenuBrowser from "@/components/MenuBrowser";

export const metadata: Metadata = {
  title: "Pizza Olive – Authentic Italian Pizza & Pasta",
  description:
    "Order authentic Italian pizza, pasta and more from Pizza Olive, 275 Dundas St W, Toronto. (647) 221-1145.",
};

export default function HomePage() {
  const productsByCategory = Object.fromEntries(
    categories.map((c) => [c.slug, getProductsByCategory(c.slug)])
  );

  return (
    <>
      <section className="hero">
        <div className="hero__bg">
          <Image
            src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/b2b48ee7-bf14-4230-8137-04d98a2d70dd.jpg"
            alt="Pizza Olive — Authentic Italian Pizza"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Authentic Italian Pizza &amp; Pasta</h1>
          <h2>(647) 221-1145</h2>
          <p className="hero__subtitle">
            275 Dundas St W, Toronto &mdash; Handcrafted with love, delivered to your&nbsp;door.
          </p>
          <div className="hero__actions">
            <Link href="/shop-2" className="hero__cta">
              Order Now
            </Link>
            <Link href="/shop-2" className="hero__cta hero__cta--secondary">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      <MenuBrowser categories={categories} productsByCategory={productsByCategory} />
    </>
  );
}
