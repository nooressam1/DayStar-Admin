"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PageHeader,
  Modal,
  StatCard,
  Filter,
  FilterConfig,
  useUrlFilterState,
  useDebounce,
} from "@/modules/shared";
import { CategoryTable } from "../components/CategoryTable";
import { CategoryFormModal } from "../components/CategoryFormModal";
import { Category } from "@/types";
import { useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/app/api/hooks/useCategories";
import { CATEGORY_STATUS_OPTIONS } from "../constants/categoryFilters";

export type CategoryRecord = Category;

const CATEGORY_FILTERS = [
  { key: "status", defaultValue: "All Statuses" },
  { key: "search", defaultValue: "" },
];

export function CategoryPage() {
  const router = useRouter();

  // ── URL-synced Filter State ──
  const {
    filterValues,
    setFilter,
    currentPage,
    itemsPerPage,
    setPage,
  } = useUrlFilterState({
    filters: CATEGORY_FILTERS,
    itemsPerPage: 10,
  });

  const statusFilter = filterValues.status;

  // ── Debounced Local Search ──
  const [localSearch, setLocalSearch] = useState(filterValues.search);
  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    setLocalSearch(filterValues.search);
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  // ── Fetch & Mutate Categories via React Query Hooks (Server-side Pagination) ──
  const { data: response, isLoading, isError, error, refetch } = useGetCategories({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: statusFilter,
  });
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = useMemo(() => response?.items || [], [response]);
  const totalItems = useMemo(() => response?.total || 0, [response]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / itemsPerPage)), [totalItems, itemsPerPage]);

  const totalCategoriesCount = totalItems;
  const activeCount = useMemo(() => categories.filter((c) => (c.status || "Active") === "Active").length, [categories]);
  const inactiveCount = Math.max(0, totalCategoriesCount - activeCount);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    router.push("/category/new");
  };

  const handleOpenEdit = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      if (!editingCategory) {
        await createCategoryMutation.mutateAsync(categoryData);
      } else {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          payload: categoryData,
        });
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Failed to save category:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const categoryConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "status",
        type: "select",
        value: statusFilter,
        onChange: (val) => setFilter("status", val),
        options: CATEGORY_STATUS_OPTIONS,
      },
      {
        key: "search",
        type: "search",
        value: localSearch,
        onChange: (query) => setLocalSearch(query),
        placeholder: "Search categories by name or slug...",
      },
    ],
    [statusFilter, localSearch, setFilter]
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Categories"
        subtitle="Define product collections, manage taxonomies, and control storefront categories."
      />

      {/* Category Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Categories" value={String(totalCategoriesCount)} />
        <StatCard title="Active Categories" value={String(activeCount)} />
        <StatCard title="Inactive Categories" value={String(inactiveCount)} />
      </div>

      {/* Error Feedback */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold text-sm">
              !
            </div>
            <div>
              <p className="font-semibold text-sm">Could not load categories from backend</p>
              <p className="text-xs text-red-600 mt-0.5">
                {(error as any)?.message || "Network error or request timeout."}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Universal Reusable Filter Component */}
      <Filter
        config={categoryConfig}
        actions={
          <button
            onClick={handleOpenCreate}
            className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <span className="text-base font-normal leading-none">+</span>
            <span>Create Category</span>
          </button>
        }
      />

      {/* Category Table Component */}
      <CategoryTable
        categories={categories}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setPage}
        onEdit={handleOpenEdit}
        onDelete={setDeletingId}
        isLoading={isLoading}
      />

      {/* Modular Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        existingCategories={categories}
      />

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


