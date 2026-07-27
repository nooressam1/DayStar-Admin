"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Button, MediaUpload } from "@/modules/shared";
import { Category } from "@/types";

export function AddCategoryPage() {
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategoryPayload: Category = {
      id: `cat-${Date.now()}`,
      name: categoryName,
      photo: thumbnailUrl || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80",
      slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
      created_at: new Date().toISOString(),
      parent_id: null,
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
        <MediaUpload
          layout="compact"
          label="Category Thumbnail"
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          helperText="JPG, PNG or WEBP. Max 2MB."
        />

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
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isVisible ? "bg-[#004D5A]" : "bg-gray-300"
              }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${isVisible ? "right-0.5" : "left-0.5"
                }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategoryPage;
