"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Button, MediaUpload, TextInput } from "@/modules/shared";
import { Category } from "@/types";

export function AddCategoryPage() {
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const generatedSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, "-")
      : categoryName.trim().toLowerCase().replace(/\s+/g, "-");

    const newCategoryPayload: Category = {
      id: `cat-${Date.now()}`,
      name: categoryName.trim(),
      slug: generatedSlug,
      photo: photoUrl || null,
      created_at: new Date().toISOString(),
    };
    console.log("Submitting Category DB Payload:", newCategoryPayload);
    router.push("/category");
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Create Category"
        subtitle="Define a new category collection for your store products."
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
        {/* Category Photo Upload Box */}
        <MediaUpload
          layout="compact"
          label="Category Photo"
          value={photoUrl}
          onChange={setPhotoUrl}
          helperText="JPG, PNG or WEBP image URL."
        />

        {/* Category Name */}
        <TextInput
          label="Category Name"
          required
          placeholder="e.g. Cleansers"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        {/* Category Slug */}
        <TextInput
          label="Category Slug"
          placeholder="e.g. cleansers"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          helperText="Used in storefront URLs (auto-generated if left empty)."
        />
      </form>
    </div>
  );
}

export default AddCategoryPage;

