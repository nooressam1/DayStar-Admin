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
  useUrlFilterState,
  useDebounce,
  StatusBadge,
} from "@/modules/shared";
import { Discount } from "@/types";
import { EditDiscountModal } from "../components/EditDiscountModal";
import { DISCOUNT_STATUS_OPTIONS, DISCOUNT_TYPE_OPTIONS } from "../constants/discountFilters";
import { getDiscountColumns } from "../utils/discountColumns";
import {
  useGetDiscounts,
  useUpdateDiscount,
  useDeleteDiscount,
} from "@/app/api/hooks/useDiscounts";

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
  const updateDiscountMutation = useUpdateDiscount();
  const deleteDiscountMutation = useDeleteDiscount();

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

  useEffect(() => {
    setLocalSearch(filterValues.search);
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  // ── Fetch discounts via React Query Hooks (Server-side Pagination) ──
  const { data: response, isLoading } = useGetDiscounts({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: statusFilter,
    type: typeFilter,
  });

  const rawDiscounts = response?.items || [];
  const totalItems = response?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Transform raw backend response into DiscountRecord format
  const discounts: DiscountRecord[] = useMemo(() => {
    if (!Array.isArray(rawDiscounts)) return [];
    return rawDiscounts.map((d) => ({
      id: d.id,
      code: d.code,
      type: d.type,
      value:
        d.type === "Free Shipping"
          ? "Free Shipping"
          : d.type === "Fixed Amount"
            ? `$${d.value}.00 OFF`
            : `${d.value}% OFF`,
      status: d.is_active ? "Active" : "Scheduled",
      startDate: d.active_start_date || "2026-06-01",
      endDate: d.active_end_date || undefined,
      minRequirementType: d.min_requirement_type || "none",
      minRequirementValue: d.min_requirement_value ? String(d.min_requirement_value) : undefined,
    }));
  }, [rawDiscounts]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteDiscount = async () => {
    if (!deletingId) return;
    try {
      await deleteDiscountMutation.mutateAsync(deletingId);
      setDeletingId(null);
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  };

  // ── Edit Modal State ──
  const [editingDiscount, setEditingDiscount] = useState<DiscountRecord | null>(null);

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

  const discountColumns = getDiscountColumns({
    onCopyCode: handleCopyCode,
    onEdit: setEditingDiscount,
    onDelete: setDeletingId,
  });

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
          data={discounts}
          columns={discountColumns}
          isLoading={isLoading}
          keyExtractor={(discount) => discount.id}
          emptyText="No discounts found matching your criteria."
        />

        {/* Pagination Component */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
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

      {/* Edit Discount Modal */}
      <EditDiscountModal
        discount={editingDiscount}
        isOpen={Boolean(editingDiscount)}
        onClose={() => setEditingDiscount(null)}
        discountsList={discounts}
      />
    </div>
  );
}

export default DiscountPage;
