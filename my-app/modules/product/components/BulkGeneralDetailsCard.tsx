"use client";

import React, { useMemo } from "react";
import { Dropdown } from "@/modules/shared";
import { useGetCategories } from "@/app/api/hooks/useCategories";

export interface BulkGeneralDetailsCardProps {
  enabled?: boolean;
  onToggleSection?: (enabled: boolean) => void;
  category: string;
  onCategoryChange: (val: string) => void;
}

export function BulkGeneralDetailsCard({
  enabled = false,
  onToggleSection,
  category,
  onCategoryChange,
}: BulkGeneralDetailsCardProps) {
  const { data: categoriesResponse, isLoading } = useGetCategories();
  const categories = useMemo(() => categoriesResponse?.items || [], [categoriesResponse]);

  const categoryOptions = useMemo(() => {
    if (isLoading) {
      return [{ value: "", label: "Loading categories...", disabled: true }];
    }
    const options = [
      { value: "", label: "Select a category", disabled: true },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ];
    return options;
  }, [categories, isLoading]);

  return (
    <div
      className={`rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all duration-200 ${
        enabled
          ? "bg-white border-[#E9E3DE]"
          : "bg-stone-50/70 border-dashed border-[#CBD5E1] opacity-75"
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
          <h3 className={`text-base font-bold transition-colors ${enabled ? "text-[#2A1E1A]" : "text-[#8A756C]"}`}>
            Product General Details
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
              Category
            </label>
            <Dropdown
              disabled={!enabled}
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              options={categoryOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
