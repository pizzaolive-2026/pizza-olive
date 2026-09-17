import type { Product } from "@/types/product";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import DesktopTabs from "@/components/DesktopTabs";

interface Category {
  slug: string;
  name: string;
}

export default function MenuBrowser({
  categories,
  productsByCategory,
}: {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
}) {
  return (
    <div className="menu-browser">
      <div className="menu-header">
        <p className="menu-header__eyebrow">Our Menu</p>
        <h2 className="menu-header__title">PIZZA OLIVE</h2>
        <div className="menu-header__wave" aria-hidden="true">〰</div>
      </div>

      {/* Desktop: tab-based view (hidden on mobile) */}
      <div className="menu-desktop-only">
        <DesktopTabs categories={categories} productsByCategory={productsByCategory} />
      </div>

      {/* Mobile: sticky nav + full scroll (hidden on desktop) */}
      <div className="menu-mobile-only">
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
    </div>
  );
}
