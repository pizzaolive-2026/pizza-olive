"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

interface Category {
  slug: string;
  name: string;
}

export default function DesktopTabs({
  categories,
  productsByCategory,
}: {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
}) {
  const [activeTab, setActiveTab] = useState(categories[0]?.slug);
  const activeProducts = productsByCategory[activeTab] ?? [];

  return (
    <div className="desktop-tabs">
      <nav className="desktop-tabs__nav" aria-label="Menu categories">
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                className={activeTab === c.slug ? "is-active" : undefined}
                onClick={() => setActiveTab(c.slug)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="desktop-tabs__content">
        <div className="product-grid product-grid--desktop">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
