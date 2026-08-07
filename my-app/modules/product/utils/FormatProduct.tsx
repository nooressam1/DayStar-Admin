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

  const isOnSale = Boolean(
    item.on_sale ||
    item.isOnSale ||
    (item.discount_percentage && Number(item.discount_percentage) > 0)
  );
  const discountPct = Number(item.discount_percentage) || 0;

  let activePrice = rawPrice;
  let originalPrice: number | undefined = undefined;

  if (isOnSale) {
    if (discountPct > 0) {
      originalPrice = rawPrice;
      activePrice = Math.max(0, rawPrice * (1 - discountPct / 100));
    } else if (item.sale_price !== undefined || item.salePrice !== undefined) {
      originalPrice = rawPrice;
      activePrice = typeof item.sale_price === "number"
        ? item.sale_price
        : parsePrice(item.sale_price || item.salePrice);
    } else if (item.originalPrice !== undefined) {
      const orig = typeof item.originalPrice === "number" ? item.originalPrice : parsePrice(item.originalPrice);
      if (orig > rawPrice) {
        originalPrice = orig;
      }
    }
  }

  const categoryName = typeof item.category === "object" && item.category !== null
    ? item.category.name || item.category_name || "GENERAL"
    : item.category?.name || item.category_name || (typeof item.category === "string" ? item.category : "GENERAL");
  const images: string[] = Array.isArray(item.images) ? item.images : [];
  const variants: Array<{ stock?: number; sku?: string }> = Array.isArray(item.variants) ? item.variants : [];
  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : (item.stockCount ?? item.stock ?? 0);

  let badge = item.badge;
  if (!badge && isOnSale) {
    badge = {
      type: "on_sale",
      label: discountPct > 0 ? `${discountPct}% OFF` : "SALE",
    };
  }

  return {
    id: String(item.id || item.slug || Math.random()),
    name: item.name || "Untitled Product",
    category: categoryName,
    category_id: item.category_id || null,
    sku: item.sku || variants[0]?.sku || (item.slug ? item.slug.toUpperCase() : "SKU-001"),
    price: activePrice,
    originalPrice: originalPrice,
    stockCount: totalStock,
    images,
    badge,
  };
}
