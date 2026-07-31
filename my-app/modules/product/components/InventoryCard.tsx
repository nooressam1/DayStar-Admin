"use client";

import React from "react";
import { TextInput } from "@/modules/shared";

export interface InventoryCardProps {
  totalPrice: string;
  onTotalPriceChange: (value: string) => void;
  title?: string;
  className?: string;
}

export function InventoryCard({
  totalPrice,
  onTotalPriceChange,
  title = "Pricing & Inventory",
  className = "",
}: InventoryCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}>
      <h2 className="text-base font-bold text-[#583F37]">{title}</h2>

      <TextInput
        label="Product Price ($)"
        type="number"
        value={totalPrice}
        onChange={(e) => onTotalPriceChange(e.target.value)}
        className="font-bold"
      />
    </div>
  );
}

export default InventoryCard;
