import { sanityClient } from "./sanity";
import type { Product, AddonGroup } from "@/types/product";

// ─── Sanity document shapes ───────────────────────────────────────────────────

interface SanityAddonOption {
  _key: string;
  name: string;
  priceDeltaCents: number;
}

interface SanityAddonGroup {
  _key: string;
  name: string;
  type: "radio" | "checkbox" | "select";
  selectExactly?: number;
  options: SanityAddonOption[];
}

interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription?: string;
  description?: string;
  includedAddons?: string[];
  priceCents: number;
  salePriceCents?: number;
  imageUrl?: string;
  imageFromAsset?: string;
  featured: boolean;
  addonGroups?: SanityAddonGroup[];
  category: {
    _id: string;
    name: string;
    slug: { current: string };
  };
}

interface SanityCategory {
  _id: string;
  name: string;
  slug: { current: string };
  order: number;
}

// ─── GROQ queries ─────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  _id,
  name,
  slug,
  shortDescription,
  description,
  includedAddons,
  priceCents,
  salePriceCents,
  imageUrl,
  "imageFromAsset": image.asset->url,
  featured,
  addonGroups[] {
    _key,
    name,
    type,
    selectExactly,
    options[] { _key, name, priceDeltaCents }
  },
  category-> { _id, name, slug }
`;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapProduct(p: SanityProduct): Product {
  return {
    id: p._id.replace("product-", ""),
    slug: p.slug.current,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    includedAddons: p.includedAddons ?? [],
    priceCents: p.priceCents,
    salePriceCents: p.salePriceCents ?? null,
    category: p.category?.name ?? "",
    categorySlug: p.category?.slug?.current ?? "",
    image: p.imageFromAsset ?? p.imageUrl ?? null,
    featured: p.featured ?? false,
    addonGroups: (p.addonGroups ?? []).map(
      (g): AddonGroup => ({
        name: g.name,
        type: g.type,
        selectExactly: g.selectExactly,
        options: (g.options ?? []).map((o) => ({
          name: o.name,
          priceDeltaCents: o.priceDeltaCents ?? 0,
        })),
      })
    ),
  };
}

// ─── Public API (mirrors data/products.ts exports) ───────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const docs: SanityProduct[] = await sanityClient.fetch(
    `*[_type == "product"] | order(category->order asc, name asc) { ${PRODUCT_FIELDS} }`
  );
  // Deduplicate by slug — keep the one with an image if there are two
  const seen = new Map<string, SanityProduct>();
  for (const doc of docs) {
    const slug = doc.slug.current;
    const existing = seen.get(slug);
    if (!existing || (!existing.imageFromAsset && doc.imageFromAsset)) {
      seen.set(slug, doc);
    }
  }
  return Array.from(seen.values()).map(mapProduct);
}

export async function getProductBySlugFromSanity(slug: string): Promise<Product | undefined> {
  const doc: SanityProduct | null = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`,
    { slug }
  );
  return doc ? mapProduct(doc) : undefined;
}

export async function getProductsByCategoryFromSanity(categorySlug: string): Promise<Product[]> {
  const docs: SanityProduct[] = await sanityClient.fetch(
    `*[_type == "product" && category->slug.current == $categorySlug] | order(name asc) { ${PRODUCT_FIELDS} }`,
    { categorySlug }
  );
  const seen = new Map<string, SanityProduct>();
  for (const doc of docs) {
    const slug = doc.slug.current;
    const existing = seen.get(slug);
    if (!existing || (!existing.imageFromAsset && doc.imageFromAsset)) {
      seen.set(slug, doc);
    }
  }
  return Array.from(seen.values()).map(mapProduct);
}

export async function getCategoriesFromSanity(): Promise<{ name: string; slug: string }[]> {
  const docs: SanityCategory[] = await sanityClient.fetch(
    `*[_type == "category"] | order(order asc) { _id, name, slug, order }`
  );
  return docs.map((c) => ({ name: c.name, slug: c.slug.current }));
}

export async function getAllProductsGrouped(): Promise<{
  categories: { name: string; slug: string }[];
  productsByCategory: Record<string, Product[]>;
}> {
  const [cats, prods] = await Promise.all([getCategoriesFromSanity(), getAllProducts()]);
  const productsByCategory: Record<string, Product[]> = {};
  for (const cat of cats) {
    productsByCategory[cat.slug] = prods.filter((p) => p.categorySlug === cat.slug);
  }
  return { categories: cats, productsByCategory };
}
