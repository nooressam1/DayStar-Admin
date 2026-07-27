"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Pagination, Button, Modal, StatCard, TextInput, Filter, FilterConfig, MediaUpload } from "@/modules/shared";
import { CategoryTable } from "../components/CategoryTable";
import { Category } from "@/types";

export interface CategoryRecord extends Partial<Category> {
  id: string;
  name: string;
  thumbnail?: string;
  itemCount?: number;
  isVisible?: boolean;
}

const initialCategories: CategoryRecord[] = [
  {
    id: "cat-1",
    name: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80",
    description: "Computers, peripherals, gaming accessories, and gadgets.",
    itemCount: 542,
    isVisible: true,
  },
  {
    id: "cat-2",
    name: "Keyboards & Mice",
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80",
    description: "Mechanical keyboards, keycaps, switches, and precision mice.",
    itemCount: 128,
    isVisible: true,
  },
  {
    id: "cat-3",
    name: "Clothing & Apparel",
    thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80",
    description: "Men's and women's fashion, t-shirts, hoodies, and jackets.",
    itemCount: 310,
    isVisible: true,
  },
  {
    id: "cat-4",
    name: "Home & Office",
    thumbnail: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=150&auto=format&fit=crop&q=80",
    description: "Ergonomic chairs, desks, lighting, and workspace decor.",
    itemCount: 84,
    isVisible: false,
  },
  {
    id: "cat-5",
    name: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
    description: "Cables, adapters, desk pads, and carrying sleeves.",
    itemCount: 215,
    isVisible: true,
  },
];

export function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCategoryName("");
    setDescription("");
    setIsVisible(true);
    setThumbnailUrl("");
    setShowModal(true);
  };

  const handleOpenEdit = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setDescription(cat.description || "");
    setIsVisible(cat.isVisible ?? true);
    setThumbnailUrl(cat.thumbnail || cat.photo || "");
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    }
  };

  const handleSaveCategory = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: categoryName,
                description,
                isVisible,
                thumbnail: thumbnailUrl || c.thumbnail,
              }
            : c
        )
      );
    } else {
      const newCat: CategoryRecord = {
        id: `cat-${Date.now()}`,
        name: categoryName,
        description,
        itemCount: 0,
        isVisible,
        thumbnail:
          thumbnailUrl ||
          "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80",
      };
      setCategories([newCat, ...categories]);
    }

    setShowModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  const categoryConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      value: searchQuery,
      onChange: (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
      },
      placeholder: "Search categories...",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Categories"
        subtitle="Define product collections, manage taxonomies, and control storefront visibility."
      />

      {/* Category Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Categories" value="24" />
        <StatCard title="Categorized Products" value="1,402" />
        <StatCard title="Active Displays" value="18" />
        <StatCard title="Empty Categories" value="3" />
      </div>

      {/* Universal Reusable Filter Component */}
      <Filter
        config={categoryConfig}
        actions={
          <button
            onClick={() => router.push("/category/new")}
            className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <span className="text-base font-normal leading-none">+</span>
            <span>Create Category</span>
          </button>
        }
      />

      {/* Category Table Component */}
      <CategoryTable
        categories={paginatedCategories}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredCategories.length}
        onPageChange={setCurrentPage}
        onEdit={handleOpenEdit}
        onDelete={setDeletingId}
      />

      {/* Modal: Create / Edit Category */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSaveCategory}
        title={editingCategory ? "Edit Category" : "Create Category"}
        subtitle="Define a new collection for your store products."
        confirmText={editingCategory ? "Update Category" : "Create Category"}
        confirmVariant="primary"
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Category Thumbnail Upload Box */}
          <MediaUpload
            layout="compact"
            label="Category Thumbnail"
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            helperText="JPG, PNG or WEBP. Max 2MB."
          />

          {/* Category Name */}
          <TextInput
            label="Category Name"
            required
            placeholder="e.g. Summer Collection"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of products in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 focus:ring-[#004D5A]"
            />
          </div>

          {/* Visible on Online Store Box with Toggle */}
          <div className="bg-[#FAF6F4] rounded-2xl p-4 flex items-center justify-between border border-[#E9E3DE]">
            <div>
              <h4 className="text-sm font-bold text-[#583F37]">Visible on Online Store</h4>
              <p className="text-xs text-[#8A756C] mt-0.5">
                Publish this category immediately to your storefront.
              </p>
            </div>

            {/* Toggle Switch */}
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
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDeleteCategory(deletingId)}
        title="Delete Category?"
        confirmText="Delete"
        confirmVariant="danger"
        maxWidth="sm"
      >
        <p className="text-sm text-[#6E5B53]">
          Are you sure you want to delete this category? Products in this category will become uncategorized.
        </p>
      </Modal>
    </div>
  );
}

export default CategoryPage;
