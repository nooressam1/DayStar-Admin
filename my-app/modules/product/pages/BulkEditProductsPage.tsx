"use client";

import React from "react";
import Link from "next/link";
import {
  ProductCard,
  ProductItem,
  BulkEditForm,
  BulkEditFormData,
} from "@/modules/shared";

const defaultSelectedProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "Apex Pro Keyboard",
    category: "ELECTRONICS",
    sku: "KEY-092-B",
    price: "$159.00",
    originalPrice: "$179.00",
    stockCount: 42,
    badge: { type: "on_sale", label: "10% SALE" },
  },
  {
    id: "prod-2",
    name: "HydroSteel Bottle",
    category: "HOME & OFFICE",
    sku: "BOT-443-S",
    price: "$34.50",
    stockCount: 3,
    badge: { type: "low_stock", label: "LOW STOCK" },
  },
  {
    id: "prod-3",
    name: "SonicFlow V2",
    category: "ELECTRONICS",
    sku: "AUD-221-W",
    price: "$249.00",
    stockCount: 128,
  },
  {
    id: "prod-4",
    name: "Urban Leather Pack",
    category: "ACCESSORIES",
    sku: "ACC-887-L",
    price: "$185.00",
    stockCount: 15,
  },
];

export interface BulkEditProductsPageProps {
  selectedProducts?: ProductItem[];
  onBackToProducts?: () => void;
}

export function BulkEditProductsPage({
  selectedProducts = defaultSelectedProducts,
  onBackToProducts,
}: BulkEditProductsPageProps) {
  const handleSave = (data: BulkEditFormData) => {
    alert("Bulk updates saved successfully!");
    if (onBackToProducts) {
      onBackToProducts();
    }
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
          <h1 className="text-3xl font-bold font-serif text-[#6E4B42]">Edit Orders</h1>
          <p className="text-sm text-[#8A756C]">
            Changes you make apply to all these products
          </p>
        </div>

        {/* Selected Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedProducts.map((product) => (
            <div key={product.id} className="ring-2 ring-[#004956] rounded-2xl">
              <ProductCard
                product={product}
                selectable={false}
                isSelected={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[#E9E3DE] w-full" />

      {/* SECTION 2: Reusable Bulk Edit Form Component */}
      <BulkEditForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default BulkEditProductsPage;
