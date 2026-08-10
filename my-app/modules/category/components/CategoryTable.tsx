"use client";

import React from "react";
import { Table, ColumnConfig, Pagination, StatusBadge } from "@/modules/shared";
import { CategoryRecord } from "../pages/CategoryPage";
import { formatDate } from "@/utils/format";

export interface CategoryTableProps {
  categories: CategoryRecord[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onEdit: (category: CategoryRecord) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function CategoryTable({
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false,
  className = "",
}: CategoryTableProps) {
  const categoryColumns: ColumnConfig<CategoryRecord>[] = [
    {
      key: "name",
      header: "CATEGORY",
      accessor: (category) => (
        <div className="flex items-center gap-3.5">
          <img
            src={
              category.photo ||

              "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80"
            }
            alt={category.name}
            className="w-10 h-10 object-cover rounded-xl border border-[#E9E3DE] bg-[#FAF5F2] shrink-0"
          />
          <span className="text-sm font-semibold text-[#583F37]">{category.name}</span>
        </div>
      ),
    },
    {
      key: "slug",
      header: "SLUG",
      accessor: (category) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#FAF5F2] border border-[#E9E3DE] text-[#583F37]">
          {category.slug || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      accessor: (category: any) => (
        <StatusBadge status={category.status || "Active"} />
      ),
    },
    {
      key: "created_at",
      header: "CREATED AT",
      accessor: (category) => (
        <span className="text-xs text-[#8A756C]">
          {formatDate(category.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      align: "right",
      accessor: (category) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(category)}
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
            onClick={() => onDelete(category.id)}
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
      ),
    },
  ];

  return (
    <div className={`space-y-0 ${className}`}>
      {/* Declarative Table with Category Column Configuration */}
      <Table
        data={categories}
        columns={categoryColumns}
        isLoading={isLoading}
        keyExtractor={(category) => category.id}
        emptyText="No categories found matching your search."
      />

      {/* Pagination */}
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          itemLabel="categories"
        />
      )}
    </div>
  );
}

export default CategoryTable;
