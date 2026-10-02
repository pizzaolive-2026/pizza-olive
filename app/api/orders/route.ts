import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p1weztyq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function GET() {
  const orders = await sanityWriteClient.fetch(
    `*[_type == "order"] | order(createdAt desc)[0...50] {
      _id, orderNumber, status, fulfillment, deliveryAddress,
      customerName, customerEmail, items, totalCents, createdAt
    }`
  );
  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  const { orderId, status } = await req.json();
  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
  }
  await sanityWriteClient.patch(orderId).set({ status }).commit();
  return NextResponse.json({ ok: true });
}
