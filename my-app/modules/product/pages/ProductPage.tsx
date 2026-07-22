"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageHeader,
  ProductFilterBar,
  ViewMode,
  ProductCard,
  ProductItem,
} from "@/modules/shared";

const sampleProducts: ProductItem[] = [
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
    name: "Wireless ANC Headphones",
    category: "ELECTRONICS",
    sku: "AUD-441-A",
    price: "$249.99",
    stockCount: 8,
    badge: { type: "low_stock", label: "LOW STOCK" },
  },
  {
    id: "prod-3",
    name: "Leather Minimalist Watch",
    category: "ACCESSORIES",
    sku: "WCH-882-C",
    price: "$120.00",
    stockCount: 0,
    badge: { type: "out_of_stock", label: "OUT OF STOCK" },
  },
  {
    id: "prod-4",
    name: "Ergonomic Desk Chair",
    category: "CLOTHING",
    sku: "CHR-109-D",
    price: "$310.00",
    stockCount: 15,
    badge: { type: "new_arrival", label: "NEW ARRIVAL" },
  },
];

export function ProductPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [category, setCategory] = useState("All Categories");
  const [badgeFilter, setBadgeFilter] = useState("All Badges");
  const [priceRangeFilter, setPriceRangeFilter] = useState("All Prices");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTurnOnSelect = () => {
    setIsSelectMode(true);
  };

  const handleTurnOffSelect = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  const handleEditSelected = () => {
    router.push("/product/edit");
  };

  const handleExportProducts = () => {
    // Generate CSV file content of sample products
    const headers = "ID,Name,Category,SKU,Price,Stock\n";
    const rows = sampleProducts
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.category}","${p.sku}","${p.price}",${p.stockCount}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  const filteredProducts = sampleProducts.filter((p) => {
    if (category !== "All Categories" && p.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (badgeFilter !== "All Badges" && p.badge?.type !== badgeFilter) {
      return false;
    }
    const priceNum = parsePrice(p.price);
    if (priceRangeFilter === "under_150" && priceNum >= 150) {
      return false;
    }
    if (priceRangeFilter === "150_250" && (priceNum < 150 || priceNum > 250)) {
      return false;
    }
    if (priceRangeFilter === "over_250" && priceNum <= 250) {
      return false;
    }
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Product Catalog"
        subtitle="Manage products, categories, and catalog listings."
      />

      {/* Product Filter & Action Bar Component */}
      <ProductFilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        category={category}
        onCategoryChange={setCategory}
        badge={badgeFilter}
        onBadgeChange={setBadgeFilter}
        priceRange={priceRangeFilter}
        onPriceRangeChange={setPriceRangeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSelecting={isSelectMode}
        onSelectProduct={handleTurnOnSelect}
        onDeselectProduct={handleTurnOffSelect}
        onEditProducts={handleEditSelected}
        onExportProduct={handleExportProducts}
        onAddProduct={() => router.push("/product/new")}
      />

      {/* Select Mode Active Status Banner */}
      {isSelectMode && (
        <div className="bg-[#004956]/10 border border-[#004956]/30 px-4 py-3 rounded-xl flex items-center justify-between text-sm text-[#004956] font-medium">
          <span>
            Selection Mode Active — <strong>{selectedIds.length}</strong> items selected.
          </span>
          <button
            onClick={handleTurnOffSelect}
            className="text-xs underline font-semibold hover:text-[#003842] cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Product Catalog Display */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectable={isSelectMode}
              isSelected={selectedIds.includes(product.id)}
              onSelectToggle={handleSelectToggle}
              onQuickEdit={() => router.push("/product/edit")}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-[#E9E3DE] text-center text-[#8A756C] shadow-xs">
          No products match your selected badge or price criteria.
        </div>
      )}
    </div>
  );
}

export default ProductPage;
