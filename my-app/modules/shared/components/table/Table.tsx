"use client";

import React from "react";
import { TableHeaderColumn } from "./TableHeaderColumn";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";
import { TableSkeleton } from "./TableSkeleton";

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

export type ColumnConfig<T> = TableColumn<T>;

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor?: (item: T, index: number) => string | number;
  onRowClick?: (item: T, index: number) => void;
  emptyText?: string;
  emptyIcon?: React.ReactNode;
  isLoading?: boolean;
  skeletonRowCount?: number;
  className?: string;
  containerClassName?: string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyText = "No records found.",
  emptyIcon,
  isLoading = false,
  skeletonRowCount = 5,
  className = "",
  containerClassName = "",
}: TableProps<T>) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden ${containerClassName}`}
    >
      <div className="overflow-x-auto">
        <table className={`w-full text-left border-collapse ${className}`}>
          <thead>
            <tr className="bg-[#FAF5F2] border-b border-[#E9E3DE]">
              {columns.map((col) => (
                <TableHeaderColumn
                  key={col.key}
                  label={col.header}
                  align={col.align}
                  className={col.headerClassName}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E8E3]">
            {isLoading ? (
              <TableSkeleton columns={columns} rowCount={skeletonRowCount} />
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => {
                const rowKey = keyExtractor
                  ? keyExtractor(row, rowIndex)
                  : (row as any).id || (row as any).key || rowIndex;

                return (
                  <TableRow
                    key={rowKey}
                    onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                    clickable={Boolean(onRowClick)}
                  >
                    {columns.map((col) => {
                      let cellContent: React.ReactNode = null;

                      if (typeof col.accessor === "function") {
                        cellContent = col.accessor(row, rowIndex);
                      } else if (col.accessor) {
                        cellContent = (row as any)[col.accessor];
                      } else {
                        cellContent = (row as any)[col.key];
                      }

                      // Safety guard: prevent rendering raw objects (e.g. {id, name})
                      // which causes React Minified Error #31
                      if (
                        cellContent !== null &&
                        cellContent !== undefined &&
                        typeof cellContent === "object" &&
                        !React.isValidElement(cellContent) &&
                        !Array.isArray(cellContent)
                      ) {
                        const obj = cellContent as unknown as Record<string, unknown>;
                        cellContent = String(
                          obj.name ?? obj.label ?? obj.title ?? JSON.stringify(obj)
                        );
                      }

                      return (
                        <TableCell
                          key={col.key}
                          align={col.align}
                          className={col.className}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-[#8A756C]"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {emptyIcon || (
                      <svg
                        className="w-8 h-8 text-[#A08D84]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    )}
                    <span>{emptyText}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
