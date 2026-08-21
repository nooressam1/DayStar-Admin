"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  PageHeader,
  Filter,
  FilterConfig,
  Table,
  Pagination,
  StatCard,
  useDebounce,
  useUrlFilterState,
} from "@/modules/shared";
import { ContactSubmission } from "@/types";
import { useGetQueries } from "@/app/api/hooks/useQueries";
import { QUERY_STATUS_OPTIONS } from "../constants/queryFilters";
import { getQueryColumns } from "../utils/queryColumns";
import { QueryDetailModal } from "../components/QueryDetailModal";

const QUERY_FILTERS = [
  { key: "status", defaultValue: "All Statuses" },
  { key: "search", defaultValue: "" },
];

const ITEMS_PER_PAGE = 10;
const extractQueryKey = (query: ContactSubmission) => query.id;

export function QueryPage() {
  const {
    filterValues,
    setFilter,
    currentPage,
  } = useUrlFilterState({
    filters: QUERY_FILTERS,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const statusFilter = filterValues.status;

  // Search state with debounce
  const [localSearch, setLocalSearch] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    if (debouncedSearch !== (filterValues.search || "")) {
      setFilter("search", debouncedSearch);
      setFilter("page", 1);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  // Modal State
  const [selectedQuery, setSelectedQuery] = useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Server-side paginated & filtered query hook
  const { data: response, isLoading, isError, error, refetch } = useGetQueries({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...(statusFilter !== "All Statuses" ? { status: statusFilter } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const queries = response?.items || [];
  const totalItems = response?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const pendingCount = response?.pendingCount || 0;
  const inProgressCount = response?.inProgressCount || 0;
  const resolvedCount = response?.resolvedCount || 0;
  const totalSubmissions = pendingCount + inProgressCount + resolvedCount;
  useEffect(() => {
    if (totalItems > 0 && currentPage > totalPages) {
      setFilter("page", 1);
    }
  }, [currentPage, totalPages, totalItems, setFilter]);

  // Filter Bar Configuration
  const queryConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "status",
        type: "select",
        value: statusFilter,
        onChange: (val: string) => {
          setFilter("status", val);
          setFilter("page", 1);
        },
        options: QUERY_STATUS_OPTIONS,
      },
      {
        key: "search",
        type: "search",
        value: localSearch,
        onChange: (val: string) => setLocalSearch(val),
        placeholder: "Search by customer, email, or subject...",
      },
    ],
    [statusFilter, localSearch, setFilter]
  );

  const handleViewQuery = useCallback((query: ContactSubmission) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  }, []);

  const columns = useMemo(
    () => getQueryColumns({ onViewQuery: handleViewQuery }),
    [handleViewQuery]
  );

  const handlePageChange = useCallback(
    (page: number) => setFilter("page", page),
    [setFilter]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer Inquiries & Queries"
        subtitle="Manage incoming support requests, contact form submissions, and customer inquiries."
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="PENDING QUERIES"
          value={pendingCount.toLocaleString()}
          progressPercentage={
            totalSubmissions > 0
              ? Math.round((pendingCount / totalSubmissions) * 100)
              : 0
          }
        />

        <StatCard
          title="IN PROGRESS"
          value={inProgressCount.toLocaleString()}
          progressPercentage={
            totalSubmissions > 0
              ? Math.round((inProgressCount / totalSubmissions) * 100)
              : 0
          }
        />

        <StatCard
          title="RESOLVED QUERIES"
          value={resolvedCount.toLocaleString()}
          progressPercentage={
            totalSubmissions > 0
              ? Math.round((resolvedCount / totalSubmissions) * 100)
              : 0
          }
        />
      </div>

      {/* Filter Component */}
      <Filter config={queryConfig} />

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between gap-4 shadow-xs">
          <div>
            <p className="font-semibold text-sm">Could not load customer inquiries from backend</p>
            <p className="text-xs text-red-600 mt-0.5">
              {error?.message || "Network error or request timeout."}
            </p>
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
            data={queries}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={extractQueryKey}
            onRowClick={handleViewQuery}
            emptyText="No customer queries match your filter criteria."
          />

          {!isLoading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              itemLabel="inquiries"
            />
          )}
        </div>
      )}

      {/* Detail Modal */}
      <QueryDetailModal
        query={selectedQuery}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuery(null);
        }}
      />
    </div>
  );
}

export default QueryPage;
