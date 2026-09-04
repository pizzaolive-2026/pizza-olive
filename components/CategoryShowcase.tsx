import Link from "next/link";
import Image from "next/image";

const CATEGORY_IMAGES = [
  {
    label: "Pasta",
    href: "/product-category/pasta",
    image: "https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/Spaghetti-Bolognese-1-1.jpg",
    alt: "Spaghetti Bolognese",
    gridArea: "pasta",
  },
  {
    label: "Arancini",
    href: "/product-category/arancini",
    image: "https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/Arancini-al-Ragu.jpg",
    alt: "Arancini al Ragu",
    gridArea: "arancini",
  },
  {
    label: "Pizza",
    href: "/product-category/pizza",
    image: "https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/Pepperoni-Pizza.jpg",
    alt: "Pepperoni Pizza",
    gridArea: "pizza1",
  },
  {
    label: "Panuozzo",
    href: "/product-category/panuozzo",
    image: "https://aqua-seal-233446.hostingersite.com/wp-content/uploads/2026/07/Chicken-Caesar.jpg",
    alt: "Chicken Caesar Panuozzo",
    gridArea: "pizza2",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="category-showcase">
      <div className="category-showcase__grid">
        {CATEGORY_IMAGES.map((cat) => (
          <Link
            key={cat.gridArea}
            href={cat.href}
            className={`category-showcase__item category-showcase__item--${cat.gridArea}`}
          >
            <Image
              src={cat.image}
              alt={cat.alt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            <span className="category-showcase__btn">SHOP NOW</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
