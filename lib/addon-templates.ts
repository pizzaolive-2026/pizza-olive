import type { AddonGroup } from "@/types/product";

/**
 * These groups are transcribed directly from live product page screenshots
 * (Margarita Pizza, Hawaiian Pizza, Garlic Shrimp Penne, Fries (Belgium
 * Style), Summer Feature Combo). Prices are exact, not estimated.
 *
 * NOTE: "Mozzarella Cheese" appears twice at different prices (+$3.00 and
 * +$2.50) on both the pizza and pasta screenshots. That's how the live site
 * displays it — likely two distinct WooCommerce add-on entries with the
 * same label (portion size difference, mislabeled, or a site data issue).
 * Preserved verbatim rather than "fixed", per the no-changes rule. Flag for
 * the client to confirm which is which.
 */

export const PIZZA_SIZE_GROUP: AddonGroup = {
  name: "Size",
  type: "radio",
  options: [
    { name: 'Small 8"', priceDeltaCents: 0 },
    { name: 'Medium 12"', priceDeltaCents: 500 },
  ],
};

export const CHEESE_TOPPINGS_GROUP: AddonGroup = {
  name: "Add Cheese Toppings",
  type: "checkbox",
  options: [
    { name: "Mozzarella Cheese", priceDeltaCents: 300 },
    { name: "Mozzarella Cheese", priceDeltaCents: 250 }, // NEEDS CONFIRMATION: duplicate label, see note above
  ],
  needsConfirmation: true,
};

export const MEAT_TOPPINGS_GROUP: AddonGroup = {
  name: "Add Meat Toppings",
  type: "checkbox",
  options: [
    { name: "Bacon", priceDeltaCents: 350 },
    { name: "Italian Sausage", priceDeltaCents: 250 },
    { name: "Italian Style Meatballs", priceDeltaCents: 350 },
    { name: "Over Roasted Chicken", priceDeltaCents: 350 },
    { name: "Pepperoni", priceDeltaCents: 250 },
    { name: "Smoked Ham", priceDeltaCents: 250 },
  ],
};

export const VEGETABLE_TOPPINGS_GROUP: AddonGroup = {
  name: "Add Vegetable Toppings",
  type: "checkbox",
  options: [
    { name: "Black Olives", priceDeltaCents: 200 },
    { name: "Corn", priceDeltaCents: 200 },
    { name: "Fresh Sliced Mushrooms", priceDeltaCents: 200 },
    { name: "Green Pepper", priceDeltaCents: 200 },
    { name: "Jalapeño Pepper", priceDeltaCents: 200 },
    { name: "Pineapple", priceDeltaCents: 200 },
    { name: "Red Onion", priceDeltaCents: 200 },
    { name: "Roasted Minced Garlic", priceDeltaCents: 200 },
  ],
};

export const EXTRA_SAUCE_GROUP: AddonGroup = {
  name: "Add Extra Sauce",
  type: "select",
  options: [
    // NEEDS CONFIRMATION: the live dropdown was shown closed ("Choose an
    // option") in the screenshot, so its actual choices/prices weren't
    // visible. Placeholder below — replace once confirmed.
    { name: "NEEDS CONFIRMATION", priceDeltaCents: 0 },
  ],
  needsConfirmation: true,
};

export const SIDES_CHEESE_TOPPINGS_GROUP: AddonGroup = {
  name: "Add Cheese Toppings",
  type: "checkbox",
  options: [
    { name: "Mozzarella Cheese", priceDeltaCents: 300 },
    { name: "Parmigiana Cheese", priceDeltaCents: 250 },
  ],
};

export const CHOOSE_DIP_GROUP: AddonGroup = {
  name: "Choose Dip",
  type: "radio",
  options: [
    { name: "BBQ Dip", priceDeltaCents: 0 },
    { name: "Bang Bang Dip", priceDeltaCents: 0 },
    { name: "Garlic Aioli Dip", priceDeltaCents: 0 },
    { name: "Mayo Dip", priceDeltaCents: 0 },
    { name: "Spicy Mayo Dip", priceDeltaCents: 0 },
  ],
};

export const CHOOSE_DRINKS_GROUP: AddonGroup = {
  name: "Choose Drinks",
  type: "checkbox",
  selectExactly: 2,
  options: [
    { name: "Coca Cola", priceDeltaCents: 0 },
    { name: "Coke Zero", priceDeltaCents: 0 },
    { name: "Fuze Iced Tea", priceDeltaCents: 0 },
    { name: "Sprite", priceDeltaCents: 0 },
  ],
};

/** Category-level assignment. Panuozzo and Arancini had no screenshot
 * reference, so they're deliberately left with no addon groups rather than
 * guessed — see PRODUCT_INVENTORY.md / NEEDS-CONFIRMATION notes. */
export function addonGroupsForProduct(categorySlug: string, slug: string): AddonGroup[] {
  if (categorySlug === "pizza") {
    return [PIZZA_SIZE_GROUP, CHEESE_TOPPINGS_GROUP, MEAT_TOPPINGS_GROUP];
  }
  if (categorySlug === "pasta") {
    return [CHEESE_TOPPINGS_GROUP, MEAT_TOPPINGS_GROUP, VEGETABLE_TOPPINGS_GROUP, EXTRA_SAUCE_GROUP];
  }
  if (categorySlug === "sides") {
    // Only confirmed for products whose description explicitly references a
    // choice of dip (Fries, Onion Rings). Italian Poutine / Caesar Salad are
    // left with no groups rather than assumed — flag those for a screenshot.
    if (slug === "fries-belgium-style" || slug === "onion-rings") {
      return [SIDES_CHEESE_TOPPINGS_GROUP, CHOOSE_DIP_GROUP];
    }
    return [];
  }
  if (slug === "summer-feature-combo") {
    return [CHOOSE_DRINKS_GROUP];
  }
  // panuozzo, arancini, beverages: no screenshot reference — no groups applied.
  return [];
}
