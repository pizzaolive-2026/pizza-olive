import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createDelivery } from "@/lib/uber-direct";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 501 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const fulfillment = session.metadata?.fulfillment;
    const address = session.metadata?.address;
    const quoteId = session.metadata?.uberQuoteId;

    if (fulfillment === "delivery" && address && quoteId) {
      try {
        const delivery = await createDelivery({
          quoteId,
          pickupName: "Pizza Olive",
          pickupPhone: "+16472211145",
          dropoffAddress: address,
          dropoffName: session.customer_details?.name ?? "Customer",
          dropoffPhone: session.customer_details?.phone ?? "",
          orderDescription: `Pizza Olive order #${session.id.slice(-8)}`,
        });

        console.log(
          `Uber Direct delivery created: ${delivery.deliveryId} (status: ${delivery.status})`
        );
      } catch (err) {
        console.error("Failed to create Uber Direct delivery:", err);
        // Payment already succeeded — log the error for manual follow-up
        // but don't return an error to Stripe (would cause retries)
      }
    }
  }

  return NextResponse.json({ received: true });
}
