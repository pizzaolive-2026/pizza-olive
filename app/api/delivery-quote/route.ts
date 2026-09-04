import { NextRequest, NextResponse } from "next/server";
import { getDeliveryQuote } from "@/lib/uber-direct";

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }

  if (
    !process.env.UBER_DIRECT_CLIENT_ID ||
    !process.env.UBER_DIRECT_CLIENT_SECRET ||
    !process.env.UBER_DIRECT_CUSTOMER_ID
  ) {
    return NextResponse.json(
      { error: "Uber Direct is not configured." },
      { status: 501 }
    );
  }

  try {
    const quote = await getDeliveryQuote(address);
    return NextResponse.json({
      quoteId: quote.quoteId,
      feeCents: quote.feeCents,
      estimateMinutes: quote.estimateMinutes,
      expiresAt: quote.expiresAt,
    });
  } catch (err) {
    console.error("Uber Direct quote error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not get delivery quote." },
      { status: 500 }
    );
  }
}
