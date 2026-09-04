import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

// URL pattern preserved exactly: /product-category/{slug}/
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const category = categories.find((c) => c.slug === params.category);
  return { title: category ? `${category.name} – Pizza Olive` : "Pizza Olive" };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <section className="menu-section">
      <h1 className="menu-section__title">{category.name}</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
