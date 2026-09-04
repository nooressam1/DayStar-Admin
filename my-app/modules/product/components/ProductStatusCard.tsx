"use client";

import React from "react";

export interface ProductStatusCardProps {
  isActive: boolean;
  onToggleActive: () => void;
  title?: string;
  className?: string;
}

export function ProductStatusCard({
  isActive,
  onToggleActive,
  title = "Product Status",
  className = "",
}: ProductStatusCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-base font-bold text-[#583F37]">{title}</h2>
        <p className="text-xs text-[#7A6860] mt-0.5">Control whether this product is active and visible on your storefront.</p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            isActive
              ? "bg-[#50E3C2]/20 text-[#044E35] border border-[#50E3C2]/40"
              : "bg-stone-100 text-stone-600 border border-stone-200"
          }`}
        >
          {isActive ? "Active" : "Draft / Hidden"}
        </span>

        <button
          type="button"
          onClick={onToggleActive}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
            isActive ? "bg-[#004D5A]" : "bg-stone-300"
          }`}
        >
          <span
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
              isActive ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductStatusCard;
