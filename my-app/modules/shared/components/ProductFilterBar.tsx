"use client";

import React, { useState } from "react";

export type ViewMode = "grid" | "list";

export interface ProductFilterBarProps {
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  category?: string;
  onCategoryChange?: (category: string) => void;
  badge?: string;
  onBadgeChange?: (badge: string) => void;
  priceRange?: string;
  onPriceRangeChange?: (priceRange: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSelecting?: boolean;
  onSelectProduct?: () => void;
  onDeselectProduct?: () => void;
  onEditProducts?: () => void;
  onExportProduct?: () => void;
  onAddProduct?: () => void;
  className?: string;
}

export function ProductFilterBar({
  viewMode = "grid",
  onViewModeChange,
  category = "All Categories",
  onCategoryChange,
  badge = "All Badges",
  onBadgeChange,
  priceRange = "All Prices",
  onPriceRangeChange,
  searchQuery = "",
  onSearchChange,
  isSelecting = false,
  onSelectProduct,
  onDeselectProduct,
  onEditProducts,
  onExportProduct,
  onAddProduct,
  className = "",
}: ProductFilterBarProps) {
  const [currentView, setCurrentView] = useState<ViewMode>(viewMode);

  const handleViewChange = (mode: ViewMode) => {
    setCurrentView(mode);
    onViewModeChange?.(mode);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Primary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Group: View Mode Switcher, Category, Badge, Price */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-white border border-[#E9E3DE] p-1 rounded-xl flex items-center gap-1 shadow-xs">
            {/* Grid View Button */}
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${currentView === "grid"
                  ? "bg-[#F0E6DF] text-[#6E4B42]"
                  : "text-[#8A756C] hover:text-[#6E4B42] hover:bg-[#F9F5F2]"
                }`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>

            {/* List View Button */}
            <button
              onClick={() => handleViewChange("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${currentView === "list"
                  ? "bg-[#F0E6DF] text-[#6E4B42]"
                  : "text-[#8A756C] hover:text-[#6E4B42] hover:bg-[#F9F5F2]"
                }`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <select
              value={category}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium shadow-xs"
            >
              <option value="All Categories">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Beauty">Beauty</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Badge Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={badge}
              onChange={(e) => onBadgeChange?.(e.target.value)}
              className="appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium shadow-xs"
            >
              <option value="All Badges">All Badges</option>
              <option value="on_sale">10% Sale / On Sale</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="new_arrival">New Arrival</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Price Range Dropdown */}
          <div className="relative shrink-0">
            <select
              value={priceRange}
              onChange={(e) => onPriceRangeChange?.(e.target.value)}
              className="appearance-none bg-white border border-[#E9E3DE] text-[#4A3831] text-sm px-3.5 py-2 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium shadow-xs"
            >
              <option value="All Prices">All Prices</option>
              <option value="under_150">Under $150</option>
              <option value="150_250">$150 - $250</option>
              <option value="over_250">Over $250</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Group: Search Input & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 flex-1 justify-end min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-[240px] min-w-[180px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8A81] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-[#E9E3DE] text-[#4A3831] text-sm pl-9 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#754E45] placeholder-[#9E8A81] shadow-xs"
            />
          </div>

          {/* Dynamic Action Buttons */}
          {isSelecting ? (
            <>
              <button
                onClick={onDeselectProduct}
                className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Deselect Products
              </button>
              <button
                onClick={onEditProducts}
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
              onClick={onSelectProduct}
              className="border border-[#004956] text-[#004956] hover:bg-[#004956]/5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Select Product
            </button>
          )}

          {/* Export Product Button */}
          <button
            onClick={onExportProduct}
            className="border border-[#E9E3DE] bg-white text-[#4A3831] hover:bg-[#FAF5F2] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <svg className="w-4 h-4 text-[#7A675E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Product</span>
          </button>

          {/* Add Product Button */}
          <button
            onClick={onAddProduct}
            className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <span className="text-base font-normal leading-none">+</span>
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilterBar;
