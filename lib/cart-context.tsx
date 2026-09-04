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
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  itemCount: number;
  subtotalCents: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function addItem(line: Omit<CartLine, "quantity">, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === line.slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === line.slug ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { ...line, quantity }];
    });
    setIsOpen(true);
  }

  function removeItem(slug: string) {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }

  function updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, quantity } : l))
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
