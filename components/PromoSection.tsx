import Link from "next/link";
import Image from "next/image";

export default function PromoSection() {
  return (
    <section className="food-showcase">
      {/* 1: pasta (top-left, wide) */}
      <Link href="/product-category/pasta" className="food-showcase__item">
        <Image
          src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/Gemini_Generated_Image_ocgt5pocgt5pocgt-1-1-1.png"
          alt="Pasta — Shop Now"
          fill
          sizes="(max-width: 640px) 50vw, 55vw"
          style={{ objectFit: "cover" }}
        />
        <span className="food-showcase__btn">SHOP NOW</span>
      </Link>
      {/* 2: arancini (right, tall, spans 2 rows) */}
      <Link href="/product-category/arancini" className="food-showcase__item">
        <Image
          src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/577cb870-1619-4dfd-8e58-5b7de292e2b5-1-1-1-1.jpg"
          alt="Arancini — Shop Now"
          fill
          sizes="(max-width: 640px) 50vw, 35vw"
          style={{ objectFit: "cover" }}
        />
        <span className="food-showcase__btn">SHOP NOW</span>
      </Link>
      {/* 3: pizza bottom-left */}
      <Link href="/product-category/pizza" className="food-showcase__item">
        <Image
          src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/7F5A7583-Recovered-1-1.jpg"
          alt="Pizza — Shop Now"
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        <span className="food-showcase__btn">SHOP NOW</span>
      </Link>
      {/* 4: pizza bottom-center */}
      <Link href="/product-category/pizza" className="food-showcase__item">
        <Image
          src="https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/7F5A7608-1-1.jpg"
          alt="Pizza — Shop Now"
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        <span className="food-showcase__btn">SHOP NOW</span>
      </Link>
    </section>
  );
}
