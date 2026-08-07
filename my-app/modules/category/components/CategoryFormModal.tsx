"use client";

import React, { useState, useEffect } from "react";
import { Modal, TextInput, MediaUpload, Select } from "@/modules/shared";
import { Category } from "@/types";

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
  category?: Category | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [photo, setPhoto] = useState("");
  const [status, setStatus] = useState("Active");

  // Sync form state when modal opens or category changes
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setPhoto(category.photo || "");
      setStatus(category.status || "Active");
    } else {
      setName("");
      setSlug("");
      setPhoto("");
      setStatus("Active");
    }
  }, [category, isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, "-")
      : name.trim().toLowerCase().replace(/\s+/g, "-");

    onSave({
      ...(category?.id ? { id: category.id } : {}),
      name: name.trim(),
      slug: generatedSlug,
      photo: photo || null,
      status,
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
        <MediaUpload
          layout="compact"
          label="Category Photo"
          value={photo}
          onChange={setPhoto}
          helperText="JPG, PNG or WEBP image URL."
        />

        {/* Category Name */}
        <TextInput
          label="Category Name"
          required
          placeholder="e.g. Cleansers"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Category Slug */}
        <TextInput
          label="Category Slug"
          placeholder="e.g. cleansers"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          helperText="Used in storefront URLs (auto-generated if left empty)."
        />

        {/* Category Status */}
        <Select
          label="Category Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
