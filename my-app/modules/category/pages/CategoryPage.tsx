"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Pagination, Button, Modal } from "@/modules/shared";
import { Category } from "@/types";

export interface CategoryRecord extends Partial<Category> {
  id: string;
  name: string;
  thumbnail?: string;
  itemCount?: number;
  parentCategory?: string;
  isVisible?: boolean;
}

const initialCategories: CategoryRecord[] = [
  {
    id: "cat-1",
    name: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80",
    parentCategory: "None (Top Level)",
    description: "Computers, peripherals, gaming accessories, and gadgets.",
    itemCount: 542,
    isVisible: true,
  },
  {
    id: "cat-2",
    name: "Keyboards & Mice",
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80",
    parentCategory: "Electronics",
    description: "Mechanical keyboards, keycaps, switches, and precision mice.",
    itemCount: 128,
    isVisible: true,
  },
  {
    id: "cat-3",
    name: "Clothing & Apparel",
    thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80",
    parentCategory: "None (Top Level)",
    description: "Men's and women's fashion, t-shirts, hoodies, and jackets.",
    itemCount: 310,
    isVisible: true,
  },
  {
    id: "cat-4",
    name: "Home & Office",
    thumbnail: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=150&auto=format&fit=crop&q=80",
    parentCategory: "None (Top Level)",
    description: "Ergonomic chairs, desks, lighting, and workspace decor.",
    itemCount: 84,
    isVisible: false,
  },
  {
    id: "cat-5",
    name: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
    parentCategory: "None (Top Level)",
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
  const [parentCategory, setParentCategory] = useState("None (Top Level)");
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
      (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.parentCategory || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCategoryName("");
    setParentCategory("None (Top Level)");
    setDescription("");
    setIsVisible(true);
    setThumbnailUrl("");
    setShowModal(true);
  };

  const handleOpenEdit = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setParentCategory(cat.parentCategory || "None (Top Level)");
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

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: categoryName,
                parentCategory,
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
        parentCategory,
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

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Categories"
        subtitle="Define product collections, manage taxonomies, and control storefront visibility."
      />

      {/* Action Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="bg-white rounded-xl border border-[#E9E3DE] px-4 py-2 flex items-center gap-3 shadow-xs max-w-md w-full">
          <svg className="w-5 h-5 text-[#8A756C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-sm bg-transparent outline-hidden text-[#3D2E28] placeholder-[#8A756C]"
          />
        </div>

        {/* Create Category Button */}
        <Button
          onClick={() => router.push("/category/new")}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
        >
          Create Category
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F4] border-b border-[#E9E3DE]">
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  CATEGORY
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  PARENT CATEGORY
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  PRODUCTS
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  VISIBILITY
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E3]">
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#FAF6F4]/50 transition-colors">
                    {/* Thumbnail + Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={category.thumbnail}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded-xl border border-[#E9E3DE] bg-[#FAF5F2] shrink-0"
                        />
                        <span className="text-sm font-semibold text-[#583F37]">{category.name}</span>
                      </div>
                    </td>

                    {/* Parent Category */}
                    <td className="px-6 py-4 text-sm text-[#6E5B53] whitespace-nowrap">
                      {category.parentCategory}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-[#8A756C] max-w-xs truncate">
                      {category.description || "—"}
                    </td>

                    {/* Product count */}
                    <td className="px-6 py-4 text-sm font-semibold text-[#3D2E28] whitespace-nowrap">
                      {category.itemCount} items
                    </td>

                    {/* Visibility */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          category.isVisible
                            ? "bg-[#50E3C2]/20 text-[#044E35] border border-[#50E3C2]/40"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {category.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-1.5 rounded-lg text-[#583F37] hover:bg-[#FAF5F2] border border-transparent hover:border-[#E9E3DE] transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => setDeletingId(category.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#8A756C]">
                    No categories found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCategories.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemLabel="categories"
        />
      </div>

      {/* Modal: Create / Edit Category (Matches Requested Screenshot Layout Exactly) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-2xl border border-[#E9E3DE] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-[#FAF6F4] px-6 py-5 border-b border-[#E9E3DE] flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#583F37]">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h3>
                <p className="text-xs text-[#7A6860] mt-0.5">
                  Define a new collection for your store products.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Category Thumbnail Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF6F4]/40 hover:bg-[#FAF6F4] rounded-2xl p-4 transition-colors cursor-pointer flex items-center gap-4"
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
                    className="w-16 h-16 object-cover rounded-xl border border-[#E9E3DE] shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#FDF6F3] border border-[#E9E3DE] flex items-center justify-center shrink-0 text-[#8A756C]">
                    <svg className="w-7 h-7 text-[#7A6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <h4 className="text-sm font-bold text-[#583F37]">Category Thumbnail</h4>
                  <p className="text-xs text-[#8A756C] mt-0.5">JPG, PNG or WEBP. Max 2MB.</p>
                  <p className="text-xs font-semibold text-[#004D5A] hover:underline mt-1">
                    Click to upload
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

            {/* Modal Footer */}
            <div className="bg-[#FAF6F4] px-6 py-4 border-t border-[#E9E3DE] flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-sm font-medium text-[#583F37] hover:text-[#3D2E28] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#004D5A] hover:bg-[#003B46] text-white font-medium text-sm rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

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
