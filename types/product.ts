export interface AddonOption {
  name: string;
  /** Upcharge in integer cents. 0 for a free/included choice (e.g. dip flavor). */
  priceDeltaCents: number;
}

export interface AddonGroup {
  name: string;
  /** radio = pick exactly one (e.g. Size); checkbox = pick any number (e.g. toppings);
   *  select = dropdown, single choice. */
  type: "radio" | "checkbox" | "select";
  required?: boolean;
  /** For checkbox groups with a "select exactly N" constraint (e.g. "Choose Drinks: Select 2 options"). */
  selectExactly?: number;
  options: AddonOption[];
  /** True when option contents/prices are unverified against the live site (see PRODUCT_INVENTORY.md). */
  needsConfirmation?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  /** Items called out as included add-ons in the original WooCommerce listing (e.g. "Garlic Aioli Dip") */
  includedAddons: string[];
  /** Canonical price in integer cents. Never do money math in floats. */
  priceCents: number;
  salePriceCents: number | null;
  category: string;
  categorySlug: string;
  image: string | null;
  featured: boolean;
  /** Size/topping/dip option groups, confirmed against live product pages where possible. */
  addonGroups: AddonGroup[];
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  specialInstructions?: string;
  selectedAddons?: { groupName: string; optionName: string; priceDeltaCents: number }[];
}

export type FulfillmentType = "delivery" | "pickup";
