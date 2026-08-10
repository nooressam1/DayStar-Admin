"use client";

import React from "react";
import { ColumnConfig, StatusBadge, formatDate, getInitials } from "@/modules/shared";
import { Customer } from "@/types";

export interface GetCustomerColumnsOptions {
  onToggleStatus: (customer: Customer) => void;
}

export function getCustomerColumns({
  onToggleStatus,
}: GetCustomerColumnsOptions): ColumnConfig<Customer>[] {
  return [
    {
      key: "id",
      header: "Customer ID",
      accessor: (c: Customer) => (
        <span className="font-mono font-semibold text-xs text-[#004956] bg-[#EAF4F6] px-2 py-1 rounded-md">
          {c.id}
        </span>
      ),
    },
    {
      key: "full_name",
      header: "Customer",
      accessor: (c: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(c.full_name)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-[#3D2E28]">{c.full_name}</span>
            <span className="text-xs text-[#8A756C]">{c.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "phone_number",
      header: "Phone Number",
      accessor: (c: Customer) => (
        <span className="text-sm text-[#583F37]">{c.phone_number || "—"}</span>
      ),
    },
    {
      key: "orders_count",
      header: "Orders",
      accessor: (c: Customer) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF5F2] text-[#6E4B42] border border-[#EBE3DE]">
          {c.orders_count} {c.orders_count === 1 ? "Order" : "Orders"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Joined Date",
      accessor: (c: Customer) => (
        <span className="text-sm text-[#7A6860]">{formatDate(c.created_at)}</span>
      ),
    },
    {
      key: "is_disabled",
      header: "Status",
      accessor: (c: Customer) => (
        <StatusBadge
          status={c.is_disabled ? "Disabled" : "Active"}
          dot
          size="sm"
        />
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      accessor: (c: Customer) => (
        <button
          onClick={() => onToggleStatus(c)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            c.is_disabled
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          {c.is_disabled ? "Enable Account" : "Disable Account"}
        </button>
      ),
    },
  ];
}
