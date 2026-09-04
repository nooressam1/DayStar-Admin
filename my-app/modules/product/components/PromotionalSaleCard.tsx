"use client";

import React from "react";
import { TextInput } from "@/modules/shared";

export interface PromotionalSaleCardProps {
  isOnSale: boolean;
  onToggleSale: () => void;
  regularPrice: string;
  onRegularPriceChange: (val: string) => void;
  discountPercentage: string;
  onDiscountPercentageChange: (val: string) => void;
  calculatedSalePrice?: string;
  title?: string;
  className?: string;
}

export function PromotionalSaleCard({
  isOnSale,
  onToggleSale,
  regularPrice,
  onRegularPriceChange,
  discountPercentage,
  onDiscountPercentageChange,
  calculatedSalePrice,
  title = "Promotional Sale",
  className = "",
}: PromotionalSaleCardProps) {
  const getSalePrice = () => {
    if (calculatedSalePrice !== undefined) return calculatedSalePrice;
    const reg = parseFloat(regularPrice) || 0;
    const disc = parseFloat(discountPercentage) || 0;
    if (reg <= 0 || disc <= 0) return reg.toFixed(2);
    const sale = reg * (1 - disc / 100);
    return Math.max(0, sale).toFixed(2);
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#F0E8E3] pb-4">
        <div>
          <h2 className="text-base font-bold text-[#583F37]">{title}</h2>
          <p className="text-xs text-[#7A6860] mt-0.5">Enable discount percentage sale pricing for this product.</p>
        </div>

        <button
          type="button"
          onClick={onToggleSale}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
            isOnSale ? "bg-[#004D5A]" : "bg-stone-300"
          }`}
        >
          <span
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
              isOnSale ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {isOnSale && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Regular Price ($)"
              value={regularPrice}
              onChange={(e) => onRegularPriceChange(e.target.value)}
              className="font-semibold"
            />

            <TextInput
              label="Discount Percentage (%)"
              placeholder="20"
              value={discountPercentage}
              onChange={(e) => onDiscountPercentageChange(e.target.value)}
              suffix="%"
              className="border-[#50E3C2] text-[#044E35] font-bold"
            />
          </div>

          {/* Calculation Summary Box */}
          <div className="bg-[#FAF5F2] border border-[#E9E3DE] rounded-xl p-4 flex items-center justify-between text-sm">
            <span className="text-[#583F37] font-medium">Calculated Final Sale Price:</span>
            <span className="text-[#044E35] font-extrabold text-lg">
              ${getSalePrice()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromotionalSaleCard;
