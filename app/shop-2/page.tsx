import type { Metadata } from "next";
import { categories, getProductsByCategory } from "@/data/products";
import MenuBrowser from "@/components/MenuBrowser";

// URL preserved exactly as the original site's shop page: /shop-2/
export const metadata: Metadata = {
  title: "Shop – Pizza Olive",
};

export default function ShopPage() {
  const productsByCategory = Object.fromEntries(
    categories.map((c) => [c.slug, getProductsByCategory(c.slug)])
  );

  return (
    <>
      <h1 className="page-title">Products List</h1>
      <MenuBrowser categories={categories} productsByCategory={productsByCategory} />
    </>
  );
}
