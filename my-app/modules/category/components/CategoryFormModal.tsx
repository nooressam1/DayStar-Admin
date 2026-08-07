"use client";

import React, { useState, useEffect } from "react";
import { Modal, TextInput, MediaUpload, Select } from "@/modules/shared";
import { Category } from "@/types";
import { useCategoryForm, CategoryFormErrors } from "../hooks/useCategoryForm";

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
  category?: Category | null;
  existingCategories?: Category[];
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
  existingCategories = [],
}: CategoryFormModalProps) {
  const { state, setField, setFormState, validateForm } = useCategoryForm();
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  // Sync form state when modal opens or category changes
  useEffect(() => {
    if (category) {
      setFormState({
        name: category.name || "",
        slug: category.slug || "",
        photo: category.photo || "",
        status: category.status || "Active",
      });
    } else {
      setFormState({
        name: "",
        slug: "",
        photo: "",
        status: "Active",
      });
    }
    setErrors({});
  }, [category, isOpen, setFormState]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const { isValid, errors: validationErrors } = validateForm(existingCategories, category?.id);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const generatedSlug = state.slug.trim()
      ? state.slug.trim().toLowerCase().replace(/\s+/g, "-")
      : state.name.trim().toLowerCase().replace(/\s+/g, "-");

    onSave({
      ...(category?.id ? { id: category.id } : {}),
      name: state.name.trim(),
      slug: generatedSlug,
      photo: state.photo || null,
      status: state.status,
    });

    onClose();
  };

  const isEditing = Boolean(category?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title={isEditing ? "Edit Category" : "Create Category"}
      subtitle="Define a collection for your store products."
      confirmText={isEditing ? "Update Category" : "Create Category"}
      confirmVariant="primary"
      maxWidth="lg"
    >
      <div className="space-y-6">
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
        />
      </div>
    </Modal>
  );
}

export default CategoryFormModal;

