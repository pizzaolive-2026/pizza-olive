import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoriesFromSanity, getProductsByCategoryFromSanity } from "@/lib/sanity-queries";
import ProductCard from "@/components/ProductCard";

// URL pattern preserved exactly: /product-category/{slug}/
export async function generateStaticParams() {
  const categories = await getCategoriesFromSanity();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const categories = await getCategoriesFromSanity();
  const category = categories.find((c) => c.slug === params.category);
  return { title: category ? `${category.name} – Pizza Olive` : "Pizza Olive" };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categories = await getCategoriesFromSanity();
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const products = await getProductsByCategoryFromSanity(category.slug);

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
