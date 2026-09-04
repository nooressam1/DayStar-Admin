"use client";

import React from "react";
import { Dropdown } from "@/modules/shared";

export interface BulkSkinQuizCardProps {
  enabled?: boolean;
  onToggleSection?: (enabled: boolean) => void;
  skinType: string;
  productConcerns: string;
  productStepType: string;
  onSkinTypeChange: (val: string) => void;
  onConcernsChange: (val: string) => void;
  onStepTypeChange: (val: string) => void;
}

export function BulkSkinQuizCard({
  enabled = false,
  onToggleSection,
  skinType,
  productConcerns,
  productStepType,
  onSkinTypeChange,
  onConcernsChange,
  onStepTypeChange,
}: BulkSkinQuizCardProps) {
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
            Skin Quiz Details
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

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
              Skin Type
            </label>
            <Dropdown
              disabled={!enabled}
              value={skinType}
              onChange={(e) => onSkinTypeChange(e.target.value)}
              options={["Oily", "Dry", "Combination", "Sensitive", "Normal"]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
              Product Concerns
            </label>
            <Dropdown
              disabled={!enabled}
              value={productConcerns}
              onChange={(e) => onConcernsChange(e.target.value)}
              options={["Oily", "Acne & Blemishes", "Anti-Aging", "Hydration"]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
              Product Step Type
            </label>
            <Dropdown
              disabled={!enabled}
              value={productStepType}
              onChange={(e) => onStepTypeChange(e.target.value)}
              options={["Toner", "Cleanser", "Serum", "Moisturizer", "Sunscreen"]}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-[#8A756C] mt-4">
        This change will affect the products skin type, product conerns and product step types. These changes will affect the skin care quiz experience
      </p>
    </div>
  );
}
