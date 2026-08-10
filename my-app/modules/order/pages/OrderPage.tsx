"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Filter, FilterConfig, Table, Pagination, useDebounce } from "@/modules/shared";
import { useUrlFilterState } from "@/modules/shared/hooks/useUrlFilterState";
import { useGetAdminOrders } from "@/app/api/hooks/useOrders";
import { Order } from "@/types";
import { ORDER_STATUS_OPTIONS } from "../constants/orderFilters";
import { orderColumns } from "../utils/orderColumns";

// ── Order filter definitions ──
const ORDER_FILTERS = [
  { key: "status", defaultValue: "All Statuses" },
  { key: "search", defaultValue: "" },
];

const extractOrderKey = (order: Order) => order.id;

export function OrderPage() {
  const router = useRouter();

  // ── URL-synced filter state (reusable) ──
  const {
    filterValues,
    setFilter,
    currentPage,
    itemsPerPage,
  } = useUrlFilterState({
    filters: ORDER_FILTERS,
    itemsPerPage: 10,
  });

  const statusFilter = filterValues.status;

  // ── Debounced Local Search ──
  const [localSearch, setLocalSearch] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    setLocalSearch(filterValues.search || "");
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  // ── Fetch orders from API (server-side filtering + pagination) ──
  const { data: response, isLoading, isError, error, refetch } = useGetAdminOrders({
    page: currentPage,
    limit: itemsPerPage,
    ...(statusFilter !== "All Statuses" ? { status: statusFilter.toLowerCase() } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  // ── Memoized derived values ──
  const orders = useMemo(() => response?.items || [], [response]);
  const totalItems = useMemo(() => response?.total || 0, [response]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / itemsPerPage)), [totalItems, itemsPerPage]);

  const errorMessage = useMemo(() => {
    if (!error) return "Network error or request timeout.";
    if (typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
      return (error as { message: string }).message;
    }
    return "Network error or request timeout.";
  }, [error]);

  // ── Filter config ──
  const orderConfig: FilterConfig[] = useMemo(() => [
    {
      key: "status",
      type: "select",
      value: statusFilter,
      onChange: (val: string) => setFilter("status", val),
      options: ORDER_STATUS_OPTIONS,
    },
    {
      key: "search",
      type: "search",
      value: localSearch,
      onChange: (val: string) => setLocalSearch(val),
      placeholder: "Search by order #, name or phone...",
    },
  ], [statusFilter, localSearch, setFilter]);

  const handleRowClick = useCallback(
    (order: Order) => router.push(`/order/${order.id}`),
    [router]
  );

  const handlePageChange = useCallback(
    (page: number) => setFilter("page", page),
    [setFilter]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders Management"
        subtitle="Monitor customer transactions, order status, and payment history."
      />

      {/* Filter Component */}
      <Filter config={orderConfig} />

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold text-sm">
              !
            </div>
            <div>
              <p className="font-semibold text-sm">Could not load orders from backend</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table + Pagination */}
      {!isError && (
        <div className="space-y-0">
          <Table
            data={orders}
            columns={orderColumns}
            isLoading={isLoading}
            keyExtractor={extractOrderKey}
            onRowClick={handleRowClick}
            emptyText="No orders match your filter criteria."
          />

          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              itemLabel="orders"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default OrderPage;
