"use client";

import React from "react";
import { useBulkEditForm, BulkEditFormData, BulkEditFormErrors } from "../hooks/useBulkEditForm";
import { BulkSaleDetailsCard } from "./BulkSaleDetailsCard";
import { BulkProductStatusCard } from "./BulkProductStatusCard";
import { BulkSkinQuizCard } from "./BulkSkinQuizCard";
import { BulkGeneralDetailsCard } from "./BulkGeneralDetailsCard";
import { BulkUpdateNoteCard } from "./BulkUpdateNoteCard";

export type { BulkEditFormData };

export interface BulkEditFormProps {
  initialData?: Partial<BulkEditFormData>;
  onSave?: (data: BulkEditFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function BulkEditForm({
  initialData,
  onSave,
  onCancel,
  isSubmitting = false,
  className = "",
}: BulkEditFormProps) {
  const [errors, setErrors] = React.useState<BulkEditFormErrors>({});
  const { formData, enabledSections, handleChange, toggleSection, validateForm } = useBulkEditForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const result = validateForm();
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSave?.(formData);
  };

  const errorList = Object.values(errors).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-6 ${className}`}>
      {errorList.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm space-y-1">
          <p className="font-semibold">Please fix the following validation issues before saving:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errorList.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Top Grid: Sale Details & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BulkSaleDetailsCard
          enabled={enabledSections.saleDetails}
          onToggleSection={(enabled) => toggleSection("saleDetails", enabled)}
          saleStatus={formData.saleStatus}
          saleDiscountPercentage={formData.saleDiscountPercentage}
          onSaleStatusChange={(val) => handleChange("saleStatus", val)}
          onDiscountPercentageChange={(val) => handleChange("saleDiscountPercentage", val)}
        />
        <BulkProductStatusCard
          enabled={enabledSections.productStatus}
          onToggleSection={(enabled) => toggleSection("productStatus", enabled)}
          productStatus={formData.productStatus}
          onProductStatusChange={(val) => handleChange("productStatus", val)}
        />
      </div>

      {/* Middle Grid: Skin Quiz Details & General Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BulkSkinQuizCard
          enabled={enabledSections.skinQuiz}
          onToggleSection={(enabled) => toggleSection("skinQuiz", enabled)}
          skinType={formData.skinType}
          productConcerns={formData.productConcerns}
          productStepType={formData.productStepType}
          onSkinTypeChange={(val) => handleChange("skinType", val)}
          onConcernsChange={(val) => handleChange("productConcerns", val)}
          onStepTypeChange={(val) => handleChange("productStepType", val)}
        />
        <BulkGeneralDetailsCard
          enabled={enabledSections.generalDetails}
          onToggleSection={(enabled) => toggleSection("generalDetails", enabled)}
          category={formData.category}
          onCategoryChange={(val) => handleChange("category", val)}
        />
      </div>

      {/* Bulk Update Note Card */}
      <BulkUpdateNoteCard
        enabled={enabledSections.bulkNote}
        onToggleSection={(enabled) => toggleSection("bulkNote", enabled)}
        bulkNote={formData.bulkNote}
        onBulkNoteChange={(val) => handleChange("bulkNote", val)}
      />

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span>Saving Changes...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save Product</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default BulkEditForm;
