import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductBySlug } from "@/data/products";
import { sumCents } from "@/lib/money";

// STRIPE_SECRET_KEY must only ever be read here, server-side. Never send it
// to the client and never accept a price/total from the client as truth.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

interface SelectedAddon {
  groupName: string;
  optionName: string;
  priceDeltaCents: number; // client-supplied — re-verified below
}

interface CheckoutItem {
  slug: string;
  quantity: number;
  specialInstructions?: string;
  selectedAddons?: SelectedAddon[];
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
  const deliveryFeeCents: number = body.deliveryFeeCents ?? 0;

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Re-derive every line item price from the server-side product catalog.
  // The browser never supplies a trusted total — only slugs, quantities,
  // and addon selections whose prices are re-verified against the catalog.
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
    const basePrice = product.salePriceCents ?? product.priceCents;

    // Re-verify addon prices against the product's server-side addon groups.
    let addonTotal = 0;
    const addonDescriptions: string[] = [];
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      for (const addon of item.selectedAddons) {
        const group = product.addonGroups.find(
          (g) => g.name === addon.groupName
        );
        if (!group) continue; // ignore unknown groups
        const option = group.options.find((o) => o.name === addon.optionName);
        if (!option) continue; // ignore unknown options
        // Use the SERVER-SIDE price, not the client-supplied one
        addonTotal += option.priceDeltaCents;
        if (option.priceDeltaCents > 0) {
          addonDescriptions.push(addon.optionName);
        }
      }
    }

    const unitAmount = basePrice + addonTotal;
    const productName =
      addonDescriptions.length > 0
        ? `${product.name} (+ ${addonDescriptions.join(", ")})`
        : product.name;

    lineItems.push({
      price_data: {
        currency: "cad",
        unit_amount: unitAmount,
        product_data: { name: productName },
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pizza-olive.vercel.app"}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pizza-olive.vercel.app"}/checkout`,
      metadata: {
        fulfillment,
        address: fulfillment === "delivery" ? body.address ?? "" : "",
        uberQuoteId:
          fulfillment === "delivery" ? body.uberQuoteId ?? "" : "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Stripe session creation failed.";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
