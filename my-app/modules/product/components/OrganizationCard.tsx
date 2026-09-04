"use client";

import React from "react";
import { Select } from "@/modules/shared";
import { useGetCategories } from "@/app/api/hooks/useCategories";

export interface OrganizationCardProps {
  category: string;
  onCategoryChange: (value: string) => void;
  title?: string;
  className?: string;
}

export function OrganizationCard({
  category,
  onCategoryChange,
  title = "Organization",
  className = "",
}: OrganizationCardProps) {
  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.items || [];
  const categoryOptions = [
    { value: "", label: "Select a category", disabled: true },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];
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


