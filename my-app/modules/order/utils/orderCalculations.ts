import { OrderItem } from "@/types";

export function calculateSubtotal(items?: OrderItem[], fallbackTotal: number = 0): number {
  if (items && items.length > 0) {
    return items.reduce(
      (sum, item) => sum + (item.unit_price_snapshot || 0) * (item.quantity || 1),
      0
    );
  }
  return fallbackTotal;
}
