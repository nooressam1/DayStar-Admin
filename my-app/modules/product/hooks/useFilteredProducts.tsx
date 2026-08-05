"use client";

import { useMemo } from "react";
import { FilterConfig, ProductItem, useDebounce } from "@/modules/shared";
import { useGetProducts } from "@/app/api/hooks/useProducts";
import { useGetCategories } from "@/app/api/hooks/useCategories";
import { useUrlFilterState } from "@/modules/shared/hooks/useUrlFilterState";
import { formatProductForCard } from "../utils/FormatProduct";
import { parsePrice } from "@/utils/format";

export interface UseFilteredProductsOptions {
  customProducts?: ProductItem[];
  itemsPerPage?: number;
  includeInactive?: boolean;
}

const ITEMS_PER_PAGE = 12;

// ── Filter definitions for the products page ──
const PRODUCT_FILTERS = [
  { key: "categoryId", defaultValue: "" },
  { key: "badge", defaultValue: "All Badges" },
  { key: "price", defaultValue: "All Prices" },
  { key: "search", defaultValue: "" },
];

export function useFilteredProducts(options: UseFilteredProductsOptions = {}) {
  const limit = options.itemsPerPage ?? ITEMS_PER_PAGE;

  // ── Reusable URL filter state ──
  const {
    filterValues,
    setFilter,
    setPage,
    resetFilters,
    currentPage,
    itemsPerPage,
  } = useUrlFilterState({
    filters: PRODUCT_FILTERS,
    itemsPerPage: limit,
  });

  // ── Destructure filter values for readability ──
  const categoryId = filterValues.categoryId;
  const badgeFilter = filterValues.badge;
  const priceRangeFilter = filterValues.price;
  const searchQuery = filterValues.search;

  // Debounce the search query sent to the API to avoid excessive network requests
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  // ── Fetch categories from API ──
  const { data: categories = [] } = useGetCategories();

  // ── Fetch products from API (pass categoryId, page, limit, and debounced search) ──
  const { data: response, isLoading, isError } = useGetProducts({
    ...(categoryId ? { categoryId } : {}),
    ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
    includeInactive: options.includeInactive ?? true,
    page: currentPage,
    limit: itemsPerPage,
  });

  const rawProducts = response?.items || [];
  const totalItems = response?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const productsList: ProductItem[] = useMemo(() => {
    if (options.customProducts) return options.customProducts;
    return rawProducts.map(formatProductForCard);
  }, [options.customProducts, rawProducts]);

  // ── Instant Client-side local filtering ──
  const filteredProducts = useMemo(() => {
    const query = (searchQuery || "").trim().toLowerCase();

    return productsList.filter((p) => {
      // Filter by category ID
      if (categoryId && p.category_id !== categoryId) {
        return false;
      }
      if (badgeFilter !== "All Badges" && p.badge?.type !== badgeFilter) {
        return false;
      }
      const priceNum = parsePrice(p.price);
      if (priceRangeFilter === "under_150" && priceNum >= 150) {
        return false;
      }
      if (
        priceRangeFilter === "150_250" &&
        (priceNum < 150 || priceNum > 250)
      ) {
        return false;
      }
      if (priceRangeFilter === "over_250" && priceNum <= 250) {
        return false;
      }

      // Instant local search matching across name, sku, category, and description
      if (query) {
        const matchName = p.name ? p.name.toLowerCase().includes(query) : false;
        const matchSku = p.sku ? p.sku.toLowerCase().includes(query) : false;
        const matchCategory = p.category ? p.category.toLowerCase().includes(query) : false;

        if (!matchName && !matchSku && !matchCategory) {
          return false;
        }
      }
      return true;
    });
  }, [productsList, categoryId, badgeFilter, priceRangeFilter, searchQuery]);

  // ── Build category options dynamically from API data ──
  const categoryOptions = useMemo(() => {
    const opts = [{ label: "All Categories", value: "" }];
    categories.forEach((cat) => {
      opts.push({ label: cat.name, value: cat.id });
    });
    return opts;
  }, [categories]);

  // ── Filter UI configuration ──
  const productConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "categoryId",
        type: "select",
        value: categoryId,
        onChange: (val: string) => setFilter("categoryId", val),
        options: categoryOptions,
      },
      {
        key: "badge",
        type: "select",
        value: badgeFilter,
        onChange: (val: string) => setFilter("badge", val),
        options: [
          { label: "All Badges", value: "All Badges" },
          { label: "10% Sale / On Sale", value: "on_sale" },
          { label: "Low Stock", value: "low_stock" },
          { label: "Out of Stock", value: "out_of_stock" },
          { label: "New Arrival", value: "new_arrival" },
        ],
      },
      {
        key: "priceRange",
        type: "select",
        value: priceRangeFilter,
        onChange: (val: string) => setFilter("price", val),
        options: [
          { label: "All Prices", value: "All Prices" },
          { label: "Under $150", value: "under_150" },
          { label: "$150 - $250", value: "150_250" },
          { label: "Over $250", value: "over_250" },
        ],
      },
      {
        key: "search",
        type: "search",
        value: searchQuery,
        onChange: (val: string) => setFilter("search", val),
        placeholder: "Search products...",
      },
    ],
    [categoryId, categoryOptions, badgeFilter, priceRangeFilter, searchQuery, setFilter]
  );

  return {
    setFilter,
    categoryId,
    badgeFilter,
    priceRangeFilter,
    searchQuery,
    resetFilters,
    filteredProducts,
    productsList,
    rawProducts,
    productConfig,
    isLoading,
    isError,
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setPage: (page: number | string) => setFilter("page", page),
  };
}
