"use client";

import React from "react";
import type { ProductVariant } from "@/types";

export interface ProductVariantsCardProps {
  variants: ProductVariant[];
  onAddVariantRow?: () => void;
  onUpdateVariant: (id: string, field: keyof ProductVariant, value: ProductVariant[keyof ProductVariant]) => void;
  onRemoveVariant: (id: string) => void;
  hideAddVariant?: boolean;
  title?: string;
  className?: string;
}

export function ProductVariantsCard({
  variants,
  onAddVariantRow,
  onUpdateVariant,
  onRemoveVariant,
  hideAddVariant = false,
  title = "Product Variants (Sizes & Stock)",
  className = "",
}: ProductVariantsCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#583F37]">{title}</h2>
          <p className="text-xs text-[#7A6860] mt-0.5">Configure different sizes and stock counts.</p>
        </div>
        {!hideAddVariant && onAddVariantRow && (
          <button
            type="button"
            onClick={onAddVariantRow}
            className="px-3.5 py-2 bg-[#FAF5F2] hover:bg-[#F3ECE6] text-[#583F37] font-semibold text-xs rounded-xl border border-[#E9E3DE] transition-colors cursor-pointer flex items-center gap-1"
          >
            + Add Variant Size
          </button>
        )}
      </div>

      <div className="space-y-3">
        {variants.map((v) => (
          <div key={v.id} className="p-3.5 rounded-xl border border-[#E9E3DE] bg-[#FAF6F4]/50 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-4">
              <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">SIZE / VARIANT</label>
              <input
                type="text"
                value={v.size}
                onChange={(e) => onUpdateVariant(v.id, "size", e.target.value)}
                placeholder="e.g. 50ml"
                className="w-full text-xs font-medium border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28]"
              />
            </div>
            <div className="col-span-4">
              <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">SKU</label>
              <input
                type="text"
                value={v.sku}
                onChange={(e) => onUpdateVariant(v.id, "sku", e.target.value)}
                placeholder="SKU"
                className="w-full text-xs border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28] font-mono"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">STOCK</label>
              <input
                type="number"
                value={v.stock}
                onChange={(e) => onUpdateVariant(v.id, "stock", parseInt(e.target.value, 10) || 0)}
                placeholder="Stock"
                className="w-full text-xs border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28] font-semibold"
              />
            </div>
            <div className="col-span-1 text-right">
              <button
                type="button"
                onClick={() => onRemoveVariant(v.id)}
                className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                title="Remove Variant"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductVariantsCard;
