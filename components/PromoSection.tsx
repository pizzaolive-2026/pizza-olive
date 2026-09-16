import Link from "next/link";
import Image from "next/image";

export default function PromoSection() {
  return (
    <>
      {/* World Cup Special Banner */}
      <section className="promo-banner">
        <div className="promo-banner__inner">
          <div className="promo-banner__image">
            <Image
              src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/9c1fc231-50a0-48ef-a147-e719dad7790a.png"
              alt="World Cup Special — Pizza Olive promotion"
              width={600}
              height={500}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>
          <div className="promo-banner__content">
            <p className="promo-banner__eyebrow">World Cup Special</p>
            <h2 className="promo-banner__price">Only $29.99</h2>
            <p className="promo-banner__desc">
              Buy Any 2 Medium-Sized pizzas + 2 Garlic Deeps + 2 Pops + 1 Fries
            </p>
            <Link href="/product/summer-feature-combo" className="promo-banner__cta">
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      {/* Food Showcase Grid */}
      <section className="food-showcase">
        <Link href="/product-category/pasta" className="food-showcase__item food-showcase__item--large">
          <Image
            src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/Gemini_Generated_Image_ocgt5pocgt5pocgt-1-1-1.png"
            alt="Pasta — Shop Now"
            fill
            style={{ objectFit: "cover" }}
          />
          <span className="food-showcase__btn">shop now</span>
        </Link>
        <Link href="/product-category/pizza" className="food-showcase__item">
          <Image
            src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/7F5A7583-Recovered-1-1.jpg"
            alt="Pizza — Shop Now"
            fill
            style={{ objectFit: "cover" }}
          />
          <span className="food-showcase__btn">shop now</span>
        </Link>
        <Link href="/product-category/pizza" className="food-showcase__item">
          <Image
            src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/7F5A7608-1-1.jpg"
            alt="Pizza — Shop Now"
            fill
            style={{ objectFit: "cover" }}
          />
          <span className="food-showcase__btn">shop now</span>
        </Link>
        <Link href="/product-category/arancini" className="food-showcase__item">
          <Image
            src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/577cb870-1619-4dfd-8e58-5b7de292e2b5-1-1-1-1.jpg"
            alt="Arancini — Shop Now"
            fill
            style={{ objectFit: "cover" }}
          />
          <span className="food-showcase__btn">shop now</span>
        </Link>
      </section>
    </>
  );
}
