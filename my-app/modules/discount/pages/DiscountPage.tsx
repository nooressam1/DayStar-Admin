"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PageHeader,
  Pagination,
  Modal,
  Filter,
  FilterConfig,
  Table,
  ColumnConfig,
  useUrlFilterState,
  useDebounce,
  usePagination,
} from "@/modules/shared";
import { Discount } from "@/types";
import { fetchDiscountsApi, deleteDiscountApi } from "../utils/discountStorage";
import { DISCOUNT_STATUS_OPTIONS, DISCOUNT_TYPE_OPTIONS } from "../constants/discountFilters";

const DISCOUNT_FILTERS = [
  { key: "status", defaultValue: "All Statuses" },
  { key: "type", defaultValue: "All Types" },
  { key: "search", defaultValue: "" },
];

export interface DiscountRecord extends Partial<Discount> {
  id: string;
  code: string;
  type: string;
  value: any;
  status?: "Active" | "Scheduled" | "Expired";
  usageCount?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  minRequirementType?: "none" | "amount" | "quantity";
  minRequirementValue?: string;
}

export function DiscountPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<DiscountRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── URL-synced filter state ──
  const {
    filterValues,
    setFilter,
    currentPage,
    itemsPerPage,
    setPage,
  } = useUrlFilterState({
    filters: DISCOUNT_FILTERS,
    itemsPerPage: 10,
  });

  const statusFilter = filterValues.status;
  const typeFilter = filterValues.type;

  // ── Local search input state with debouncing ──
  const [localSearch, setLocalSearch] = useState(filterValues.search);
  const debouncedSearch = useDebounce(localSearch, 350);

  // Sync local search state when URL search param changes externally
  useEffect(() => {
    setLocalSearch(filterValues.search);
  }, [filterValues.search]);

  // Push debounced search to URL filter state
  useEffect(() => {
    if (debouncedSearch !== filterValues.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  // ── Fetch discounts on mount ──
  useEffect(() => {
    setIsLoading(true);
    fetchDiscountsApi()
      .then(setDiscounts)
      .finally(() => setIsLoading(false));
  }, []);

  // ── Local filtering using URL filter state and debounced search ──
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) => {
      if (statusFilter !== "All Statuses" && d.status !== statusFilter) return false;
      if (typeFilter !== "All Types" && d.type !== typeFilter) return false;
      if (
        debouncedSearch &&
        !d.code.toLowerCase().includes(debouncedSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [discounts, statusFilter, typeFilter, debouncedSearch]);

  // ── Reusable Pagination Hook ──
  const {
    paginatedItems: paginatedDiscounts,
    totalPages,
  } = usePagination(filteredDiscounts, currentPage, itemsPerPage);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteDiscount = async () => {
    if (!deletingId) return;
    await deleteDiscountApi(deletingId);
    setDiscounts((prev) => prev.filter((d) => d.id !== deletingId));
    setDeletingId(null);
  };

  const getStatusBadge = (status: DiscountRecord["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#50E3C2]/20 text-[#044E35] border border-[#50E3C2]/40";
      case "Scheduled":
        return "bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE]";
      case "Expired":
        return "bg-stone-100 text-stone-600 border border-stone-200";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const discountConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "status",
        type: "select",
        value: statusFilter,
        onChange: (val) => setFilter("status", val),
        options: DISCOUNT_STATUS_OPTIONS,
      },
      {
        key: "type",
        type: "select",
        value: typeFilter,
        onChange: (val) => setFilter("type", val),
        options: DISCOUNT_TYPE_OPTIONS,
      },
      {
        key: "search",
        type: "search",
        value: localSearch,
        onChange: (val) => setLocalSearch(val),
        placeholder: "Search discount code...",
      },
    ],
    [statusFilter, typeFilter, localSearch, setFilter]
  );

  const discountColumns: ColumnConfig<DiscountRecord>[] = [
    {
      key: "code",
      header: "DISCOUNT CODE",
      accessor: (discount) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#FAF5F2] border border-[#E9E3DE] text-[#583F37]">
            {discount.code}
          </span>
          <button
            onClick={() => handleCopyCode(discount.code)}
            title="Copy Discount Code"
            className="text-[#8A756C] hover:text-[#583F37] p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      ),
    },
    {
      key: "value",
      header: "VALUE",
      accessor: "value",
      className: "font-medium text-[#583F37]",
    },
    {
      key: "status",
      header: "STATUS",
      accessor: (discount) => (
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
            discount.status
          )}`}
        >
          {discount.status}
        </span>
      ),
    },
    {
      key: "type",
      header: "DISCOUNT TYPE",
      accessor: (discount) => (
        <span className="text-[#6E5B53] font-medium">
          {discount.type}
        </span>
      ),
    },
    {
      key: "dates",
      header: "START & END DATE",
      accessor: (discount) => (
        <span className="text-xs text-[#8A756C]">
          {discount.startDate} {discount.endDate ? `to ${discount.endDate}` : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      align: "right",
      accessor: (discount) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setDeletingId(discount.id)}
            title="Delete Discount"
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Feedback for Copying */}
      {copiedCode && (
        <div className="fixed top-6 right-6 z-50 bg-[#004D5A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-[#50E3C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied discount code "{copiedCode}"!
        </div>
      )}

      <PageHeader
        title="Discounts"
        subtitle="Welcome back. Here's what's happening with your store today."
      />

      {/* Universal Reusable Filter Component */}
      <Filter
        config={discountConfig}
        actions={
          <button
            onClick={() => router.push("/discount/new")}
            className="bg-[#004956] text-white hover:bg-[#003842] text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <span className="text-base font-normal leading-none">+</span>
            <span>Create Discount</span>
          </button>
        }
      />

      {/* Reusable Table Component with built-in isLoading */}
      <div className="space-y-0">
        <Table
          data={paginatedDiscounts}
          columns={discountColumns}
          isLoading={isLoading}
          keyExtractor={(discount) => discount.id}
          emptyText="No discounts found matching your criteria."
        />

        {/* Pagination Component */}
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDiscounts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            itemLabel="discounts"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteDiscount}
        title="Delete Discount?"
        confirmText="Delete"
        confirmVariant="danger"
        maxWidth="sm"
      >
        <p className="text-sm text-[#6E5B53]">
          Are you sure you want to delete this discount campaign? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default DiscountPage;
