"use client";

import React, { useState } from "react";
import { Modal, StatusBadge, formatDate } from "@/modules/shared";
import { ContactSubmission, ContactSubmissionStatus } from "@/types";
import { useUpdateQueryStatus } from "@/app/api/hooks/useQueries";

export interface QueryDetailModalProps {
  query: ContactSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QueryDetailModal({
  query,
  isOpen,
  onClose,
}: QueryDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const updateStatusMutation = useUpdateQueryStatus();

  if (!query) return null;

  const handleCopyEmail = () => {
    if (query.email) {
      navigator.clipboard.writeText(query.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusChange = (newStatus: ContactSubmissionStatus) => {
    updateStatusMutation.mutate(
      {
        id: query.id,
        dto: {
          status: newStatus,
          resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          // Status updated cleanly
        },
      }
    );
  };

  const isPending = updateStatusMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Query Details"
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        {/* Top Header Card */}
        <div className="bg-[#FAF5F2] border border-[#EAE1DA] p-4 rounded-xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFE6E0] text-[#6E4B42] font-bold text-sm flex items-center justify-center shrink-0">
              {query.name ? query.name.charAt(0).toUpperCase() : "Q"}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[#3D2E28]">{query.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8A756C]">{query.email}</span>
                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="text-[11px] text-[#30457A] hover:underline cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Email"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={query.status} size="md" />
            <span className="text-xs text-[#8A756C]">
              {formatDate(query.created_at)}
            </span>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs font-bold text-[#8A756C] uppercase tracking-wider block mb-1">
            Subject
          </label>
          <p className="text-base font-semibold text-[#3D2E28]">
            {query.subject || "No Subject"}
          </p>
        </div>

        {/* Message Content */}
        <div>
          <label className="text-xs font-bold text-[#8A756C] uppercase tracking-wider block mb-1">
            Message
          </label>
          <div className="bg-[#FAF6F4] border border-[#E9E3DE] p-4 rounded-xl text-sm text-[#3D2E28] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
            {query.message}
          </div>
        </div>

        {/* Status Resolution Info */}
        {query.status === "resolved" && query.resolved_at && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Resolved on {formatDate(query.resolved_at)}</span>
          </div>
        )}

        {/* Actions & Status Switcher */}
        <div className="pt-4 border-t border-[#EAE1DA] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8A756C]">Update Status:</span>
            
            <button
              disabled={isPending || query.status === "pending"}
              onClick={() => handleStatusChange("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                query.status === "pending"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              Pending
            </button>

            <button
              disabled={isPending || query.status === "in_progress"}
              onClick={() => handleStatusChange("in_progress")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                query.status === "in_progress"
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-stone-100 text-stone-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              In Progress
            </button>

            <button
              disabled={isPending || query.status === "resolved"}
              onClick={() => handleStatusChange("resolved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                query.status === "resolved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              Resolved
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#FAF5F2] hover:bg-[#EFE6E0] text-[#6E4B42] text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-[#EAE1DA]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default QueryDetailModal;
