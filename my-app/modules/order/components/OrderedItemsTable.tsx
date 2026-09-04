import React from "react";
import { OrderItem } from "@/types";
import { formatMoney } from "@/utils/format";

export interface OrderedItemsTableProps {
  items: OrderItem[];
  className?: string;
}

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80";

export function OrderedItemsTable({ items, className = "" }: OrderedItemsTableProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] py-6 shadow-xs space-y-4 ${className}`}>
      <div className="px-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#583F37]">
          Ordered Items ({items.length})
        </h2>
        <span className="text-xs text-[#7A6860]">SKU / Variant level</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E9E3DE] bg-[#FAF6F4]">
              <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                PRODUCT
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                PRICE
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                QTY
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider text-right">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E8E3]">
            {items.map((item) => {
              const productName = item.product_name || (item as any).name || "Item";
              const itemPrice = item.unit_price_snapshot ?? (item as any).price ?? 0;
              const itemSku = item.sku || (item as any).sku || "N/A";
              const itemImage = item.image || DEFAULT_PRODUCT_IMAGE;

              return (
                <tr key={item.id} className="hover:bg-[#FAF6F4]/50 transition-colors">
                  {/* Product Cell */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={itemImage}
                        alt={productName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                        }}
                        className="w-12 h-12 object-cover rounded-xl border border-[#E9E3DE] shrink-0 bg-[#FAF6F4]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#583F37] leading-snug">
                          {productName}
                        </p>
                        {(item as any).subtitle && (
                          <p className="text-xs text-[#8A756C] mt-0.5">{(item as any).subtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* SKU Cell */}
                  <td className="px-6 py-4 text-sm text-[#6E5B53] font-medium whitespace-nowrap">
                    {itemSku}
                  </td>

                  {/* Price Cell */}
                  <td className="px-6 py-4 text-sm text-[#583F37] font-semibold whitespace-nowrap">
                    {formatMoney(itemPrice)}
                  </td>

                  {/* Quantity Cell */}
                  <td className="px-6 py-4 text-sm text-[#583F37] font-semibold whitespace-nowrap">
                    {item.quantity}
                  </td>

                  {/* Total Cell */}
                  <td className="px-6 py-4 text-sm font-bold text-[#583F37] text-right whitespace-nowrap">
                    {formatMoney(itemPrice * item.quantity)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderedItemsTable;
