export function formatMoney(cents: number, currency: string = "egp"): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currency,
  }).format((cents || 0) / 100);
}

export function parsePrice(priceVal: string | number): number {
  if (typeof priceVal === "number") return priceVal;
  if (!priceVal) return 0;
  return parseFloat(String(priceVal).replace(/[^0-9.]/g, "")) || 0;
}
