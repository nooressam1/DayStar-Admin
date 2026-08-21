"use client";

import React from "react";
import { ColumnConfig, StatusBadge, formatDate, getInitials } from "@/modules/shared";
import { ContactSubmission } from "@/types";

export interface GetQueryColumnsOptions {
  onViewQuery: (query: ContactSubmission) => void;
}

export function getQueryColumns({
  onViewQuery,
}: GetQueryColumnsOptions): ColumnConfig<ContactSubmission>[] {
  return [
    {
      key: "name",
      header: "Customer",
      accessor: (q: ContactSubmission) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EFE6E0] text-[#6E4B42] font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(q.name)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-[#3D2E28]">{q.name || "Guest"}</span>
            <span className="text-xs text-[#8A756C]">{q.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      accessor: (q: ContactSubmission) => (
        <span className="font-semibold text-sm text-[#3D2E28] max-w-xs truncate block">
          {q.subject || "No Subject"}
        </span>
      ),
    },
    {
      key: "message",
      header: "Message Snippet",
      accessor: (q: ContactSubmission) => (
        <span className="text-xs text-[#7A6860] max-w-sm truncate block">
          {q.message}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      accessor: (q: ContactSubmission) => (
        <span className="text-xs text-[#7A6860]">{formatDate(q.created_at)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (q: ContactSubmission) => (
        <StatusBadge status={q.status} size="sm" dot />
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      accessor: (q: ContactSubmission) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewQuery(q);
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#EAE1DA] bg-white hover:bg-[#FAF5F2] text-[#6E4B42] transition-colors cursor-pointer"
        >
          View Inquiry
        </button>
      ),
    },
  ];
}
