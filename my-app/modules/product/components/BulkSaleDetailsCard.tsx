"use client";

import React from "react";
import { Dropdown } from "@/modules/shared";

export interface BulkSaleDetailsCardProps {
  enabled?: boolean;
  onToggleSection?: (enabled: boolean) => void;
  saleStatus: string;
  saleDiscountPercentage: string;
  onSaleStatusChange: (val: string) => void;
  onDiscountPercentageChange: (val: string) => void;
}

export function BulkSaleDetailsCard({
  enabled = false,
  onToggleSection,
  saleStatus,
  saleDiscountPercentage,
  onSaleStatusChange,
  onDiscountPercentageChange,
}: BulkSaleDetailsCardProps) {
  return (
    <div
      className={`lg:col-span-2 rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all duration-200 ${
        enabled
          ? "bg-white border-[#E9E3DE]"
          : "bg-stone-50/70 border-dashed border-[#CBD5E1] opacity-75"
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
          <h3 className={`text-base font-bold transition-colors ${enabled ? "text-[#2A1E1A]" : "text-[#8A756C]"}`}>
            Product Sale Details
          </h3>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggleSection?.(e.target.checked)}
              className="w-4 h-4 rounded border-[#E9E3DE] text-[#004956] focus:ring-[#004956] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#004956]">
              {enabled ? "Selected" : "Select to Edit"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
              Sale Status
            </label>
            <Dropdown
              disabled={!enabled}
              value={saleStatus}
              onChange={(e) => onSaleStatusChange(e.target.value)}
              options={["Active", "Inactive"]}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
              Sale Discount Percentage
            </label>
            <input
              type="text"
              disabled={!enabled || saleStatus !== "Active"}
              value={saleDiscountPercentage}
              onChange={(e) => onDiscountPercentageChange(e.target.value)}
              className="w-full bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium disabled:bg-stone-100 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-[#8A756C] mt-4">
        This product will be visible to all customers on your online store.
      </p>
    </div>
  );
}
