"use client";

import { formatMoney } from "@/utils/format";
import React from "react";

export type ProductBadgeType = "on_sale" | "out_of_stock" | "low_stock" | "new_arrival";

export interface ProductBadge {
  type: ProductBadgeType;
  label?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  category_id?: string | null;
  sku: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  images: string[];
  badge?: ProductBadge;
}

export interface ProductCardProps {
  product: ProductItem;
  isSelected?: boolean;
  selectable?: boolean;
  onSelectToggle?: (id: string) => void;
  onQuickEdit?: (product: ProductItem) => void;
  className?: string;
}

export function ProductCard({
  product,
  isSelected = false,
  selectable = false,
  onSelectToggle,
  onQuickEdit,
  className = "",
}: ProductCardProps) {
  const getBadgeStyle = (badge: ProductBadge) => {
    switch (badge.type) {
      case "on_sale":
        return {
          bg: "bg-[#B91C1C] text-white",
          text: badge.label || "ON SALE",
        };
      case "out_of_stock":
        return {
          bg: "bg-[#374151] text-white",
          text: badge.label || "OUT OF STOCK",
        };
      case "low_stock":
        return {
          bg: "bg-[#D97706] text-white",
          text: badge.label || "LOW STOCK",
        };
      case "new_arrival":
        return {
          bg: "bg-[#004956] text-white",
          text: badge.label || "NEW ARRIVAL",
        };
      default:
        return {
          bg: "bg-stone-800 text-white",
          text: badge.label || "",
        };
    }
  };

  const getStockIndicator = (count: number) => {
    if (count === 0) {
      return { dot: "bg-[#DC2626]", text: "Out of Stock" };
    }
    if (count <= 10) {
      return { dot: "bg-[#D97706]", text: `${count} Low Stock` };
    }
    return { dot: "bg-[#059669]", text: `${count} In Stock` };
  };

  const stockInfo = getStockIndicator(product.stockCount);

  return (
    <div
      onClick={() => selectable && onSelectToggle?.(product.id)}
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs ${selectable ? "cursor-pointer" : ""
        } ${isSelected
          ? "border-[#004956] ring-2 ring-[#004956] shadow-md"
          : "border-[#E9E3DE] hover:border-[#CBD5E1]"
        } ${className}`}
    >
      {/* Product Image Area */}
      <div className="relative h-48 w-full bg-[#FAF5F2] overflow-hidden flex items-center justify-center shrink-0">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Default SVG Keyboard / Product placeholder icon */
          <div className="flex flex-col items-center justify-center text-[#A08C84] p-4 text-center">
            <svg
              className="w-16 h-16 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}

        {/* Badge Overlay */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            {(() => {
              const badgeStyle = getBadgeStyle(product.badge);
              return (
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeStyle.bg}`}
                >
                  {badgeStyle.text}
                </span>
              );
            })()}
          </div>
        )}

        {/* Select Checkbox Overlay */}
        {selectable && (
          <div className="absolute top-3 right-3 z-10">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                ? "bg-[#004956] border-[#004956] text-white"
                : "bg-white/80 border-[#A08C84] text-transparent hover:border-[#004956]"
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
        <div className="flex flex-col gap-1">
          {/* Category & Stock Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A675E]">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 font-medium text-[#4A3831]">
              <span className={`w-2 h-2 rounded-full ${stockInfo.dot}`} />
              <span>{stockInfo.text}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-[#2A1E1A] leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* SKU */}
          <span className="text-xs font-medium text-[#8A756C]">
            SKU: {product.sku}
          </span>
        </div>

        {/* Price & Quick Edit Action Row */}
        <div className="flex items-end justify-between pt-2 border-t border-[#F0E8E3] mt-2">
          <div className="flex flex-col">
            {product.originalPrice !== undefined && (
              <span className="text-xs text-[#A08C84] line-through leading-none mb-0.5">
                {formatMoney(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-[#1E293B] leading-tight">
              {formatMoney(product.price)}
            </span>
          </div>

          {/* Quick Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickEdit?.(product);
            }}
            className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>Quick Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
