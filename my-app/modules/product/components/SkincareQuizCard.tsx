"use client";

import React from "react";
import { Select } from "@/modules/shared";

export interface SkincareQuizCardProps {
  skinTypeOptions?: string[];
  skinConcernOptions?: string[];
  stepTypeOptions?: string[];
  selectedSkinTypes: string[];
  onToggleSkinType: (type: string) => void;
  selectedConcerns: string[];
  onToggleConcern: (concern: string) => void;
  routineStep: string;
  onRoutineStepChange: (step: string) => void;
  title?: string;
  className?: string;
}

const defaultSkinTypeOptions = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "All Skin Types"];
const defaultSkinConcernOptions = [
  "Acne & Blemishes",
  "Aging & Fine Lines",
  "Hyperpigmentation",
  "Dryness & Dehydration",
  "Redness & Sensitivity",
  "Uneven Texture",
  "Enlarged Pores",
];
const defaultStepTypeOptions = [
  "Cleanser",
  "Toner",
  "Serum / Treatment",
  "Moisturizer",
  "Sunscreen / SPF",
  "Eye Cream",
  "Exfoliator / Mask",
];

export function SkincareQuizCard({
  skinTypeOptions = defaultSkinTypeOptions,
  skinConcernOptions = defaultSkinConcernOptions,
  stepTypeOptions = defaultStepTypeOptions,
  selectedSkinTypes,
  onToggleSkinType,
  selectedConcerns,
  onToggleConcern,
  routineStep,
  onRoutineStepChange,
  title = "Skincare Quiz Attributes",
  className = "",
}: SkincareQuizCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-5 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#F0E8E3] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#583F37]">{title}</h2>
          <p className="text-xs text-[#7A6860] mt-0.5">Used for customer skincare matching quiz filters.</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#FAF5F2] text-[#583F37] border border-[#E9E3DE]">
          Quiz Data
        </span>
      </div>

      {/* Skin Type */}
      <div>
        <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
          SKIN TYPE
        </label>
        <div className="flex flex-wrap gap-2">
          {skinTypeOptions.map((type) => {
            const isSelected = selectedSkinTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => onToggleSkinType(type)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#004D5A] text-white border-[#004D5A]"
                    : "bg-[#FAF5F2] text-[#6E5B53] border-[#E9E3DE] hover:bg-[#F3ECE6]"
                }`}
              >
                {type} {isSelected && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skin Concerns */}
      <div>
        <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
          SKIN CONCERNS
        </label>
        <div className="flex flex-wrap gap-2">
          {skinConcernOptions.map((concern) => {
            const isSelected = selectedConcerns.includes(concern);
            return (
              <button
                key={concern}
                type="button"
                onClick={() => onToggleConcern(concern)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#583F37] text-white border-[#583F37]"
                    : "bg-[#FAF5F2] text-[#6E5B53] border-[#E9E3DE] hover:bg-[#F3ECE6]"
                }`}
              >
                {concern} {isSelected && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      <Select
        label="Routine Step Type"
        value={routineStep}
        onChange={(e) => onRoutineStepChange(e.target.value)}
        options={stepTypeOptions}
      />
    </div>
  );
}

export default SkincareQuizCard;
