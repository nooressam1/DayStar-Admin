"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Button } from "@/modules/shared";

export interface ProductVariant {
  id: string;
  size: string;
  sku: string;
  price: string;
  stock: number;
}

const skinTypeOptions = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "All Skin Types"];
const skinConcernOptions = [
  "Acne & Blemishes",
  "Aging & Fine Lines",
  "Hyperpigmentation",
  "Dryness & Dehydration",
  "Redness & Sensitivity",
  "Uneven Texture",
  "Enlarged Pores",
];
const stepTypeOptions = [
  "Cleanser",
  "Toner",
  "Serum / Treatment",
  "Moisturizer",
  "Sunscreen / SPF",
  "Eye Cream",
  "Exfoliator / Mask",
];

export function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Media state
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608248597263-00de4680826d?w=300&auto=format&fit=crop&q=80",
  ]);

  // General Info state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  // Skincare Quiz Fields
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(["Combination", "Sensitive"]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(["Acne & Blemishes", "Dryness & Dehydration"]);
  const [routineStep, setRoutineStep] = useState("Serum / Treatment");

  // Status & Sale states (Separate)
  const [isActive, setIsActive] = useState(true);
  const [isOnSale, setIsOnSale] = useState(false);

  // Pricing (Percentage based discount for sale items)
  const [regularPrice, setRegularPrice] = useState("35.00");
  const [discountPercentage, setDiscountPercentage] = useState("20");

  // Variants state (Sizes & Stock)
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "var-1", size: "30ml / 1 fl oz", sku: "SKU-SERUM-30", price: "28.00", stock: 50 },
    { id: "var-2", size: "50ml / 1.7 fl oz", sku: "SKU-SERUM-50", price: "42.00", stock: 35 },
  ]);

  // Sidebar Inventory & Organization
  const [mainSku, setMainSku] = useState("SKU-12345");
  const [totalQuantity, setTotalQuantity] = useState("85");
  const [category, setCategory] = useState("Skincare");

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleAddVariantRow = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      size: "100ml / 3.4 fl oz",
      sku: `SKU-SERUM-${variants.length + 1}`,
      price: "65.00",
      stock: 20,
    };
    setVariants([...variants, newVar]);
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages([...images, url]);
    }
  };

  const calculateCalculatedSalePrice = () => {
    const reg = parseFloat(regularPrice) || 0;
    const disc = parseFloat(discountPercentage) || 0;
    if (reg <= 0 || disc <= 0) return reg.toFixed(2);
    const sale = reg * (1 - disc / 100);
    return Math.max(0, sale).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/product");
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Add New Product"
        subtitle="Fill in the details below to list a new item in your store catalog."
        backLink={{
          href: "/product",
          label: "Back to Product Catalog",
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => router.push("/product")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
            >
              Add Product
            </Button>
          </>
        }
      />

      {/* Form Content Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Media Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#583F37]">Product Media</h2>

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF6F4]/40 hover:bg-[#FAF6F4] rounded-2xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-[#004D5A] text-white flex items-center justify-center shadow-xs mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#583F37]">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-[#8A756C]">
                SVG, PNG, JPG or GIF (max. 800×400px)
              </p>
            </div>

            {/* Media Thumbnails Strip */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl border border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF5F2] flex items-center justify-center text-[#7A6860] hover:text-[#583F37] cursor-pointer text-xl font-bold transition-colors"
              >
                +
              </button>
              {images.map((img, idx) => (
                <div key={idx} className="w-16 h-16 rounded-xl border border-[#E9E3DE] overflow-hidden relative group">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* General Information Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#583F37]">General Information</h2>

            <div>
              <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
                PRODUCT NAME
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Minimalist Ceramic Collection or Hydrating Serum"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 text-[#3D2E28] focus:outline-hidden focus:ring-2 focus:ring-[#004D5A] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
                DESCRIPTION
              </label>
              <div className="border border-[#E9E3DE] rounded-xl overflow-hidden">
                <div className="bg-[#FAF6F4] border-b border-[#E9E3DE] p-2 flex items-center gap-3 text-xs font-bold text-[#6E5B53]">
                  <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded">B</button>
                  <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded italic">I</button>
                  <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded">≡</button>
                  <button type="button" className="px-2 py-1 hover:bg-[#FAF5F2] rounded">🔗</button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe your product's unique features, ingredients, and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm p-3 text-[#3D2E28] outline-hidden bg-white"
                />
              </div>
            </div>
          </div>

          {/* Skincare Quiz & Attributes Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E8E3] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#583F37]">Skincare Quiz Attributes</h2>
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
                      onClick={() => toggleSkinType(type)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${isSelected
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
                      onClick={() => toggleConcern(concern)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${isSelected
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

            {/* Routine Step Type */}
            <div>
              <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
                ROUTINE STEP TYPE
              </label>
              <div className="relative">
                <select
                  value={routineStep}
                  onChange={(e) => setRoutineStep(e.target.value)}
                  className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 text-[#3D2E28] bg-white appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#004D5A] pr-10"
                >
                  {stepTypeOptions.map((step) => (
                    <option key={step} value={step}>
                      {step}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* SEPARATE CARD 1: Product Active Status Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#583F37]">Product Status</h2>
              <p className="text-xs text-[#7A6860] mt-0.5">Control whether this product is active and visible on your storefront.</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${isActive ? "bg-[#50E3C2]/20 text-[#044E35] border border-[#50E3C2]/40" : "bg-stone-100 text-stone-600 border border-stone-200"
                }`}>
                {isActive ? "Active" : "Draft / Hidden"}
              </span>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isActive ? "bg-[#004D5A]" : "bg-stone-300"
                  }`}
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${isActive ? "right-0.5" : "left-0.5"
                    }`}
                />
              </button>
            </div>
          </div>

          {/* SEPARATE CARD 2: On Sale & Discount Percentage Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8E3] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#583F37]">Promotional Sale</h2>
                <p className="text-xs text-[#7A6860] mt-0.5">Enable discount percentage sale pricing for this product.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOnSale(!isOnSale)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isOnSale ? "bg-[#004D5A]" : "bg-stone-300"
                  }`}
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${isOnSale ? "right-0.5" : "left-0.5"
                    }`}
                />
              </button>
            </div>

            {isOnSale && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6E4B42] uppercase mb-1">
                      REGULAR PRICE ($)
                    </label>
                    <input
                      type="text"
                      value={regularPrice}
                      onChange={(e) => setRegularPrice(e.target.value)}
                      className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#044E35] uppercase mb-1">
                      DISCOUNT PERCENTAGE (%)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="20"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        className="w-full text-sm border border-[#50E3C2] rounded-xl p-3 bg-white text-[#044E35] font-bold pr-8"
                      />
                      <span className="absolute right-3 text-sm font-bold text-[#044E35]">%</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-[#FAF5F2] border border-[#E9E3DE] rounded-xl p-4 flex items-center justify-between text-sm">
                  <span className="text-[#583F37] font-medium">Calculated Final Sale Price:</span>
                  <span className="text-[#044E35] font-extrabold text-lg">
                    ${calculateCalculatedSalePrice()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Variants (Sizes & Stock) Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#583F37]">Product Variants (Sizes & Stock)</h2>
                <p className="text-xs text-[#7A6860] mt-0.5">Configure different sizes, prices, and stock counts.</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="px-3.5 py-2 bg-[#FAF5F2] hover:bg-[#F3ECE6] text-[#583F37] font-semibold text-xs rounded-xl border border-[#E9E3DE] transition-colors cursor-pointer flex items-center gap-1"
              >
                + Add Variant Size
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.id} className="p-3.5 rounded-xl border border-[#E9E3DE] bg-[#FAF6F4]/50 grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">SIZE / VARIANT</label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleUpdateVariant(v.id, "size", e.target.value)}
                      placeholder="e.g. 50ml"
                      className="w-full text-xs font-medium border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28]"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleUpdateVariant(v.id, "sku", e.target.value)}
                      placeholder="SKU"
                      className="w-full text-xs border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28] font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">PRICE ($)</label>
                    <input
                      type="text"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(v.id, "price", e.target.value)}
                      placeholder="Price"
                      className="w-full text-xs border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28] font-semibold"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-[#7A6860] uppercase mb-0.5">STOCK</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(v.id, "stock", parseInt(e.target.value, 10) || 0)}
                      placeholder="Stock"
                      className="w-full text-xs border border-[#E9E3DE] rounded-lg p-2 bg-white text-[#3D2E28] font-semibold"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                      title="Remove Variant"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-6">
          {/* Inventory Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#583F37]">Inventory</h2>

            <div>
              <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
                SKU (STOCK KEEPING UNIT)
              </label>
              <input
                type="text"
                value={mainSku}
                onChange={(e) => setMainSku(e.target.value)}
                className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 text-[#3D2E28] bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
                TOTAL AVAILABLE QUANTITY
              </label>
              <input
                type="number"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
                className="w-full text-sm font-bold border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28]"
              />
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#583F37]">Organization</h2>

            <div>
              <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
                CATEGORY
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 text-[#3D2E28] bg-white appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#004D5A] pr-10"
                >
                  <option value="Skincare">Skincare</option>
                  <option value="Cleanser">Cleanser</option>
                  <option value="Serum">Serum</option>
                  <option value="Moisturizer">Moisturizer</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;
