import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductBySlug } from "@/data/products";
import { sumCents } from "@/lib/money";

// STRIPE_SECRET_KEY must only ever be read here, server-side. Never send it
// to the client and never accept a price/total from the client as truth.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

interface CheckoutItem {
  slug: string;
  quantity: number;
  specialInstructions?: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 501 }
    );
  }

  const body = await req.json();
  const items: CheckoutItem[] = body.items ?? [];
  const fulfillment: "pickup" | "delivery" = body.fulfillment ?? "pickup";
  const deliveryFeeCents: number = body.deliveryFeeCents ?? 0; // TODO: re-verify against a stored quote id, not a raw client number

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Re-derive every line item price from the server-side product catalog.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${item.slug}` },
        { status: 400 }
      );
    }
    const quantity = Math.max(1, Math.floor(item.quantity));
    const unitAmount = product.salePriceCents ?? product.priceCents;

    lineItems.push({
      price_data: {
        currency: "cad",
        unit_amount: unitAmount,
        product_data: { name: product.name },
      },
      quantity,
    });
  }

  if (fulfillment === "delivery" && deliveryFeeCents > 0) {
    lineItems.push({
      price_data: {
        currency: "cad",
        unit_amount: deliveryFeeCents,
        product_data: { name: "Delivery fee" },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    metadata: {
      fulfillment,
      address: fulfillment === "delivery" ? body.address ?? "" : "",
    },
  });

  return NextResponse.json({ url: session.url });
}
