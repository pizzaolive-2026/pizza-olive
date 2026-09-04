"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";
import type { FulfillmentType } from "@/types/product";

export default function CheckoutPage() {
  const { lines, subtotalCents } = useCart();
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [address, setAddress] = useState("");
  const [deliveryQuote, setDeliveryQuote] = useState<{
    quoteId: string;
    feeCents: number;
    estimateMinutes: number;
  } | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestQuote() {
    setLoadingQuote(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) throw new Error("Could not get a delivery quote for that address.");
      const data = await res.json();
      setDeliveryQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoadingQuote(false);
    }
  }

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      // Server re-derives every price from the product catalog — the client
      // only sends slugs/quantities, never trusted amounts.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            slug: l.slug,
            quantity: l.quantity,
            specialInstructions: l.specialInstructions,
          })),
          fulfillment,
          address: fulfillment === "delivery" ? address : undefined,
          uberQuoteId: fulfillment === "delivery" ? deliveryQuote?.quoteId : undefined,
          deliveryFeeCents: fulfillment === "delivery" ? deliveryQuote?.feeCents : undefined,
        }),
      });
      if (!res.ok) throw new Error("Checkout could not be started.");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <fieldset>
        <legend>Fulfillment</legend>
        <label>
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "pickup"}
            onChange={() => setFulfillment("pickup")}
          />
          Pickup
        </label>
        <label>
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "delivery"}
            onChange={() => setFulfillment("delivery")}
          />
          Delivery
        </label>
      </fieldset>

      {fulfillment === "delivery" && (
        <div className="checkout-page__delivery">
          <label>
            Delivery address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Toronto, ON"
            />
          </label>
          <button type="button" onClick={requestQuote} disabled={!address || loadingQuote}>
            {loadingQuote ? "Getting quote…" : "Get delivery quote"}
          </button>
          {deliveryQuote && (
            <p>
              Delivery fee: {formatCents(deliveryQuote.feeCents)} · Estimated{" "}
              {deliveryQuote.estimateMinutes} min
            </p>
          )}
        </div>
      )}

      <div className="checkout-page__summary">
        <span>Subtotal</span>
        <span>{formatCents(subtotalCents)}</span>
      </div>

      {error && <p className="checkout-page__error">{error}</p>}

      <button
        type="button"
        className="hero__cta"
        onClick={handleCheckout}
        disabled={submitting || (fulfillment === "delivery" && !deliveryQuote)}
      >
        {submitting ? "Redirecting to payment…" : "Pay with Stripe"}
      </button>
    </section>
  );
}
