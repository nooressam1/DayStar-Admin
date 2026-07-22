"use client";

import React, { useState, useRef } from "react";

export interface ProductVariant {
  id: string;
  size: string;
  sku: string;
  price: string;
  stock: number;
}

export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct?: (productData: any) => void;
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

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Media state
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608248597263-00de4680826d?w=200&auto=format&fit=crop&q=80",
  ]);

  // General Info state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  // Skincare Quiz Fields
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(["Combination", "Sensitive"]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(["Acne & Blemishes", "Dryness & Dehydration"]);
  const [routineStep, setRoutineStep] = useState("Serum / Treatment");

  // Sale & Active status
  const [isOnSale, setIsOnSale] = useState(false);
  const [regularPrice, setRegularPrice] = useState("35.00");
  const [salePrice, setSalePrice] = useState("28.00");
  const [isActive, setIsActive] = useState(true);

  // Variants state (Sizes & Stock)
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "var-1", size: "30ml / 1 fl oz", sku: "SKU-SERUM-30", price: "28.00", stock: 50 },
    { id: "var-2", size: "50ml / 1.7 fl oz", sku: "SKU-SERUM-50", price: "42.00", stock: 35 },
  ]);

  // Sidebar Inventory & Organization
  const [mainSku, setMainSku] = useState("SKU-12345");
  const [barcode, setBarcode] = useState("1234567890");
  const [trackQuantity, setTrackQuantity] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState("85");
  const [category, setCategory] = useState("Skincare");
  const [vendor, setVendor] = useState("DayStar Beauty");
  const [tags, setTags] = useState("Serum, Hydrating, Hyaluronic");

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      productName,
      description,
      skinTypes: selectedSkinTypes,
      concerns: selectedConcerns,
      routineStep,
      isOnSale,
      regularPrice,
      salePrice,
      isActive,
      variants,
      mainSku,
      barcode,
      trackQuantity,
      totalQuantity,
      category,
      vendor,
      tags,
      images,
    };
    onAddProduct?.(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Add New Product</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details to list a new item in your inventory.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (2 Cols Wide) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Media Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800">Product Media</h3>

                {/* Upload Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-2xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shadow-xs mb-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-indigo-950">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    SVG, PNG, JPG or GIF (max. 800×400px)
                  </p>
                </div>

                {/* Media Thumbnails Strip */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer text-xl font-bold transition-colors"
                  >
                    +
                  </button>
                  {images.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden relative group">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Information Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800">General Information</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist Ceramic Collection or Hydrating Serum"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    DESCRIPTION
                  </label>
                  {/* Rich Text Toolbar Mock */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-3 text-xs font-bold text-slate-600">
                      <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded">B</button>
                      <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded italic">I</button>
                      <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded">≡</button>
                      <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded">🔗</button>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Describe your product's unique features, ingredients, and benefits..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-sm p-3 text-slate-900 outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Skincare Quiz & Attributes Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Skincare Quiz Attributes</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Used for customer skincare matching quiz filters.</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                    Quiz Data
                  </span>
                </div>

                {/* Skin Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-emerald-700 text-white border-emerald-700"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    ROUTINE STEP TYPE
                  </label>
                  <select
                    value={routineStep}
                    onChange={(e) => setRoutineStep(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {stepTypeOptions.map((step) => (
                      <option key={step} value={step}>
                        {step}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sale & Active Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Is On Sale Toggle */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Is On Sale?</p>
                      <p className="text-xs text-slate-500">Enable promotional sale pricing</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOnSale(!isOnSale)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isOnSale ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          isOnSale ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Active Status Toggle */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Is Active?</p>
                      <p className="text-xs text-slate-500">Visible to customers on storefront</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isActive ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          isActive ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Pricing Fields if Sale is enabled */}
                {isOnSale && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">REGULAR PRICE ($)</label>
                      <input
                        type="text"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">SALE PRICE ($)</label>
                      <input
                        type="text"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        className="w-full text-sm border border-emerald-400 rounded-xl p-2.5 bg-white text-emerald-900 font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Product Variants (Sizes & Stock) Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Product Variants (Sizes & Stock)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Configure different sizes, prices, and stock counts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    + Add Variant Size
                  </button>
                </div>

                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">SIZE / VARIANT</label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleUpdateVariant(v.id, "size", e.target.value)}
                          placeholder="e.g. 50ml"
                          className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2 bg-white text-slate-900"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">SKU</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariant(v.id, "sku", e.target.value)}
                          placeholder="SKU"
                          className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">PRICE ($)</label>
                        <input
                          type="text"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(v.id, "price", e.target.value)}
                          placeholder="Price"
                          className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-semibold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">STOCK</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(v.id, "stock", parseInt(e.target.value, 10) || 0)}
                          placeholder="Stock"
                          className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-semibold"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
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
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800">Inventory</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    SKU (STOCK KEEPING UNIT)
                  </label>
                  <input
                    type="text"
                    value={mainSku}
                    onChange={(e) => setMainSku(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    BARCODE (ISBN, UPC, GTIN)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234567890"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 bg-white font-mono"
                  />
                </div>

                {/* Track Quantity */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-800">Track Quantity</span>
                  <button
                    type="button"
                    onClick={() => setTrackQuantity(!trackQuantity)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      trackQuantity ? "bg-[#1E3A8A]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        trackQuantity ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Available Quantity */}
                {trackQuantity && (
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                      AVAILABLE QUANTITY
                    </label>
                    <input
                      type="number"
                      value={totalQuantity}
                      onChange={(e) => setTotalQuantity(e.target.value)}
                      className="w-full text-sm font-bold border border-slate-300 rounded-xl p-3 bg-white text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Organization Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800">Organization</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 bg-white"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Cleanser">Cleanser</option>
                    <option value="Serum">Serum</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    VENDOR
                  </label>
                  <select
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 bg-white"
                  >
                    <option value="DayStar Beauty">DayStar Beauty</option>
                    <option value="MerchantHub Official">MerchantHub Official</option>
                    <option value="Glow Labs">Glow Labs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    TAGS
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Discard Changes
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
