/**
 * All monetary values are stored and calculated as integer cents.
 * Never use floats for money math (rounding errors compound in carts/checkout).
 */

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function sumCents(values: number[]): number {
  return values.reduce((total, v) => total + v, 0);
}
