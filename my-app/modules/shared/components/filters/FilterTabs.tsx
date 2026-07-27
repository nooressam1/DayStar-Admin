"use client";

import React from "react";
import { FilterOption } from "./FilterSelect";

export interface FilterTabsProps {
  options: FilterOption[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function FilterTabs({
  options,
  value,
  onChange,
  className = "",
}: FilterTabsProps) {
  return (
    <div
      className={`inline-flex bg-[#F9F5F2] rounded-xl border border-[#EBE3DE] p-1 shadow-2xs shrink-0 ${className}`}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isActive
                ? "bg-[#F0E6DF] text-[#4A3831] shadow-2xs"
                : "text-[#8A756C] hover:text-[#4A3831] hover:bg-[#F4ECE7]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
