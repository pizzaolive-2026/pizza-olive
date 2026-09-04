import type { Product } from "@/types/product";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";

interface Category {
  slug: string;
  name: string;
}

// Renders ALL products, grouped by category, in one continuously-scrollable
// page. On desktop this lays out as the original's multi-column grid; on
// mobile the same markup collapses to a single full-width column so nothing
// is cropped, hidden behind a slider, or reachable only via hover.
export default function MenuBrowser({
  categories,
  productsByCategory,
}: {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
}) {
  return (
    <div className="menu-browser">
      <CategoryNav categories={categories} />

      {categories.map((category) => {
        const items = productsByCategory[category.slug] ?? [];
        if (items.length === 0) return null;

        return (
          <section
            key={category.slug}
            id={`category-${category.slug}`}
            className="menu-section"
            aria-labelledby={`category-${category.slug}-heading`}
          >
            <h2 id={`category-${category.slug}-heading`} className="menu-section__title">
              {category.name}
            </h2>
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
