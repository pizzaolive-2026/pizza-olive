import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { createDelivery } from "@/lib/uber-direct";

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
      _id, orderNumber, status, fulfillment, deliveryAddress, uberQuoteId,
      customerName, customerEmail, items, totalCents, createdAt,
      uberDeliveryId, uberTrackingUrl
    }`
  );
  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  const { orderId, status } = await req.json();
  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
  }

  // If marking a delivery order as ready, dispatch Uber driver
  if (status === "ready") {
    const order = await sanityWriteClient.fetch(
      `*[_id == $id][0] { fulfillment, uberQuoteId, deliveryAddress, customerName, customerEmail }`,
      { id: orderId }
    );

    if (order?.fulfillment === "delivery" && order?.uberQuoteId) {
      try {
        const delivery = await createDelivery({
          quoteId: order.uberQuoteId,
          pickupName: "Pizza Olive",
          pickupPhone: "+14165550100",
          dropoffAddress: order.deliveryAddress ?? "",
          dropoffName: order.customerName ?? "Customer",
          dropoffPhone: "+14165559999", // fallback — replace with your restaurant number
          orderDescription: "Pizza order",
        });

        // Save Uber delivery ID and tracking URL to the order
        await sanityWriteClient
          .patch(orderId)
          .set({
            status,
            uberDeliveryId: delivery.deliveryId,
            uberTrackingUrl: delivery.trackingUrl ?? "",
          })
          .commit();

        return NextResponse.json({
          ok: true,
          uberDispatched: true,
          uberDeliveryId: delivery.deliveryId,
          uberTrackingUrl: delivery.trackingUrl,
        });
      } catch (err) {
        console.error("Uber dispatch failed:", err);
        // Still update status even if Uber fails, but report the error
        await sanityWriteClient.patch(orderId).set({ status }).commit();
        return NextResponse.json({
          ok: true,
          uberDispatched: false,
          uberError: err instanceof Error ? err.message : "Uber dispatch failed",
        });
      }
    }
  }

  await sanityWriteClient.patch(orderId).set({ status }).commit();
  return NextResponse.json({ ok: true });
}
