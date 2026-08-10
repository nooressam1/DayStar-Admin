"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Button, MediaUpload, TextInput, Select } from "@/modules/shared";
import { Category } from "@/types";
import { useCategoryForm, CategoryFormErrors } from "../hooks/useCategoryForm";
import { useGetCategories, useCreateCategory } from "@/app/api/hooks/useCategories";

export function AddCategoryPage() {
  const router = useRouter();
  const { data: categoriesResponse } = useGetCategories();
  const fetchedCategories = categoriesResponse?.items || [];
  const createCategoryMutation = useCreateCategory();
  const { state, setField, validateForm } = useCategoryForm();
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 handleSubmit triggered!");

    const { isValid, errors: validationErrors } = validateForm(fetchedCategories);
    console.log("Validation result:", { isValid, validationErrors, state });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const generatedSlug = state.slug.trim()
      ? state.slug.trim().toLowerCase().replace(/\s+/g, "-")
      : state.name.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      console.log("Sending payload to backend mutation...", {
        name: state.name.trim(),
        slug: generatedSlug,
        photo: state.photo || null,
        status: state.status || "Active",
      });
      const res = await createCategoryMutation.mutateAsync({
        name: state.name.trim(),
        slug: generatedSlug,
        photo: state.photo || null,
        status: state.status || "Active",
      });
      console.log("Category created successfully:", res);
      router.push("/category");
    } catch (err) {
      console.error("Failed to create category:", err);
    }
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
              type="submit"
              form="create-category-form"
              disabled={createCategoryMutation.isPending}
              onClick={(e) => handleSubmit(e)}
            >
              {createCategoryMutation.isPending ? "Creating Category..." : "Create Category"}
            </Button>
          </>
        }
      />

      {/* Main Card Form */}
      <form
        id="create-category-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#E9E3DE] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6"
      >
        {/* Error Alert from API Mutation */}
        {createCategoryMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {(createCategoryMutation.error as any)?.message || "Failed to create category on backend. Please check required fields."}
          </div>
        )}
        {/* Category Photo Upload Box */}
        <div>
          <MediaUpload
            layout="compact"
            label="Category Photo"
            value={state.photo}
            onChange={(val) => {
              setField("photo", val);
              if (errors.photo) setErrors((prev) => ({ ...prev, photo: undefined }));
            }}
            helperText="JPG, PNG or WEBP image URL."
          />
          {errors.photo && (
            <p className="text-xs text-red-600 font-semibold mt-1">{errors.photo}</p>
          )}
        </div>

        {/* Category Name */}
        <div>
          <TextInput
            label="Category Name"
            required
            placeholder="e.g. Cleansers"
            value={state.name}
            onChange={(e) => {
              setField("name", e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && (
            <p className="text-xs text-red-600 font-semibold mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category Slug */}
        <div>
          <TextInput
            label="Category Slug"
            placeholder="e.g. cleansers"
            value={state.slug}
            onChange={(e) => {
              setField("slug", e.target.value);
              if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
            }}
            helperText="Used in storefront URLs (auto-generated if left empty)."
          />
          {errors.slug && (
            <p className="text-xs text-red-600 font-semibold mt-1">{errors.slug}</p>
          )}
        </div>
        {/* Category Status */}
        <Select
          label="Category Status"
          value={state.status}
          onChange={(e) => setField("status", e.target.value)}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
          helperText="Active categories are published to your storefront collections."
        />

        {/* Submit Actions inside Form */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E9E3DE]">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/category")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending ? "Creating Category..." : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddCategoryPage;


