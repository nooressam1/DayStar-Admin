"use client";

import React from "react";
import { TextInput } from "@/modules/shared";

export interface InventoryCardProps {
  mainSku: string;
  onMainSkuChange: (value: string) => void;
  totalQuantity: string;
  onTotalQuantityChange: (value: string) => void;
  title?: string;
  className?: string;
}

export function InventoryCard({
  mainSku,
  onMainSkuChange,
  totalQuantity,
  onTotalQuantityChange,
  title = "Inventory",
  className = "",
}: InventoryCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}>
      <h2 className="text-base font-bold text-[#583F37]">{title}</h2>

      <TextInput
        label="SKU (Stock Keeping Unit)"
        value={mainSku}
        onChange={(e) => onMainSkuChange(e.target.value)}
        className="font-mono"
      />

      <TextInput
        label="Total Available Quantity"
        type="number"
        value={totalQuantity}
        onChange={(e) => onTotalQuantityChange(e.target.value)}
        className="font-bold"
      />
    </div>
  );
}

export default InventoryCard;
