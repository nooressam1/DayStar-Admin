"use client";

import React from "react";
import { Dropdown } from "@/modules/shared";

export interface BulkUpdateNoteCardProps {
  enabled?: boolean;
  onToggleSection?: (enabled: boolean) => void;
  bulkNote: string;
  onBulkNoteChange: (val: string) => void;
}

export function BulkUpdateNoteCard({
  enabled = false,
  onToggleSection,
  bulkNote,
  onBulkNoteChange,
}: BulkUpdateNoteCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all duration-200 ${
        enabled
          ? "bg-white border-[#E9E3DE]"
          : "bg-stone-50/70 border-dashed border-[#CBD5E1] opacity-75"
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
          <h3 className={`text-base font-bold transition-colors ${enabled ? "text-[#2A1E1A]" : "text-[#8A756C]"}`}>
            Bulk Update Note
          </h3>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggleSection?.(e.target.checked)}
              className="w-4 h-4 rounded border-[#E9E3DE] text-[#004956] focus:ring-[#004956] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#004956]">
              {enabled ? "Selected" : "Select to Edit"}
            </span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-[#6E5B53] mb-1.5">
            Notes
          </label>
          <Dropdown
            disabled={!enabled}
            value={bulkNote}
            onChange={(e) => onBulkNoteChange(e.target.value)}
            options={[
              "....",
              "Seasonal Price Adjustment",
              "Inventory Restock Batch",
              "Promotional Sale Update",
            ]}
          />
        </div>
      </div>

      <p className="text-xs text-[#8A756C] mt-4">
        Add note to track big bulk updates
      </p>
    </div>
  );
}
