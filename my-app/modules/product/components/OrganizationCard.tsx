"use client";

import React from "react";
import { Select } from "@/modules/shared";

export interface OrganizationCardProps {
  category: string;
  onCategoryChange: (value: string) => void;
  categoryOptions?: string[];
  title?: string;
  className?: string;
}

const defaultCategoryOptions = [
  "Skincare",
  "Cleanser",
  "Serum",
  "Moisturizer",
  "Electronics",
  "Clothing",
];

export function OrganizationCard({
  category,
  onCategoryChange,
  categoryOptions = defaultCategoryOptions,
  title = "Organization",
  className = "",
}: OrganizationCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}>
      <h2 className="text-base font-bold text-[#583F37]">{title}</h2>
      <Select
        label="Category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={categoryOptions}
      />
    </div>
  );
}

export default OrganizationCard;
