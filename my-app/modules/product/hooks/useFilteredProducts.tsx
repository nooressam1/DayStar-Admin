"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FilterConfig, ProductItem } from "@/modules/shared";
import { useGetProducts } from "@/app/api/hooks/useProducts";
import { useGetCategories } from "@/app/api/hooks/useCategories";
import { formatProductForCard } from "../utils/FormatProduct";
import { parsePrice } from "@/utils/format";

export interface UseFilteredProductsOptions {
  customProducts?: ProductItem[];
  itemsPerPage?: number;
}

const ITEMS_PER_PAGE = 12;

// Default values — when a param equals its default, we strip it from the URL
const DEFAULTS = {
  categoryId: "",
  badge: "All Badges",
  price: "All Prices",
  search: "",
  page: "1",
} as const;

export function useFilteredProducts(options: UseFilteredProductsOptions = {}) {
  const limit = options.itemsPerPage ?? ITEMS_PER_PAGE;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Fetch categories from API ──
  const { data: categories = [] } = useGetCategories();

  // ── Read filter values from URL search params ──
  const categoryId = searchParams.get("categoryId") || DEFAULTS.categoryId;
  const badgeFilter = searchParams.get("badge") || DEFAULTS.badge;
  const priceRangeFilter = searchParams.get("price") || DEFAULTS.price;
  const searchQuery = searchParams.get("search") || DEFAULTS.search;
  const currentPage = parseInt(searchParams.get("page") || DEFAULTS.page, 10) || 1;

  // ── Helper: update one or more params in the URL ──
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        const defaultKey = key as keyof typeof DEFAULTS;
        if (value === DEFAULTS[defaultKey] || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // ── Individual setters that update URL params ──
  const setCategoryId = useCallback(
    (value: string) => updateParams({ categoryId: value, page: "1" }),
    [updateParams]
  );
  const setBadgeFilter = useCallback(
    (value: string) => updateParams({ badge: value, page: "1" }),
    [updateParams]
  );
  const setPriceRangeFilter = useCallback(
    (value: string) => updateParams({ price: value, page: "1" }),
    [updateParams]
  );
  const setSearchQuery = useCallback(
    (value: string) => updateParams({ search: value, page: "1" }),
    [updateParams]
  );
  const setPage = useCallback(
    (page: number) => updateParams({ page: String(page) }),
    [updateParams]
  );

  // ── Fetch products from API (pass categoryId, page, limit) ──
  const { data: response, isLoading, isError } = useGetProducts({
    ...(categoryId ? { categoryId } : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
    page: currentPage,
    limit,
  });

  const rawProducts = response?.items || [];
  const totalItems = response?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const productsList: ProductItem[] = useMemo(() => {
    if (options.customProducts) return options.customProducts;
    return rawProducts.map(formatProductForCard);
  }, [options.customProducts, rawProducts]);

  // ── Client-side filtering ──
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      // Filter by category ID
      if (categoryId && p.category_id !== categoryId) {
        return false;
      }
      if (badgeFilter !== DEFAULTS.badge && p.badge?.type !== badgeFilter) {
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
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [productsList, categoryId, badgeFilter, priceRangeFilter, searchQuery]);

  // ── Reset all filters (clears URL params) ──
  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

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
        onChange: setCategoryId,
        options: categoryOptions,
      },
      {
        key: "badge",
        type: "select",
        value: badgeFilter,
        onChange: setBadgeFilter,
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
        onChange: setPriceRangeFilter,
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
        onChange: setSearchQuery,
        placeholder: "Search products...",
      },
    ],
    [categoryId, categoryOptions, badgeFilter, priceRangeFilter, searchQuery, setCategoryId, setBadgeFilter, setPriceRangeFilter, setSearchQuery]
  );

  return {
    categoryId,
    setCategoryId,
    badgeFilter,
    setBadgeFilter,
    priceRangeFilter,
    setPriceRangeFilter,
    searchQuery,
    setSearchQuery,
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
    itemsPerPage: limit,
    setPage,
  };
}
