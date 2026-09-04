"use client";

import React from "react";

export interface FilterBadgeProps {
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterBadge({
  label = "Filters",
  icon,
  className = "",
}: FilterBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 bg-[#F0E6DF] text-[#4A3831] font-semibold text-sm px-4 py-2 rounded-xl shrink-0 select-none ${className}`}
    >
      {icon || (
        <svg
          className="w-4 h-4 text-[#754E45]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      )}
      <span>{label}</span>
    </div>
  );
}

export default FilterBadge;
