import { ProductItem } from "@/modules/shared";
import { formatMoney, parsePrice } from "@/utils/format";

export { formatMoney, parsePrice };

export function formatProductForCard(item: any): ProductItem {
  if (!item) {
    return {
      id: "unknown",
      name: "Product",
      category: "GENERAL",
      sku: "N/A",
      price: 0,
      stockCount: 0,
      images: [],
    };
  }

  const rawPrice = typeof item.price === "number" ? item.price : parsePrice(item.price);
  const rawOriginalPrice = item.originalPrice !== undefined
    ? (typeof item.originalPrice === "number" ? item.originalPrice : parsePrice(item.originalPrice))
    : undefined;

  const images: string[] = Array.isArray(item.images) ? item.images : [];

  return {
    id: String(item.id || item.slug || Math.random()),
    name: item.name || "Untitled Product",
    category: item.category || "GENERAL",
    category_id: item.category_id || null,
    sku: item.sku || (item.slug ? item.slug.toUpperCase() : "SKU-001"),
    price: rawPrice,
    originalPrice: rawOriginalPrice,
    stockCount: item.stockCount ?? item.stock ?? 10,
    images,
    badge: item.badge || (item.on_sale ? { type: "on_sale", label: "SALE" } : undefined),
  };
}
