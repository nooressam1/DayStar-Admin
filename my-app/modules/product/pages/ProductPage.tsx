"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageHeader,
  Filter,
  ViewMode,
  ProductCard,
  ProductItem,
  Pagination,
} from "@/modules/shared";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { useSelectMode } from "../hooks/useSelectMode";
import { exportProductsToCSV } from "../utils/csv";

export function ProductPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    filteredProducts,
    productsList,
    productConfig,
    isLoading,
    isError,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setPage,
  } = useFilteredProducts();

  const {
    isSelectMode,
    selectedCount,
    turnOnSelect,
    turnOffSelect,
    handleSelectToggle,
    isSelected,
    selectedIds

  } = useSelectMode();

  const handleEditSelected = () => {
    if (selectedIds.length === 0) return;
    router.push(`/product/edit?ids=${selectedIds.join(",")}`);
  };

  const handleExportProducts = () => {
    exportProductsToCSV(productsList);
  };


  return (
    <div className="flex flex-col gap-6">


      <PageHeader
        title="Product Catalog"
        subtitle="Manage products, categories, and catalog listings."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {isSelectMode ? (
              <>
                <button
                  onClick={turnOffSelect}
                  className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Deselect Products
                </button>
                <button
                  onClick={handleEditSelected}
                  className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span>Edit Products</span>
                </button>
              </>
            ) : (
              <button
                onClick={turnOnSelect}
                className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Select Product
              </button>
            )}

            <button
              onClick={handleExportProducts}
              className="border border-[#E9E3DE] bg-white text-[#4A3831] hover:bg-[#FAF5F2] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <svg className="w-4 h-4 text-[#7A675E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Product</span>
            </button>

            <button
              onClick={() => router.push("/product/new")}
              className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <span className="text-base font-normal leading-none">+</span>
              <span>Add Product</span>
            </button>
          </div>
        }
      />

      {/* Filter component driven by single config array */}
      <Filter config={productConfig} />

      {/* Select Mode Active Status Banner */}
      {isSelectMode && (
        <div className="bg-[#004956]/10 border border-[#004956]/30 px-4 py-3 rounded-xl flex items-center justify-between text-sm text-[#004956] font-medium">
          <span>
            Selection Mode Active — <strong>{selectedCount}</strong> items selected.
          </span>
          <button
            onClick={turnOffSelect}
            className="text-xs underline font-semibold hover:text-[#003842] cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}
      {isLoading && (
        <div className="py-12 text-center text-gray-500 font-medium">
          Loading products from server...
        </div>
      )}
      {isError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl">
          Could not load products from the backend. Displaying offline products.
        </div>
      )}
      {/* Product Catalog Display */}
      {!isLoading ? (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product: ProductItem) => (
              <ProductCard
                key={product.id}
                product={product}
                selectable={isSelectMode}
                isSelected={isSelected(product.id)}
                onSelectToggle={handleSelectToggle}
                onQuickEdit={() => router.push(`/product/new?id=${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-[#E9E3DE] text-center text-[#8A756C] shadow-xs">
            No products match your selected badge or price criteria.
          </div>
        )
      ) : null}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          itemLabel="products"
        />
      )}
    </div>
  );
}

export default ProductPage;
