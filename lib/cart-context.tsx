"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { CartLine } from "@/types/product";
import { sumCents } from "@/lib/money";

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (slug: string, index?: number) => void;
  updateQuantity: (slug: string, quantity: number, index?: number) => void;
  itemCount: number;
  subtotalCents: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function addItem(line: Omit<CartLine, "quantity">, quantity = 1) {
    setLines((prev) => {
      // Match on slug + same addon selections + same price (so a pizza with
      // extra bacon is a separate line from the same pizza with extra pepperoni)
      const existing = prev.find(
        (l) =>
          l.slug === line.slug &&
          l.unitPriceCents === line.unitPriceCents &&
          JSON.stringify(l.selectedAddons ?? []) ===
            JSON.stringify(line.selectedAddons ?? [])
      );
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { ...line, quantity }];
    });
    setIsOpen(true);
  }

  function removeItem(slug: string, index?: number) {
    setLines((prev) => {
      if (index !== undefined) {
        return prev.filter((_, i) => i !== index);
      }
      // Legacy: remove first match by slug
      const idx = prev.findIndex((l) => l.slug === slug);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  }

  function updateQuantity(slug: string, quantity: number, index?: number) {
    if (quantity <= 0) {
      removeItem(slug, index);
      return;
    }
    setLines((prev) =>
      prev.map((l, i) => {
        if (index !== undefined) {
          return i === index ? { ...l, quantity } : l;
        }
        return l.slug === slug ? { ...l, quantity } : l;
      })
    );
  }

  const itemCount = useMemo(
    () => sumCents(lines.map((l) => l.quantity * 100)) / 100,
    [lines]
  );

  const subtotalCents = useMemo(
    () => sumCents(lines.map((l) => l.unitPriceCents * l.quantity)),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        itemCount,
        subtotalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
