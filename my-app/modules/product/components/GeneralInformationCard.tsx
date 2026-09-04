"use client";

import React from "react";
import { TextInput } from "@/modules/shared";

export interface GeneralInformationCardProps {
  productName: string;
  onProductNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  title?: string;
  className?: string;
}

export function GeneralInformationCard({
  productName,
  onProductNameChange,
  description,
  onDescriptionChange,
  title = "General Information",
  className = "",
}: GeneralInformationCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}>
      <h2 className="text-base font-bold text-[#583F37]">{title}</h2>

      <TextInput
        label="Product Name"
        required
        placeholder="e.g. Minimalist Ceramic Collection or Hydrating Serum"
        value={productName}
        onChange={(e) => onProductNameChange(e.target.value)}
      />

      <div>
        <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
          DESCRIPTION
        </label>
        <div className="border border-[#E9E3DE] rounded-xl overflow-hidden">
          <div className="bg-[#FAF6F4] border-b border-[#E9E3DE] p-2 flex items-center gap-3 text-xs font-bold text-[#6E5B53]">
            <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded cursor-pointer">B</button>
            <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded italic cursor-pointer">I</button>
            <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded cursor-pointer">≡</button>
            <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded cursor-pointer">🔗</button>
          </div>
          <textarea
            rows={4}
            placeholder="Describe your product's unique features, ingredients, and benefits..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full text-sm p-3 text-[#3D2E28] outline-hidden bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default GeneralInformationCard;
