"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export interface FilterSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onSearchChange?: (query: string) => void;
  containerClassName?: string;
  debounceMs?: number;
}

export function FilterSearch({
  value,
  onSearchChange,
  onChange,
  placeholder = "Search...",
  className = "",
  containerClassName = "",
  debounceMs = 350,
  ...props
}: FilterSearchProps) {
  const [localValue, setLocalValue] = useState<string>(value ?? "");
  const debouncedValue = useDebounce(localValue, debounceMs);

  // Synchronize localValue when external prop changes (e.g. filter reset or URL change)
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // Trigger search change callback only when debounced value changes
  useEffect(() => {
    if (debouncedValue !== (value ?? "")) {
      onSearchChange?.(debouncedValue);
    }
  }, [debouncedValue, onSearchChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={`relative flex-1 min-w-[180px] ${containerClassName}`}>
      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8A81]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm pl-9 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#754E45] placeholder-[#A08D84] font-medium shadow-2xs ${className}`}
        {...props}
      />
    </div>
  );
}

export default FilterSearch;
