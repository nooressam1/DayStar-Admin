"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Button } from "@/modules/shared";
import { Category } from "@/types";

export function AddCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("None (Top Level)");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategoryPayload: Category = {
      id: `cat-${Date.now()}`,
      name: categoryName,
      photo: thumbnailUrl || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80",
      slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
      created_at: new Date().toISOString(),
      parent_id: parentCategory === "None (Top Level)" ? null : parentCategory,
      description,
      is_visible: isVisible,
    };
    console.log("Submitting Category DB Payload:", newCategoryPayload);
    router.push("/category");
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Create Category"
        subtitle="Define a new collection for your store products and set storefront visibility."
        backLink={{
          href: "/category",
          label: "Back to Categories",
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => router.push("/category")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
            >
              Create Category
            </Button>
          </>
        }
      />

      {/* Main Card Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9E3DE] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
        {/* Category Thumbnail Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF6F4]/40 hover:bg-[#FAF6F4] rounded-2xl p-6 transition-colors cursor-pointer flex items-center gap-5"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-[#E9E3DE] shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-[#FDF6F3] border border-[#E9E3DE] flex items-center justify-center shrink-0 text-[#8A756C]">
              <svg className="w-8 h-8 text-[#7A6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-[#583F37]">Category Thumbnail</h3>
            <p className="text-xs text-[#8A756C] mt-0.5">JPG, PNG or WEBP. Max 2MB.</p>
            <p className="text-xs font-semibold text-[#004D5A] hover:underline mt-1.5">
              Click to upload image
            </p>
          </div>
        </div>

        {/* Category Name */}
        <div>
          <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
            Category Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Summer Collection"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 focus:ring-[#004D5A]"
          />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
            Parent Category
          </label>
          <div className="relative">
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#004D5A] pr-10"
            >
              <option value="None (Top Level)">None (Top Level)</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing & Apparel">Clothing & Apparel</option>
              <option value="Home & Office">Home & Office</option>
              <option value="Accessories">Accessories</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Brief description of products in this category..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 focus:ring-[#004D5A]"
          />
        </div>

        {/* Visible on Online Store Toggle Box */}
        <div className="bg-[#FAF6F4] rounded-2xl p-5 flex items-center justify-between border border-[#E9E3DE]">
          <div>
            <h3 className="text-sm font-bold text-[#583F37]">Visible on Online Store</h3>
            <p className="text-xs text-[#8A756C] mt-0.5">
              Publish this category immediately to your storefront.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              isVisible ? "bg-[#004D5A]" : "bg-gray-300"
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                isVisible ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategoryPage;
