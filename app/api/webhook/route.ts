import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p1weztyq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook signature verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const lineItems = fullSession.line_items?.data ?? [];
    const orderNumber = `ORD-${Date.now()}`;

    const items = lineItems
      .filter((li) => li.description !== "HST (13%)" && li.description !== "Delivery fee")
      .map((li) => ({
        _type: "object",
        _key: li.id,
        name: li.description ?? "",
        quantity: li.quantity ?? 1,
        unitAmountCents: li.price?.unit_amount ?? 0,
      }));

    const totalCents = fullSession.amount_total ?? 0;

    const doc = {
      _type: "order",
      _id: `order-${session.id}`,
      orderNumber,
      stripeSessionId: session.id,
      status: "new",
      fulfillment: session.metadata?.fulfillment ?? "pickup",
      deliveryAddress: session.metadata?.address ?? "",
      customerEmail: session.customer_details?.email ?? "",
      customerName: session.customer_details?.name ?? "",
      items,
      totalCents,
      createdAt: new Date().toISOString(),
    };

    try {
      await sanityWriteClient.createOrReplace(doc);
      console.log("Order saved to Sanity:", orderNumber);
    } catch (err) {
      console.error("Failed to save order to Sanity:", err);
    }
  }

  return NextResponse.json({ received: true });
}
