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

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const knownIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

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
          if (Notification.permission === "granted") {
            new Notification("🍕 New Order!", {
              body: `Order ${newOrders[0].orderNumber} — ${formatCents(newOrders[0].totalCents)}`,
              icon: "/images/logo.png",
            });
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
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  async function updateStatus(orderId: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "2rem" }}>
      {/* Alert banner */}
      {newOrderAlert && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#dc2626", color: "white", padding: "1rem 2rem",
          borderRadius: "12px", zIndex: 9999, fontWeight: 700, fontSize: "1.2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "pulse 1s infinite",
        }}>
          🍕 NEW ORDER! — {newOrderAlert.orderNumber} — {formatCents(newOrderAlert.totalCents)}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111" }}>🍕 Orders</h1>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Auto-refreshes every 15s</span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["all", "new", "preparing", "ready", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "0.4rem 1rem", borderRadius: "999px", border: "none",
              background: filter === s ? "#dc2626" : "#e5e7eb",
              color: filter === s ? "white" : "#374151",
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
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
              background: "white", borderRadius: "12px", padding: "1.5rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              borderLeft: `4px solid ${STATUS_COLORS[order.status] ?? "#e5e7eb"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{order.orderNumber}</span>
                  <span style={{
                    marginLeft: "0.75rem", padding: "0.2rem 0.75rem",
                    background: STATUS_COLORS[order.status] + "22",
                    color: STATUS_COLORS[order.status],
                    borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600,
                  }}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span style={{
                    marginLeft: "0.5rem", padding: "0.2rem 0.75rem",
                    background: order.fulfillment === "delivery" ? "#dbeafe" : "#fef3c7",
                    color: order.fulfillment === "delivery" ? "#1d4ed8" : "#92400e",
                    borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600,
                  }}>
                    {order.fulfillment === "delivery" ? "🚗 Uber Delivery" : "🏪 Pickup"}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#dc2626" }}>
                    {formatCents(order.totalCents)}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {order.customerName && (
                <div style={{ marginTop: "0.5rem", color: "#374151", fontSize: "0.9rem" }}>
                  👤 {order.customerName} {order.customerEmail && `· ${order.customerEmail}`}
                </div>
              )}
              {order.deliveryAddress && (
                <div style={{ color: "#374151", fontSize: "0.9rem" }}>📍 {order.deliveryAddress}</div>
              )}
              {order.uberQuoteId && (
                <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  🚗 Uber Quote: <span style={{ fontFamily: "monospace" }}>{order.uberQuoteId}</span>
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
                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {order.status === "new" && (
                    <button onClick={() => updateStatus(order._id, "preparing")}
                      style={{ padding: "0.4rem 1rem", background: "#d97706", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                      👨‍🍳 Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateStatus(order._id, "ready")}
                      style={{ padding: "0.4rem 1rem", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                      ✅ Mark Ready
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateStatus(order._id, "completed")}
                      style={{ padding: "0.4rem 1rem", background: "#6b7280", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                      📦 Complete
                    </button>
                  )}
                  <button onClick={() => updateStatus(order._id, "cancelled")}
                    style={{ padding: "0.4rem 1rem", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
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
