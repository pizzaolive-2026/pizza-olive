"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, updateQuantity, subtotalCents } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="cart-drawer__backdrop" onClick={closeCart} />
      <div className="cart-drawer__panel">
        <div className="cart-drawer__header">
          <h2>Your Cart</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart">
            &times;
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="cart-drawer__empty">Your Cart is Currently Empty: $0.00</p>
        ) : (
          <>
            <ul className="cart-drawer__lines">
              {lines.map((line) => (
                <li key={line.slug}>
                  <span className="cart-drawer__line-name">
                    {line.name}
                    {line.selectedAddons && line.selectedAddons.length > 0 && (
                      <span className="cart-drawer__line-addons">
                        {line.selectedAddons.map((a) => a.optionName).join(", ")}
                      </span>
                    )}
                  </span>
                  <div className="cart-drawer__line-qty">
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.slug, line.quantity - 1)}
                      aria-label={`Decrease quantity of ${line.name}`}
                    >
                      &minus;
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.slug, line.quantity + 1)}
                      aria-label={`Increase quantity of ${line.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-drawer__line-price">
                    {formatCents(line.unitPriceCents * line.quantity)}
                  </span>
                  <button
                    type="button"
                    className="cart-drawer__line-remove"
                    onClick={() => removeItem(line.slug)}
                    aria-label={`Remove ${line.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span>{formatCents(subtotalCents)}</span>
            </div>

            <Link
              href="/checkout"
              className="cart-drawer__checkout"
              onClick={closeCart}
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
