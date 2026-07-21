"use client";

import React, { useState } from "react";

export interface BulkEditFormData {
  saleStatus: string;
  saleDiscountPercentage: string;
  productStatus: string;
  skinType: string;
  productConcerns: string;
  productStepType: string;
  category: string;
  quantity: string;
  bulkNote: string;
}

export interface BulkEditFormProps {
  initialData?: Partial<BulkEditFormData>;
  onSave?: (data: BulkEditFormData) => void;
  onCancel?: () => void;
  className?: string;
}

export function BulkEditForm({
  initialData,
  onSave,
  onCancel,
  className = "",
}: BulkEditFormProps) {
  const [formData, setFormData] = useState<BulkEditFormData>({
    saleStatus: initialData?.saleStatus || "Active",
    saleDiscountPercentage: initialData?.saleDiscountPercentage || "10%",
    productStatus: initialData?.productStatus || "Active",
    skinType: initialData?.skinType || "Oily",
    productConcerns: initialData?.productConcerns || "Oily",
    productStepType: initialData?.productStepType || "Toner",
    category: initialData?.category || "Electronics",
    quantity: initialData?.quantity || "124",
    bulkNote: initialData?.bulkNote || "....",
  });

  const handleChange = (field: keyof BulkEditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-6 ${className}`}>
      {/* Top Grid: Sale Details & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Sale Details Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#2A1E1A] pb-4 border-b border-[#E9E3DE]">
            Product Sale Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                Sale Status
              </label>
              <div className="relative">
                <select
                  value={formData.saleStatus}
                  onChange={(e) => handleChange("saleStatus", e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                Sale Discount Percentage
              </label>
              <input
                type="text"
                value={formData.saleDiscountPercentage}
                onChange={(e) => handleChange("saleDiscountPercentage", e.target.value)}
                className="w-full bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium"
              />
            </div>
          </div>
          <p className="text-xs text-[#8A756C] mt-4">
            This product will be visible to all customers on your online store.
          </p>
        </div>

        {/* Product Status Card (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2A1E1A] pb-4 border-b border-[#E9E3DE]">
              Product Status
            </h3>
            <div className="mt-4">
              <div className="relative">
                <select
                  value={formData.productStatus}
                  onChange={(e) => handleChange("productStatus", e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#8A756C] mt-4">
            This product will be visible to all customers on your online store.
          </p>
        </div>
      </div>

      {/* Middle Grid: Skin Quiz Details & General Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skin Quiz Details Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#2A1E1A] pb-4 border-b border-[#E9E3DE]">
            Skin Quiz Details
          </h3>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                Skin Type
              </label>
              <div className="relative">
                <select
                  value={formData.skinType}
                  onChange={(e) => handleChange("skinType", e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
                >
                  <option value="Oily">Oily</option>
                  <option value="Dry">Dry</option>
                  <option value="Combination">Combination</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Normal">Normal</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                Product Concerns
              </label>
              <div className="relative">
                <select
                  value={formData.productConcerns}
                  onChange={(e) => handleChange("productConcerns", e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
                >
                  <option value="Oily">Oily</option>
                  <option value="Acne & Blemishes">Acne & Blemishes</option>
                  <option value="Anti-Aging">Anti-Aging</option>
                  <option value="Hydration">Hydration</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                Product Step Type
              </label>
              <div className="relative">
                <select
                  value={formData.productStepType}
                  onChange={(e) => handleChange("productStepType", e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
                >
                  <option value="Toner">Toner</option>
                  <option value="Cleanser">Cleanser</option>
                  <option value="Serum">Serum</option>
                  <option value="Moisturizer">Moisturizer</option>
                  <option value="Sunscreen">Sunscreen</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#8A756C] mt-4">
            This change will affect the products skin type, product conerns and product step types. These changes will affect the skin care quiz experience
          </p>
        </div>

        {/* Product General Details Card (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2A1E1A] pb-4 border-b border-[#E9E3DE]">
              Product General Details
            </h3>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Office">Home & Office</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
                  Update Product Quantity
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  className="w-full bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Update Note Card */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex flex-col justify-between">
        <h3 className="text-base font-bold text-[#2A1E1A] pb-4 border-b border-[#E9E3DE]">
          Bulk Update Note
        </h3>
        <div className="mt-4">
          <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
            Notes
          </label>
          <div className="relative">
            <select
              value={formData.bulkNote}
              onChange={(e) => handleChange("bulkNote", e.target.value)}
              className="w-full appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2.5 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004956] font-medium cursor-pointer"
            >
              <option value="....">....</option>
              <option value="Seasonal Price Adjustment">Seasonal Price Adjustment</option>
              <option value="Inventory Restock Batch">Inventory Restock Batch</option>
              <option value="Promotional Sale Update">Promotional Sale Update</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#8A756C] mt-4">
          Add note to track big bulk updates
        </p>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>Save Product</span>
        </button>
      </div>
    </form>
  );
}

export default BulkEditForm;
