import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { categories, getProductsByCategory } from "@/data/products";
import MenuBrowser from "@/components/MenuBrowser";
import GoogleReviews from "@/components/GoogleReviews";
import PromoSection from "@/components/PromoSection";

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
            src="/images/hero-pizza-pasta.png"
            alt="Pizza Olive — Authentic Italian Pizza & Pasta"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Authentic Italian<br />Pizza &amp; Pasta</h1>
          <p className="hero__subtitle">
            Pizza Olive is Toronto&rsquo;s destination for handcrafted pizza, fresh pasta and Italian favourites &mdash; made with passion, delivered to your&nbsp;door.
          </p>
          <div className="hero__actions">
            <Link href="/shop-2" className="hero__cta">
              Order Now
            </Link>
            <Link href="tel:+16472211145" className="hero__cta hero__cta--secondary">
              Call Now
            </Link>
          </div>
        </div>
      </section>

      <MenuBrowser categories={categories} productsByCategory={productsByCategory} />

      <PromoSection />

      <GoogleReviews />
    </>
  );
}
