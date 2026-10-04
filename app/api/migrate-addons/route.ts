/**
 * ONE-TIME migration route: populates addonGroups on all Sanity product docs.
 * Visit /api/migrate-addons once, then delete this file.
 * Protected by a secret query param: ?secret=migrate2024
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const SECRET = "migrate2024";

const client = createClient({
  projectId: "p1weztyq",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// ── Addon group definitions ───────────────────────────────────────────────────

const SIZE = {
  _key: "size", name: "Size", type: "radio",
  options: [
    { _key: "small8", name: 'Small 8"', priceDeltaCents: 0 },
    { _key: "medium12", name: 'Medium 12"', priceDeltaCents: 500 },
  ],
};

const CHEESE = {
  _key: "cheese", name: "Add Cheese Toppings", type: "checkbox",
  options: [
    { _key: "mozz300", name: "Mozzarella Cheese", priceDeltaCents: 300 },
    { _key: "mozz250", name: "Mozzarella Cheese (+$2.50)", priceDeltaCents: 250 },
  ],
};

const MEAT = {
  _key: "meat", name: "Add Meat Toppings", type: "checkbox",
  options: [
    { _key: "bacon", name: "Bacon", priceDeltaCents: 350 },
    { _key: "sausage", name: "Italian Sausage", priceDeltaCents: 250 },
    { _key: "meatballs", name: "Italian Style Meatballs", priceDeltaCents: 350 },
    { _key: "chicken", name: "Over Roasted Chicken", priceDeltaCents: 350 },
    { _key: "pepperoni", name: "Pepperoni", priceDeltaCents: 250 },
    { _key: "ham", name: "Smoked Ham", priceDeltaCents: 250 },
  ],
};

const VEG = {
  _key: "veggie", name: "Add Vegetable Toppings", type: "checkbox",
  options: [
    { _key: "olives", name: "Black Olives", priceDeltaCents: 200 },
    { _key: "corn", name: "Corn", priceDeltaCents: 200 },
    { _key: "mushrooms", name: "Fresh Sliced Mushrooms", priceDeltaCents: 200 },
    { _key: "greenpep", name: "Green Pepper", priceDeltaCents: 200 },
    { _key: "jalapeno", name: "Jalapeño Pepper", priceDeltaCents: 200 },
    { _key: "pineapple", name: "Pineapple", priceDeltaCents: 200 },
    { _key: "redonion", name: "Red Onion", priceDeltaCents: 200 },
    { _key: "garlic", name: "Roasted Minced Garlic", priceDeltaCents: 200 },
  ],
};

const SIDESCHEESE = {
  _key: "sidescheese", name: "Add Cheese Toppings", type: "checkbox",
  options: [
    { _key: "mozz", name: "Mozzarella Cheese", priceDeltaCents: 300 },
    { _key: "parm", name: "Parmigiana Cheese", priceDeltaCents: 250 },
  ],
};

const DIP = {
  _key: "dip", name: "Choose Dip", type: "radio",
  options: [
    { _key: "bbq", name: "BBQ Dip", priceDeltaCents: 0 },
    { _key: "bangbang", name: "Bang Bang Dip", priceDeltaCents: 0 },
    { _key: "garlic", name: "Garlic Aioli Dip", priceDeltaCents: 0 },
    { _key: "mayo", name: "Mayo Dip", priceDeltaCents: 0 },
    { _key: "spicymayo", name: "Spicy Mayo Dip", priceDeltaCents: 0 },
  ],
};

const DRINKS = {
  _key: "drinks", name: "Choose Drinks", type: "checkbox", selectExactly: 2,
  options: [
    { _key: "cola", name: "Coca Cola", priceDeltaCents: 0 },
    { _key: "cokezero", name: "Coke Zero", priceDeltaCents: 0 },
    { _key: "fuzztea", name: "Fuze Iced Tea", priceDeltaCents: 0 },
    { _key: "sprite", name: "Sprite", priceDeltaCents: 0 },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupsFor(categorySlug: string, slug: string): any[] {
  if (categorySlug === "pizza") return [SIZE, CHEESE, MEAT];
  if (categorySlug === "pasta") return [CHEESE, MEAT, VEG];
  if (categorySlug === "sides" && (slug === "fries-belgium-style" || slug === "onion-rings")) {
    return [SIDESCHEESE, DIP];
  }
  if (["summer-feature-combo", "olive-duo-combo", "olive-family-feast-combo"].includes(slug)) {
    return [DRINKS];
  }
  return [];
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docs = await client.fetch(
    `*[_type == "product"] { _id, "slug": slug.current, "cat": category->slug.current }`
  );

  const results: { slug: string; status: string; groups?: number }[] = [];

  for (const doc of docs) {
    const groups = groupsFor(doc.cat, doc.slug);
    if (groups.length === 0) {
      results.push({ slug: doc.slug, status: "skipped" });
      continue;
    }
    try {
      await client.patch(doc._id).set({ addonGroups: groups }).commit();
      results.push({ slug: doc.slug, status: "updated", groups: groups.length });
    } catch (err) {
      results.push({ slug: doc.slug, status: `error: ${err instanceof Error ? err.message : err}` });
    }
  }

  const updated = results.filter(r => r.status === "updated").length;
  const skipped = results.filter(r => r.status === "skipped").length;
  const errors  = results.filter(r => r.status.startsWith("error")).length;

  return NextResponse.json({ done: true, updated, skipped, errors, results });
}
