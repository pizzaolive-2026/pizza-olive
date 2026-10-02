import type { Metadata } from "next";
import { getAllProductsGrouped } from "@/lib/sanity-queries";
import MenuBrowser from "@/components/MenuBrowser";

// URL preserved exactly as the original site's shop page: /shop-2/
export const revalidate = 0; // always fetch fresh from Sanity

export const metadata: Metadata = {
  title: "Shop – Pizza Olive",
};

export default async function ShopPage() {
  const { categories, productsByCategory } = await getAllProductsGrouped();

  return (
    <>
      <h1 className="page-title">Products List</h1>
      <MenuBrowser categories={categories} productsByCategory={productsByCategory} />
    </>
  );
}
