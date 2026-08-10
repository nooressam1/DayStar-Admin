"use client";

import React from "react";
import { TableColumn } from "./Table";

export interface TableSkeletonProps<T = any> {
  columns: TableColumn<T>[];
  rowCount?: number;
  className?: string;
}

export function TableSkeleton<T>({
  columns,
  rowCount = 5,
  className = "",
}: TableSkeletonProps<T>) {
  // Pre-calculated widths for realistic variance across rows
  const widthVariations = [
    ["w-24", "w-44", "w-20", "w-16", "w-28"],
    ["w-20", "w-36", "w-24", "w-20", "w-20"],
    ["w-28", "w-48", "w-16", "w-16", "w-32"],
    ["w-16", "w-40", "w-28", "w-24", "w-24"],
    ["w-24", "w-32", "w-20", "w-16", "w-28"],
  ];

  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => {
        const widths = widthVariations[rowIndex % widthVariations.length];
        return (
          <tr
            key={rowIndex}
            className={`animate-pulse border-b border-[#F0E8E3] last:border-b-0 ${className}`}
          >
            {columns.map((col, colIndex) => {
              const alignClass =
                col.align === "center"
                  ? "justify-center"
                  : col.align === "right"
                  ? "justify-end"
                  : "justify-start";

              const textWidth = widths[colIndex % widths.length];

              return (
                <td key={col.key || colIndex} className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${alignClass}`}>
                    {/* Render badge-style pill for status/action columns */}
                    {col.align === "right" || col.key?.toLowerCase().includes("status") || col.key?.toLowerCase().includes("action") ? (
                      <div className="w-16 h-6 bg-stone-200 rounded-full shrink-0" />
                    ) : colIndex === 0 ? (
                      /* Primary identifier column (e.g. ID, title) */
                      <div className={`h-4 bg-stone-200 rounded ${textWidth}`} />
                    ) : (
                      /* Standard cell column */
                      <div className={`h-3.5 bg-stone-200/80 rounded ${textWidth}`} />
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

export default TableSkeleton;
