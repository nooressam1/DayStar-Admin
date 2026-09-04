"use client";

import React from "react";

export interface FilterDividerProps {
  className?: string;
}

export function FilterDivider({ className = "" }: FilterDividerProps) {
  return (
    <div
      className={`hidden sm:block w-[1px] h-6 bg-[#EAE1DA] mx-0.5 shrink-0 ${className}`}
    />
  );
}

export default FilterDivider;
