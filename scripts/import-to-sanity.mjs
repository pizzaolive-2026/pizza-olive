/**
 * Import script: loads all Pizza Olive products + categories into Sanity.
 *
 * Run once:
 *   SANITY_TOKEN=skbW8i... node scripts/import-to-sanity.mjs
 *
 * Requires: @sanity/client (already installed)
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p1weztyq",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const CATEGORIES = [
  { _id: "cat-pizza", name: "Pizza", slug: "pizza", order: 1 },
  { _id: "cat-pasta", name: "Pasta", slug: "pasta", order: 2 },
  { _id: "cat-panuozzo", name: "Panuozzo", slug: "panuozzo", order: 3 },
  { _id: "cat-sides", name: "Sides", slug: "sides", order: 4 },
  { _id: "cat-arancini", name: "Arancini", slug: "arancini", order: 5 },
  { _id: "cat-beverages", name: "Beverages", slug: "beverages", order: 6 },
  { _id: "cat-features", name: "Features", slug: "features", order: 7 },
];

// Addon group templates
const PIZZA_ADDONS = [
  { _key: "size", name: "Size", type: "radio", options: [{ _key: "s8", name: 'Small 8"', priceDeltaCents: 0 }, { _key: "m12", name: 'Medium 12"', priceDeltaCents: 500 }] },
  { _key: "cheese", name: "Add Cheese Toppings", type: "checkbox", options: [{ _key: "moz3", name: "Mozzarella Cheese", priceDeltaCents: 300 }, { _key: "moz25", name: "Mozzarella Cheese", priceDeltaCents: 250 }] },
  { _key: "meat", name: "Add Meat Toppings", type: "checkbox", options: [{ _key: "bac", name: "Bacon", priceDeltaCents: 350 }, { _key: "its", name: "Italian Sausage", priceDeltaCents: 250 }, { _key: "ism", name: "Italian Style Meatballs", priceDeltaCents: 350 }, { _key: "orc", name: "Over Roasted Chicken", priceDeltaCents: 350 }, { _key: "pep", name: "Pepperoni", priceDeltaCents: 250 }, { _key: "shm", name: "Smoked Ham", priceDeltaCents: 250 }] },
];

const PASTA_ADDONS = [
  ...PIZZA_ADDONS.filter(g => g._key !== "size"),
  { _key: "veg", name: "Add Vegetable Toppings", type: "checkbox", options: [{ _key: "bo", name: "Black Olives", priceDeltaCents: 200 }, { _key: "co", name: "Corn", priceDeltaCents: 200 }, { _key: "fm", name: "Fresh Sliced Mushrooms", priceDeltaCents: 200 }, { _key: "gp", name: "Green Pepper", priceDeltaCents: 200 }, { _key: "jp", name: "Jalapeño Pepper", priceDeltaCents: 200 }, { _key: "pi", name: "Pineapple", priceDeltaCents: 200 }, { _key: "ro", name: "Red Onion", priceDeltaCents: 200 }, { _key: "rmg", name: "Roasted Minced Garlic", priceDeltaCents: 200 }] },
  { _key: "sauce", name: "Add Extra Sauce", type: "select", options: [] },
];

const SIDES_DIP_ADDONS = [
  { _key: "scheese", name: "Add Cheese Toppings", type: "checkbox", options: [{ _key: "smoz", name: "Mozzarella Cheese", priceDeltaCents: 300 }, { _key: "spar", name: "Parmigiana Cheese", priceDeltaCents: 250 }] },
  { _key: "dip", name: "Choose Dip", type: "radio", options: [{ _key: "bbq", name: "BBQ Dip", priceDeltaCents: 0 }, { _key: "bb", name: "Bang Bang Dip", priceDeltaCents: 0 }, { _key: "ga", name: "Garlic Aioli Dip", priceDeltaCents: 0 }, { _key: "md", name: "Mayo Dip", priceDeltaCents: 0 }, { _key: "sm", name: "Spicy Mayo Dip", priceDeltaCents: 0 }] },
];

const DRINKS_ADDONS = [
  { _key: "drinks", name: "Choose Drinks", type: "checkbox", selectExactly: 2, options: [{ _key: "cc", name: "Coca Cola", priceDeltaCents: 0 }, { _key: "cz", name: "Coke Zero", priceDeltaCents: 0 }, { _key: "ft", name: "Fuze Iced Tea", priceDeltaCents: 0 }, { _key: "sp", name: "Sprite", priceDeltaCents: 0 }] },
];

function getAddons(catSlug, prodSlug) {
  if (catSlug === "pizza") return PIZZA_ADDONS;
  if (catSlug === "pasta") return PASTA_ADDONS;
  if (catSlug === "sides" && (prodSlug === "fries-belgium-style" || prodSlug === "onion-rings")) return SIDES_DIP_ADDONS;
  if (prodSlug === "summer-feature-combo") return DRINKS_ADDONS;
  return [];
}

const PRODUCTS = [
  { name: "Margarita Pizza", slug: "margarita-pizza", cat: "pizza", price: 799, desc: "Homemade Italian-style tomato sauce , mozzarella cheese , fresh basil leaf" },
  { name: "Pepperoni Pizza", slug: "pepperoni-pizza", cat: "pizza", price: 899, desc: "Homemade Italian style tomato sauce , mozzarella cheese , pepperoni" },
  { name: "Hawaiian Pizza", slug: "hawaiian-pizza", cat: "pizza", price: 899, desc: "Homemade Italian-style tomato sauce , mozzarella cheese , diced pineapple , smoked ham" },
  { name: "All Dressed Pizza (Quebec Style)", slug: "all-dressed-pizza-quebec-style", cat: "pizza", price: 899, desc: "Homemade Italian-style tomato sauce , mozzarella cheese , pepperoni , green bell pepper , sliced mushrooms" },
  { name: "Vegetarian Pizza", slug: "vegetarian-pizza", cat: "pizza", price: 999, desc: "Homemade Italian-style tomato sauce , mozzarella , sliced black olives , red onions , green bell pepper , mushroom , corn (Vegetarian)" },
  { name: "Bacon Onion Pizza", slug: "bacon-onion-pizza", cat: "pizza", price: 999, desc: "Homemade Italian-style tomato sauce , mozzarella cheese , bacon , mushrooms , red onions" },
  { name: "Chicken & Bacon Pizza", slug: "chicken-bacon-pizza", cat: "pizza", price: 999, desc: "Homemade roasted garlic creamy sauce , mozzarella cheese , oven-roasted chicken , bacon , sliced black olives" },
  { name: "Chicken Parmigiana Pizza (Halal)", slug: "chicken-parmigiana-pizza-halal", cat: "pizza", price: 999, desc: "Halal. Homemade roasted garlic creamy sauce, mozzarella cheese, sliced black olives, oven-roasted chicken, mushroom, red onion, grated Parmigiano cheese." },
  { name: "Meat Lovers", slug: "meat-lovers", cat: "pizza", price: 999, desc: "Homemade Italian-style tomato sauce , mozzarella , Bacon , Smoked Ham , Italian Sausage , Red onion , Sliced jalapeno" },
  { name: "Meatball Pizza", slug: "meatball-pizza", cat: "pizza", price: 899, desc: "Homemade Italian-style tomato sauce , mozzarella cheese , Red Onion , Italian-style meatballs , sliced black olives" },
  { name: "Philly Steak Garlic Pizza (Signature)", slug: "philly-steak-garlic-pizza-signature", cat: "pizza", price: 1099, desc: "Homemade roasted garlic creamy sauce, mozzarella cheese, red onions, roast beef (shredded), mushroom, sliced black olives." },
  { name: "Cheesy Garlic Bread", slug: "cheesy-garlic-bread", cat: "pizza", price: 799, desc: "Roasted cream garlic-mozzarella cheese served with dip of your choice (spicy mayo , BBQ , garlic aioli)" },
  { name: "Vegan Margarita", slug: "vegan-margarita", cat: "pizza", price: 1599, desc: "Homemade Italian-style tomato sauce , Vegan cheese , fresh basil leaf" },
  { name: "Vegan Vegetarian Pizza", slug: "vegan-vegetarian-pizza", cat: "pizza", price: 1899, desc: "Homemade Italian-style tomato sauce , Vegan mozzarella , sliced black olives , red onions , green bell pepper , mushroom , corn" },
  { name: "Chicken Alfredo Penne (Halal)", slug: "chicken-alfredo-penne-halal", cat: "pasta", price: 1399, desc: "Alfredo sauce , Penne , Cherry tomatoes , Sliced mushrooms , Roasted chicken , Grated Parmigiana cheese , Fresh Basil leaf" },
  { name: "Spaghetti Bolognese", slug: "spaghetti-bolognese", cat: "pasta", price: 1399, desc: "Meat Sauce , Spaghetti , Grated Parmigiana cheese" },
  { name: "Garlic Shrimp Penne", slug: "garlic-shrimp-penne", cat: "pasta", price: 1699, desc: "Rose Sauce , Penne , Roasted garlic , Shrimp , Mushroom , Grated Parmigiana cheese , Chili flakes" },
  { name: "Classic Italian Meatball", slug: "classic-italian-meatball", cat: "pasta", price: 1499, desc: "Pasta Sauce , Penne , Grated Parmesan cheese , Italian Meatballs , Fresh Basil leaf , Chili flakes" },
  { name: "Italian Sausage Penne", slug: "italian-sausage-penne", cat: "pasta", price: 1499, desc: "Pasta Sauce , Penne , Italian Sausage , Green Pepper , Red Onion , Grated Parmigiana Cheese , Chili Flakes" },
  { name: "Bacon Mushrooms", slug: "bacon-mushrooms", cat: "pasta", price: 1599, desc: "Alfredo Sauce , Penne , Bacon , Sliced Mushroom , Red Onion , Grated Parmigiana Cheese" },
  { name: "Ricotta Capers (Vegeterian)", slug: "ricotta-capers-vegeterian", cat: "panuozzo", price: 1350, desc: "Ricotta cheese , Basil Pesto , Capers , Fresh Tomato ,Baby arugula , Balsamic reduction" },
  { name: "Roast Beef", slug: "roast-beef", cat: "panuozzo", price: 1350, desc: "Ricotta cheese , Roasted garlic aioli , Sliced roast Beef , Fresh Tomato ,Baby arugula ,Chili Flakes" },
  { name: "Chicken Caesar", slug: "chicken-caesar", cat: "panuozzo", price: 1350, desc: "Ricotta cheese , Sliced Smoked Chicken , Caesar , Tomato ,Romania Lettuce" },
  { name: "Mortada Di Ricotta", slug: "mortada-di-ricotta", cat: "panuozzo", price: 1350, desc: "Ricotta cheese , Mortadella , Basil Pesto , Tomato ,Baby arugula" },
  { name: "Fries (Belgium Style)", slug: "fries-belgium-style", cat: "sides", price: 750, desc: "Served with dip of your choice (spicy mayo , BBQ , garlic aioli )" },
  { name: "Onion Rings", slug: "onion-rings", cat: "sides", price: 750, desc: "Served with dip of your choice (spicy mayo , BBQ , garlic aioli)" },
  { name: "Italian Poutine", slug: "italian-poutine", cat: "sides", price: 999, desc: "Fries , cheese curds , bolognese sauce , grated Parmigiano cheese" },
  { name: "Caesar Salad", slug: "caesar-salad", cat: "sides", price: 899, desc: "Romaine lettuce , bacon , croutons , grated Parmigiano cheese (served with Caesar dressing)" },
  { name: "Arancini al Ragu", slug: "arancini-al-ragu", cat: "arancini", price: 1399, desc: "Risotto rice , ground beef , savory tomato sauce , and melty mozzarella , served with marinara sauce and grated Parmesan" },
  { name: "Coca Cola", slug: "coca-cola", cat: "beverages", price: 300, desc: "Carbonated soft drink with a classic cola flavor" },
  { name: "Coke Zero", slug: "coke-zero", cat: "beverages", price: 300, desc: "A refreshing cola with zero sugar and zero calories" },
  { name: "Fuze Iced Tea", slug: "fuze-iced-tea", cat: "beverages", price: 300, desc: "Naturally flavored lemon iced tea with a refreshing taste" },
  { name: "Sprite", slug: "sprite", cat: "beverages", price: 300, desc: "A refreshing lemon-lime soda with natural flavor" },
  { name: "Summer Feature Combo", slug: "summer-feature-combo", cat: "features", price: 2999, shortDesc: "Your choice of two medium sized signature pizzas and two drinks with fries and garlic aioli dip. Included sides: Fries (Belgium Style)", includedAddons: ["Garlic Aioli Dip"] },
];

async function run() {
  console.log("Creating categories...");
  for (const cat of CATEGORIES) {
    await client.createOrReplace({
      _id: cat._id,
      _type: "category",
      name: cat.name,
      slug: { _type: "slug", current: cat.slug },
      order: cat.order,
    });
    console.log(`  ✓ ${cat.name}`);
  }

  console.log("\nCreating products...");
  for (const p of PRODUCTS) {
    const catId = `cat-${p.cat}`;
    const addons = getAddons(p.cat, p.slug);
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: catId },
      description: p.desc || "",
      shortDescription: p.shortDesc || "",
      priceCents: p.price,
      salePriceCents: p.salePrice || null,
      featured: p.featured || false,
      includedAddons: p.includedAddons || [],
      addonGroups: addons,
    });
    console.log(`  ✓ ${p.name} ($${(p.price / 100).toFixed(2)})`);
  }

  console.log("\nCreating site settings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Pizza Olive",
    phone: "(647) 221-1145",
    email: "info@pizzaolive.ca",
    address: "275 Dundas St W\nToronto, Canada M5T 3K1",
    heroTitle: "Authentic Italian Pizza & Pasta",
    heroSubtitle: "Pizza Olive is Toronto's destination for handcrafted pizza, fresh pasta and Italian favourites — made with passion, delivered to your door.",
    hours: [
      { _key: "mon", day: "Monday", time: "10:30 AM – 8:00 PM" },
      { _key: "tue", day: "Tuesday", time: "10:30 AM – 8:00 PM" },
      { _key: "wed", day: "Wednesday", time: "10:30 AM – 8:00 PM" },
      { _key: "thu", day: "Thursday", time: "10:30 AM – 8:00 PM" },
      { _key: "fri", day: "Friday", time: "10:30 AM – 8:00 PM" },
      { _key: "sat", day: "Saturday", time: "11:30 AM – 7:00 PM" },
      { _key: "sun", day: "Sunday", time: "Closed" },
    ],
  });
  console.log("  ✓ Site Settings");

  console.log("\n✅ Import complete! Go to /studio to manage everything.");
}

run().catch(console.error);
