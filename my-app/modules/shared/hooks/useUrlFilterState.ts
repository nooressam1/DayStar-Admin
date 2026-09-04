"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// ── Types ──

export interface FilterDefault {
  /** The URL search param key (e.g. "categoryId", "status") */
  key: string;
  /** The default value — when a param equals this, it's stripped from the URL */
  defaultValue: string;
}

export interface UseUrlFilterStateOptions {
  /** Define each filter key and its default value */
  filters: FilterDefault[];
  /** Items per page for pagination (default: 12) */
  itemsPerPage?: number;
}

export interface UseUrlFilterStateReturn {
  /** Current value for each filter key */
  filterValues: Record<string, string>;
  /** Update a single filter (resets page to 1) */
  setFilter: (key: string, value: string | number) => void;
  /** Navigate to a specific page */
  setPage: (page: number | string) => void;
  /** Clear all filter params from the URL */
  resetFilters: () => void;
  /** Current page number */
  currentPage: number;
  /** Items per page */
  itemsPerPage: number;
}

const DEFAULT_ITEMS_PER_PAGE = 12;

export function useUrlFilterState(
  options: UseUrlFilterStateOptions
): UseUrlFilterStateReturn {
  const { filters, itemsPerPage = DEFAULT_ITEMS_PER_PAGE } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Build a defaults map from the filter definitions ──
  const defaultsMap = useMemo(() => {
    const map: Record<string, string> = { page: "1" };
    filters.forEach((f) => {
      map[f.key] = f.defaultValue;
    });
    return map;
  }, [filters]);

  // ── Read current filter values from URL ──
  const filterValues = useMemo(() => {
    const values: Record<string, string> = {};
    filters.forEach((f) => {
      values[f.key] = searchParams.get(f.key) || f.defaultValue;
    });
    return values;
  }, [filters, searchParams]);

  const currentPage =
    parseInt(searchParams.get("page") || "1", 10) || 1;

  // ── Helper: update one or more params in the URL ──
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        const defaultVal = defaultsMap[key];
        if (value === defaultVal || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname, defaultsMap]
  );

  // ── Set a filter value (resets page to 1 unless it IS the page) ──
  const setFilter = useCallback(
    (key: string, value: string | number) => {
      const valStr = String(value);
      if (key === "page") {
        updateParams({ page: valStr });
      } else {
        updateParams({ [key]: valStr, page: "1" });
      }
    },
    [updateParams]
  );

  // ── Convenience: set page directly ──
  const setPage = useCallback(
    (page: number | string) => setFilter("page", page),
    [setFilter]
  );

  // ── Reset all filters (clears URL params) ──
  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    filterValues,
    setFilter,
    setPage,
    resetFilters,
    currentPage,
    itemsPerPage,
  };
}
