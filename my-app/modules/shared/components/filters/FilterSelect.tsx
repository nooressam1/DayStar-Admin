"use client";

import React from "react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: FilterOption[];
  containerClassName?: string;
  onValueChange?: (value: string) => void;
}

export function FilterSelect({
  options,
  children,
  className = "",
  containerClassName = "",
  value,
  onChange,
  onValueChange,
  ...props
}: FilterSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className={`relative shrink-0 ${containerClassName}`}>
      <select
        value={value}
        onChange={handleChange}
        className={`appearance-none bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm px-3.5 py-2 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium shadow-2xs transition-colors hover:bg-[#F4ECE7] ${className}`}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

export default FilterSelect;
