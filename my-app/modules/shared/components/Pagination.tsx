"use client";

import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 250,
  totalItems = 1248,
  itemsPerPage = 5,
  onPageChange,
  itemLabel = "orders",
  className = "",
}: PaginationProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val);
    }
  };

  return (
    <div
      className={`bg-[#FAF5F2] px-6 py-4 border-t border-[#E9E3DE] flex flex-wrap items-center justify-between gap-4 text-sm ${className}`}
    >
      {/* Left: Item Range Count */}
      <div className="text-[#7A675E] font-medium text-xs sm:text-sm">
        Showing <span className="font-bold text-[#4A3831]">{startItem}</span> to{" "}
        <span className="font-bold text-[#4A3831]">{endItem}</span> of{" "}
        <span className="font-bold text-[#4A3831]">{totalItems.toLocaleString()}</span> {itemLabel}
      </div>

      {/* Center: Pagination Controls */}
      <div className="flex items-center gap-2 select-none">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-xl border border-[#E9E3DE] bg-white flex items-center justify-center text-[#7A675E] hover:bg-[#F3ECE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {renderPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 text-[#7A675E] font-medium">
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                isCurrent
                  ? "bg-[#004956] text-white shadow-xs"
                  : "text-[#4A3831] hover:bg-[#F3ECE6]"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-xl border border-[#E9E3DE] bg-white flex items-center justify-center text-[#4A3831] hover:bg-[#F3ECE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Right: Go to page */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-semibold text-[#4A3831]">Go to page</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={handleInputChange}
          className="w-12 h-8 bg-white border border-[#E9E3DE] rounded-xl text-center font-bold text-sm text-[#4A3831] focus:outline-none focus:ring-1 focus:ring-[#004956]"
        />
      </div>
    </div>
  );
}

export default Pagination;
