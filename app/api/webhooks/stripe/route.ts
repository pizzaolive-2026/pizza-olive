import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

// Stripe requires the raw request body to verify the webhook signature —
// do not JSON.parse before this.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json(
      { error: "Webhook not configured. Set STRIPE_WEBHOOK_SECRET." },
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
    return NextResponse.json(
      { error: `Invalid signature: ${err instanceof Error ? err.message : err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const fulfillment = session.metadata?.fulfillment;
    const address = session.metadata?.address;

    if (fulfillment === "delivery" && address) {
      // Only now — after Stripe confirms payment — do we create the Uber
      // Direct delivery. This matches the required order flow: payment
      // succeeds → webhook confirms → THEN create delivery, never before.
      //
      // NEEDS CONFIRMATION / TODO once Uber Direct credentials exist:
      // 1. Re-fetch or re-derive the delivery quote_id associated with this
      //    session (stored at quote time, not trusted from the client).
      // 2. POST https://api.uber.com/v1/customers/{customerId}/deliveries
      //    with that quote_id, pickup/dropoff details, and order manifest.
      // 3. Store the returned delivery_id against the order record.
      console.log(
        `TODO: create Uber Direct delivery for session ${session.id} to ${address}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
