import { ProductItem } from "@/modules/shared";
import { formatMoney } from "@/utils/format";

export function exportProductsToCSV(
  products: ProductItem[],
  filename: string = "products_export.csv"
): void {
  if (!products || products.length === 0) return;

  const headers = "ID,Name,Category,SKU,Price,Stock,Status\n";
  const rows = products
    .map(
      (p) =>
        `"${p.id}","${p.name}","${p.category}","${p.sku}","${formatMoney(p.price)}",${p.stockCount},"${p.isActive !== false ? "Active" : "Inactive"}"`
    )
    .join("\n");

  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
