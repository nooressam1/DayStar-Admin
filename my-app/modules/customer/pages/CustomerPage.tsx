"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  PageHeader,
  Filter,
  FilterConfig,
  Table,
  Pagination,
  useUrlFilterState,
  useDebounce,
} from "@/modules/shared";
import { Customer } from "@/types";
import { useGetCustomers, useToggleDisableCustomer } from "@/app/api/hooks/useCustomers";
import { CUSTOMER_FILTERS, CUSTOMER_STATUS_OPTIONS } from "../constants/customerFilters";
import { getCustomerColumns } from "../utils/customerColumns";
import { ToggleCustomerStatusModal } from "../components/ToggleCustomerStatusModal";

export function CustomerPage() {
  // URL-synced filter state
  const {
    filterValues,
    setFilter,
    currentPage,
    itemsPerPage,
    setPage,
  } = useUrlFilterState({
    filters: CUSTOMER_FILTERS,
    itemsPerPage: 10,
  });

  const statusFilter = filterValues.status || "All Accounts";

  // Debounced Local Search
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

  // Data fetching hook
  const { data: response, isLoading, isError, refetch } = useGetCustomers({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status:
      statusFilter === "Active"
        ? "active"
        : statusFilter === "Disabled"
        ? "disabled"
        : "all",
  });

  const { mutate: toggleDisable, isPending: isToggling } = useToggleDisableCustomer();

  // State for disable confirmation modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers = useMemo(() => response?.items || [], [response]);
  const totalItems = useMemo(() => response?.total || 0, [response]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );

  const handleConfirmToggleStatus = () => {
    if (!selectedCustomer) return;
    toggleDisable(
      { id: selectedCustomer.id, is_disabled: !selectedCustomer.is_disabled },
      {
        onSuccess: () => {
          setSelectedCustomer(null);
        },
      }
    );
  };

  // Filter Configuration
  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "status",
        type: "select",
        value: statusFilter,
        onChange: (val: string) => setFilter("status", val),
        options: CUSTOMER_STATUS_OPTIONS,
      },
      {
        key: "search",
        type: "search",
        value: localSearch,
        onChange: (val: string) => setLocalSearch(val),
        placeholder: "Search by Customer ID, name, or phone...",
      },
    ],
    [statusFilter, localSearch, setFilter]
  );

  // Table Column Definitions
  const columns = useMemo(
    () => getCustomerColumns({ onToggleStatus: setSelectedCustomer }),
    [setSelectedCustomer]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Declarative Page Header */}
      <PageHeader
        title="Customer Management"
        subtitle="Manage registered customer accounts, view order activity, and control profile access."
      />

      {/* Filter Engine */}
      <Filter config={filterConfig} />

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between shadow-xs">
          <span className="text-sm font-medium">Failed to load customer profiles.</span>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Customers Table + Skeleton */}
      {!isError && (
        <div className="space-y-0">
          <Table
            data={customers}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={(c) => c.id}
            emptyText="No customer profiles found matching your criteria."
          />

          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              itemLabel="customers"
            />
          )}
        </div>
      )}

      {/* Modular Disable / Enable Confirmation Modal */}
      <ToggleCustomerStatusModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        onConfirm={handleConfirmToggleStatus}
        isSubmitting={isToggling}
      />
    </div>
  );
}

export default CustomerPage;
