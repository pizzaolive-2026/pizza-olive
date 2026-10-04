"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { formatCents } from "@/lib/money";

interface OrderItem {
  name: string;
  quantity: number;
  unitAmountCents: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  fulfillment: string;
  deliveryAddress?: string;
  uberQuoteId?: string;
  uberDeliveryId?: string;
  uberTrackingUrl?: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalCents: number;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "🆕 New",
  preparing: "👨‍🍳 Preparing",
  ready: "✅ Ready",
  completed: "📦 Completed",
  cancelled: "❌ Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#dc2626",
  preparing: "#d97706",
  ready: "#16a34a",
  completed: "#6b7280",
  cancelled: "#9ca3af",
};

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.3);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.35);
    });
  } catch {
    // Audio not available
  }
}

const STAFF_PIN = "1145"; // last 4 of restaurant phone

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const knownIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Check session storage for existing unlock
  useEffect(() => {
    try {
      if (sessionStorage.getItem("orders_unlocked") === "1") setUnlocked(true);
    } catch {
      // sessionStorage unavailable (private mode etc.) — stay locked
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      const fetched: Order[] = data.orders ?? [];

      if (!isFirstLoad.current) {
        // Check for new orders
        const newOrders = fetched.filter((o) => !knownIds.current.has(o._id));
        if (newOrders.length > 0) {
          playAlertSound();
          setNewOrderAlert(newOrders[0]);
          // Browser notification
          try {
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              new Notification("🍕 New Order!", {
                body: `Order ${newOrders[0].orderNumber} — ${formatCents(newOrders[0].totalCents)}`,
                icon: "/images/logo.png",
              });
            }
          } catch {
            // Notifications not supported
          }
          setTimeout(() => setNewOrderAlert(null), 8000);
        }
      }

      fetched.forEach((o) => knownIds.current.add(o._id));
      isFirstLoad.current = false;
      setOrders(fetched);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch {
      // Notifications not supported (iOS Safari)
    }
  }, []);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? {
              ...o,
              status,
              ...(data.uberDeliveryId ? { uberDeliveryId: data.uberDeliveryId } : {}),
              ...(data.uberTrackingUrl ? { uberTrackingUrl: data.uberTrackingUrl } : {}),
            }
          : o
      )
    );
    if (data.uberDispatched) {
      alert(`🚗 Uber driver dispatched! Tracking: ${data.uberTrackingUrl ?? "check Uber dashboard"}`);
    }
    if (data.uberError) {
      alert(`⚠️ Order marked ready but Uber dispatch failed: ${data.uberError}`);
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // PIN lock screen
  if (!unlocked) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: 320, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🍕</div>
          <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "0.25rem" }}>Staff Access</h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Enter PIN to view orders</p>
          <input
            type="password" inputMode="numeric" maxLength={4}
            value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (pin === STAFF_PIN) { try { sessionStorage.setItem("orders_unlocked", "1"); } catch {} setUnlocked(true); }
                else { setPinError(true); setPin(""); }
              }
            }}
            placeholder="••••"
            style={{ width: "100%", padding: "0.75rem", fontSize: "1.5rem", textAlign: "center", letterSpacing: "0.5rem", border: `2px solid ${pinError ? "#dc2626" : "#e5e7eb"}`, borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
            autoFocus
          />
          {pinError && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.5rem" }}>Incorrect PIN</p>}
          <button
            onClick={() => {
              if (pin === STAFF_PIN) { try { sessionStorage.setItem("orders_unlocked", "1"); } catch {} setUnlocked(true); }
              else { setPinError(true); setPin(""); }
            }}
            style={{ marginTop: "1rem", width: "100%", padding: "0.75rem", background: "#dc2626", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "1rem" }}>
      {/* Alert banner */}
      {newOrderAlert && (
        <div style={{
          position: "fixed", top: 12, left: "1rem", right: "1rem",
          background: "#dc2626", color: "white", padding: "0.85rem 1.25rem",
          borderRadius: "12px", zIndex: 9999, fontWeight: 700, fontSize: "1rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "pulse 1s infinite",
          textAlign: "center",
        }}>
          🍕 NEW ORDER! — {newOrderAlert.orderNumber} — {formatCents(newOrderAlert.totalCents)}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.25rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111" }}>🍕 Orders</h1>
          <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>Auto-refreshes every 15s</span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {["all", "new", "preparing", "ready", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "0.35rem 0.75rem", borderRadius: "999px", border: "none",
              background: filter === s ? "#dc2626" : "#e5e7eb",
              color: filter === s ? "white" : "#374151",
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              fontSize: "0.85rem",
            }}>
              {s === "all" ? "All" : STATUS_LABELS[s]}
              {s !== "all" && (
                <span style={{ marginLeft: 6, background: "rgba(255,255,255,0.3)", borderRadius: "999px", padding: "0 6px" }}>
                  {orders.filter((o) => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#6b7280" }}>Loading orders...</p>}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}>
            <div style={{ fontSize: "3rem" }}>📋</div>
            <p>No orders yet</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((order) => (
            <div key={order._id} style={{
              background: "white", borderRadius: "12px", padding: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              borderLeft: `4px solid ${STATUS_COLORS[order.status] ?? "#e5e7eb"}`,
            }}>
              {/* Top row: order number + price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{order.orderNumber}</span>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#dc2626" }}>
                    {formatCents(order.totalCents)}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              {/* Status badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.4rem" }}>
                <span style={{
                  padding: "0.2rem 0.6rem",
                  background: STATUS_COLORS[order.status] + "22",
                  color: STATUS_COLORS[order.status],
                  borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600,
                }}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span style={{
                  padding: "0.2rem 0.6rem",
                  background: order.fulfillment === "delivery" ? "#dbeafe" : "#fef3c7",
                  color: order.fulfillment === "delivery" ? "#1d4ed8" : "#92400e",
                  borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600,
                }}>
                  {order.fulfillment === "delivery" ? "🚗 Delivery" : "🏪 Pickup"}
                </span>
              </div>

              {order.customerName && (
                <div style={{ marginTop: "0.5rem", color: "#374151", fontSize: "0.9rem" }}>
                  👤 {order.customerName} {order.customerEmail && `· ${order.customerEmail}`}
                </div>
              )}
              {order.deliveryAddress && (
                <div style={{ color: "#374151", fontSize: "0.9rem" }}>📍 {order.deliveryAddress}</div>
              )}
              {order.uberQuoteId && !order.uberDeliveryId && (
                <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  🚗 Uber Quote: <span style={{ fontFamily: "monospace" }}>{order.uberQuoteId}</span>
                </div>
              )}
              {order.uberDeliveryId && (
                <div style={{ color: "#16a34a", fontSize: "0.85rem", marginTop: "0.2rem", fontWeight: 600 }}>
                  🚗 Driver dispatched!
                  {order.uberTrackingUrl && (
                    <> · <a href={order.uberTrackingUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#1d4ed8" }}>Track delivery</a></>
                  )}
                </div>
              )}

              <div style={{ marginTop: "0.75rem", borderTop: "1px solid #f3f4f6", paddingTop: "0.75rem" }}>
                {(order.items ?? []).map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#374151", marginBottom: "0.25rem" }}>
                    <span>×{item.quantity} {item.name}</span>
                    <span>{formatCents(item.unitAmountCents * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Status actions */}
              {order.status !== "completed" && order.status !== "cancelled" && (
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {order.status === "new" && (
                    <button onClick={() => updateStatus(order._id, "preparing")}
                      style={{ flex: 1, minWidth: 130, padding: "0.6rem 1rem", background: "#d97706", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                      👨‍🍳 Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateStatus(order._id, "ready")}
                      style={{ flex: 1, minWidth: 130, padding: "0.6rem 1rem", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                      ✅ Mark Ready
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateStatus(order._id, "completed")}
                      style={{ flex: 1, minWidth: 130, padding: "0.6rem 1rem", background: "#6b7280", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                      📦 Complete
                    </button>
                  )}
                  <button onClick={() => updateStatus(order._id, "cancelled")}
                    style={{ padding: "0.6rem 1rem", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.9; transform: translateX(-50%) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
