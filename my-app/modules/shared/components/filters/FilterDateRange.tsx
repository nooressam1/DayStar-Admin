"use client";

import React from "react";
import { FilterDate } from "./FilterDate";

export interface FilterDateRangeProps {
  startDate?: string;
  onStartDateChange?: (date: string) => void;
  endDate?: string;
  onEndDateChange?: (date: string) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
}

export function FilterDateRange({
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  className = "",
}: FilterDateRangeProps) {
  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <FilterDate
        value={startDate}
        onValueChange={onStartDateChange}
        title="Start Date"
      />
      <span className="text-[#8A756C] text-xs font-semibold select-none">to</span>
      <FilterDate
        value={endDate}
        onValueChange={onEndDateChange}
        title="End Date"
      />
    </div>
  );
}

export default FilterDateRange;
