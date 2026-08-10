"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Filter, FilterConfig, Table, ColumnConfig, Pagination, StatusBadge } from "@/modules/shared";
import { useUrlFilterState } from "@/modules/shared/hooks/useUrlFilterState";
import { useGetAdminOrders } from "@/app/api/hooks/useOrders";
import { Order } from "@/types";
import { OrderStatus } from "@/enums";
import { formatMoney } from "@/utils/format";
import { ORDER_STATUS_OPTIONS } from "../constants/orderFilters";
import { formatDate, getInitials } from "../utils";

// ── Order filter definitions ──
const ORDER_FILTERS = [
  { key: "status", defaultValue: "All Statuses" },
  { key: "search", defaultValue: "" },
];

const extractOrderKey = (order: Order) => order.id;

// ── Memoized cell renderers ──
// Extracting these avoids creating new JSX elements on every table re-render.

const OrderNumberCell = React.memo(({ order }: { order: Order }) => (
  <Link
    href={`/order/${order.id}`}
    onClick={(e) => e.stopPropagation()}
    className="text-[#6E4B42] font-semibold hover:underline"
  >
    #{order.order_number}
  </Link>
));
OrderNumberCell.displayName = "OrderNumberCell";

const CustomerCell = React.memo(({ order }: { order: Order }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-xs flex items-center justify-center shrink-0">
      {getInitials(order.full_name)}
    </div>
    <div className="flex flex-col">
      <span className="font-medium">{order.full_name || "—"}</span>
      {order.phone_number && (
        <span className="text-xs text-[#8A756C]">{order.phone_number}</span>
      )}
    </div>
  </div>
));
CustomerCell.displayName = "CustomerCell";

const StatusBadgeCell = React.memo(({ order }: { order: Order }) => (
  <StatusBadge status={order.status} size="md" />
));
StatusBadgeCell.displayName = "StatusBadgeCell";

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
  const searchQuery = filterValues.search;

  // ── Fetch orders from API (server-side filtering + pagination) ──
  const { data: response, isLoading, isError, error, refetch } = useGetAdminOrders({
    page: currentPage,
    limit: itemsPerPage,
    ...(statusFilter !== "All Statuses" ? { status: statusFilter.toLowerCase() } : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
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
      value: searchQuery,
      onChange: (val: string) => setFilter("search", val),
      placeholder: "Search by order #, name or phone...",
    },
  ], [statusFilter, searchQuery, setFilter]);

  // ── Column config (using memoized cell components) ──
  const orderColumns: ColumnConfig<Order>[] = useMemo(() => [
    {
      key: "order_number",
      header: "Order #",
      accessor: (order: Order) => <OrderNumberCell order={order} />,
    },
    {
      key: "full_name",
      header: "Customer",
      accessor: (order: Order) => <CustomerCell order={order} />,
    },
    {
      key: "created_at",
      header: "Date",
      accessor: (order: Order) => formatDate(order.created_at),
      className: "text-[#8A756C]",
    },
    {
      key: "Order_status",
      header: "Order Status",
      accessor: (order: Order) => <StatusBadgeCell order={order} />,
    },
    {
      key: "total",
      header: "Amount",
      accessor: (order: Order) => formatMoney(order.total),
      className: "font-semibold text-[#3D2E28]",
    },
  ], []);

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
