"use client";

import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";

export default function CartButton() {
  const { itemCount, subtotalCents, openCart } = useCart();

  return (
    <button
      type="button"
      className="cart-button"
      onClick={openCart}
      aria-label="View your shopping cart"
    >
      {itemCount} items - {formatCents(subtotalCents)}
    </button>
  );
}
