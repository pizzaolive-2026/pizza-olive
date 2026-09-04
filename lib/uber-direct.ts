/**
 * Uber Direct server-side helper.
 * All secrets stay on the server — nothing here is importable from client code.
 */

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Reuse token if it hasn't expired (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.UBER_DIRECT_CLIENT_ID!;
  const clientSecret = process.env.UBER_DIRECT_CLIENT_SECRET!;

  const res = await fetch("https://login.uber.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "eats.deliveries",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uber OAuth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

export interface DeliveryQuote {
  quoteId: string;
  feeCents: number;
  estimateMinutes: number;
  expiresAt: string;
}

export async function getDeliveryQuote(dropoffAddress: string): Promise<DeliveryQuote> {
  const token = await getAccessToken();
  const customerId = process.env.UBER_DIRECT_CUSTOMER_ID!;

  const res = await fetch(
    `https://api.uber.com/v1/customers/${customerId}/delivery_quotes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickup_address: "275 Dundas St W, Toronto, ON M5T 3K1",
        dropoff_address: dropoffAddress,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uber quote failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  // Uber returns fee in cents or dollars depending on version — handle both
  const feeCents =
    typeof data.fee === "number"
      ? data.fee >= 100
        ? data.fee // already cents
        : Math.round(data.fee * 100) // dollars → cents
      : 0;

  return {
    quoteId: data.id,
    feeCents,
    estimateMinutes: data.duration ?? data.estimated_duration ?? 0,
    expiresAt: data.expires_at ?? "",
  };
}

export interface CreateDeliveryResult {
  deliveryId: string;
  status: string;
  trackingUrl?: string;
}

export async function createDelivery(opts: {
  quoteId: string;
  pickupName: string;
  pickupPhone: string;
  dropoffAddress: string;
  dropoffName: string;
  dropoffPhone: string;
  orderDescription?: string;
}): Promise<CreateDeliveryResult> {
  const token = await getAccessToken();
  const customerId = process.env.UBER_DIRECT_CUSTOMER_ID!;

  const res = await fetch(
    `https://api.uber.com/v1/customers/${customerId}/deliveries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote_id: opts.quoteId,
        pickup_address: "275 Dundas St W, Toronto, ON M5T 3K1",
        pickup_name: opts.pickupName,
        pickup_phone_number: opts.pickupPhone,
        dropoff_address: opts.dropoffAddress,
        dropoff_name: opts.dropoffName,
        dropoff_phone_number: opts.dropoffPhone,
        manifest_items: opts.orderDescription
          ? [{ name: opts.orderDescription, quantity: 1 }]
          : undefined,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uber delivery creation failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    deliveryId: data.id,
    status: data.status,
    trackingUrl: data.tracking_url,
  };
}
