"use client";

import React from "react";

export interface TableHeaderColumnProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function TableHeaderColumn({
  children,
  label,
  align = "left",
  className = "",
  ...props
}: TableHeaderColumnProps) {
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
    <th
      className={`px-6 py-3.5 text-xs font-bold text-[#6E5B53] uppercase tracking-wider ${getAlignmentClass()} ${className}`}
      {...props}
    >
      {label ?? children}
    </th>
  );
}

export default TableHeaderColumn;
