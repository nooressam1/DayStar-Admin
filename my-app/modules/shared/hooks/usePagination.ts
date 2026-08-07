"use client";

import { useMemo } from "react";

export interface UsePaginationReturn<T> {
  /** Items sliced for the current page */
  paginatedItems: T[];
  /** Total number of pages (minimum 1) */
  totalPages: number;
  /** Total number of items before pagination */
  totalItems: number;
}

/**
 * Custom hook to slice an array of items for current page pagination and compute total pages.
 *
 * @param items Array of items to paginate
 * @param currentPage Active page index (1-based)
 * @param itemsPerPage Items per page
 * @returns Object with paginatedItems, totalPages, and totalItems
 */
export function usePagination<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): UsePaginationReturn<T> {
  return useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return {
      paginatedItems,
      totalPages,
      totalItems,
    };
  }, [items, currentPage, itemsPerPage]);
}

export default usePagination;
