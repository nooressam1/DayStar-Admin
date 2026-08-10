"use client";

import React from "react";
import { ColumnConfig, StatusBadge } from "@/modules/shared";
import { DiscountRecord } from "../pages/DiscountPage";

export interface GetDiscountColumnsOptions {
  onCopyCode: (code: string) => void;
  onEdit: (discount: DiscountRecord) => void;
  onDelete: (id: string) => void;
}

export function getDiscountColumns({
  onCopyCode,
  onEdit,
  onDelete,
}: GetDiscountColumnsOptions): ColumnConfig<DiscountRecord>[] {
  return [
    {
      key: "code",
      header: "DISCOUNT CODE",
      accessor: (discount) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#FAF5F2] border border-[#E9E3DE] text-[#583F37]">
            {discount.code}
          </span>
          <button
            onClick={() => onCopyCode(discount.code)}
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
        <StatusBadge status={discount.status} />
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
            onClick={() => onEdit(discount)}
            title="Edit Discount"
            className="p-1.5 rounded-lg text-[#583F37] hover:bg-[#FAF5F2] border border-transparent hover:border-[#E9E3DE] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete(discount.id)}
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
}
