"use client";

import React from "react";
import Link from "next/link";
import {
  ProductCard,
  ProductCardSkeleton,
  ProductItem,
} from "@/modules/shared";
import {
  BulkEditForm,
  BulkEditFormData,
} from "../components";
import { useSearchParams, useRouter } from "next/navigation";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { useBulkUpdateProducts } from "@/app/api/hooks/useProducts";
import { productApi } from "@/app/api/endpoints/products";

export interface BulkEditProductsPageProps {
  selectedProducts?: ProductItem[];
  onBackToProducts?: () => void;
}

export function BulkEditProductsPage({
  onBackToProducts,
}: BulkEditProductsPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawIds = searchParams.get("ids") || "";
  const selectedIds = React.useMemo(
    () => (rawIds ? rawIds.split(",") : []),
    [rawIds]
  );

  const { productsList, isLoading } = useFilteredProducts({ includeInactive: true });
  const bulkUpdateMutation = useBulkUpdateProducts();

  const displayProducts = React.useMemo(() => {
    return productsList.filter((p) => selectedIds.includes(p.id));
  }, [productsList, selectedIds]);

  const handleSave = (data: BulkEditFormData) => {
    if (selectedIds.length === 0) {
      alert("No products selected for bulk editing.");
      return;
    }

    const payload: Parameters<typeof productApi.bulkUpdateProducts>[0] = {
      ids: selectedIds,
    };

    if (data.enabledSections.saleDetails) {
      payload.on_sale = data.saleStatus === "Active";
      if (data.saleStatus === "Active" && data.saleDiscountPercentage) {
        const cleanDisc = data.saleDiscountPercentage.replace("%", "").trim();
        payload.discount_percentage = parseFloat(cleanDisc) || null;
      } else {
        payload.discount_percentage = null;
      }
    }

    if (data.enabledSections.productStatus) {
      payload.is_active = data.productStatus === "Active";
    }

    if (data.enabledSections.skinQuiz) {
      payload.skin_type = [data.skinType];
      payload.concern = [data.productConcerns];
      payload.step_type = data.productStepType;
    }

    if (data.enabledSections.generalDetails) {
      payload.category_id = data.category;
    }

    bulkUpdateMutation.mutate(payload, {
      onSuccess: () => {
        if (onBackToProducts) {
          onBackToProducts();
        } else {
          router.push("/product");
        }
      },
      onError: (err: any) => {
        alert(`Failed to execute bulk update: ${err?.message || "Unknown error"}`);
      },
    });
  };

  const handleCancel = () => {
    if (onBackToProducts) {
      onBackToProducts();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION 1: Top Header & Selected Products List */}
      <div className="flex flex-col gap-6">
        {/* Back Link & Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/product"
              onClick={(e) => {
                if (onBackToProducts) {
                  e.preventDefault();
                  onBackToProducts();
                }
              }}
              className="text-xs font-semibold text-[#004956] hover:underline inline-flex items-center gap-1"
            >
              &larr; Back to Products
            </Link>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#6E4B42]">Edit Products</h1>
          <p className="text-sm text-[#8A756C]">
            Changes you make apply to {selectedIds.length} selected product{selectedIds.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Selected Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="ring-2 ring-[#004956] rounded-2xl">
                <ProductCard
                  product={product}
                  selectable={false}
                  isSelected={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[#E9E3DE] w-full" />

      {/* SECTION 2: Reusable Bulk Edit Form Component */}
      <BulkEditForm
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={bulkUpdateMutation.isPending}
      />
    </div>
  );
}

export default BulkEditProductsPage;
