"use client";

import React from "react";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  clickable?: boolean;
  className?: string;
}

export function TableRow({
  children,
  clickable = false,
  className = "",
  onClick,
  ...props
}: TableRowProps) {
  const isClickable = clickable || Boolean(onClick);

  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${
        isClickable ? "hover:bg-[#FAF6F4] cursor-pointer" : "hover:bg-[#FAF6F4]/50"
      } ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export default TableRow;
