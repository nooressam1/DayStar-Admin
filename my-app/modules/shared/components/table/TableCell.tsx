"use client";

import React from "react";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function TableCell({
  children,
  align = "left",
  className = "",
  ...props
}: TableCellProps) {
  const getAlignmentClass = () => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <td
      className={`px-6 py-4 text-sm text-[#3D2E28] whitespace-nowrap ${getAlignmentClass()} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

export default TableCell;
