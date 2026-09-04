import { NextRequest, NextResponse } from "next/server";

const RESTAURANT_ADDRESS = "275 Dundas St W, Toronto, ON M5T 3K1";

// Uber Direct client credentials are read here only, never exposed to the
// browser. This route returns a delivery quote the client can display, but
// the actual delivery is only ever created server-side, after payment
// succeeds (see the Stripe webhook route) — never on quote alone.
export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }

  const clientId = process.env.UBER_DIRECT_CLIENT_ID;
  const clientSecret = process.env.UBER_DIRECT_CLIENT_SECRET;
  const customerId = process.env.UBER_DIRECT_CUSTOMER_ID;

  if (!clientId || !clientSecret || !customerId) {
    return NextResponse.json(
      {
        error:
          "Uber Direct is not configured. Set UBER_DIRECT_CLIENT_ID, UBER_DIRECT_CLIENT_SECRET, UBER_DIRECT_CUSTOMER_ID.",
      },
      { status: 501 }
    );
  }

  // NOTE: once real credentials are set above, this early return goes away
  // and the block below performs the actual Uber Direct quote call.

  // --- Real integration sketch (fill in once credentials are live) ---
  // 1. POST https://login.uber.com/oauth/v2/token to get an access token
  //    (client_credentials grant, scoped to eats.deliveries).
  // 2. POST https://api.uber.com/v1/customers/{customerId}/delivery_quotes
  //    with pickup_address = RESTAURANT_ADDRESS and dropoff_address = address.
  // 3. Store the returned quote_id server-side (e.g. in a short-lived
  //    session/order record) so /api/checkout can verify the fee it's
  //    charging actually matches an Uber-issued quote, instead of trusting
  //    a number the client could tamper with.
  //
  // NEEDS CONFIRMATION: real quote once credentials are supplied. Returning
  // a placeholder shape below so the checkout UI has something to render.

  return NextResponse.json(
    {
      error:
        "NEEDS CONFIRMATION: Uber Direct call not yet implemented — see the sketch above.",
    },
    { status: 501 }
  );
}
