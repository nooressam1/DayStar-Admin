"use client";

import React from "react";
import { Table, Pagination } from "@/modules/shared";
import { CategoryRecord } from "../pages/CategoryPage";
import { getCategoryColumns } from "../utils/categoryColumns";

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
  const categoryColumns = getCategoryColumns({ onEdit, onDelete });

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
