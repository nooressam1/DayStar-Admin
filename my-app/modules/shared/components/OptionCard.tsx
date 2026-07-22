"use client";

import React from "react";

export interface OptionCardProps {
  isSelected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function OptionCard({
  isSelected,
  onSelect,
  title,
  description,
  children,
  className = "",
}: OptionCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col gap-2 ${
        isSelected
          ? "border-[#004D5A] bg-[#FAF5F2]/60 ring-1 ring-[#004D5A]/20"
          : "border-[#E9E3DE] bg-white hover:bg-stone-50"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Custom Styled Radio Circle */}
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isSelected
              ? "border-[#004D5A] bg-[#004D5A]"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>

        {/* Option Header */}
        <div>
          <h4 className="text-sm font-semibold text-[#3D2E28] leading-tight">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-[#7A6860] mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {/* Expanded Content when Selected */}
      {isSelected && children && (
        <div className="mt-2 pl-8 space-y-2 animate-in fade-in duration-150" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
}

export default OptionCard;
