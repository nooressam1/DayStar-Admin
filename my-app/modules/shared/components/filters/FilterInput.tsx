"use client";

import React from "react";

export interface FilterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  onValueChange?: (value: string) => void;
}

export function FilterInput({
  className = "",
  containerClassName = "",
  value,
  onChange,
  onValueChange,
  ...props
}: FilterInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className={`shrink-0 ${containerClassName}`}>
      <input
        value={value ?? ""}
        onChange={handleChange}
        className={`bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium shadow-2xs transition-colors hover:bg-[#F4ECE7] ${className}`}
        {...props}
      />
    </div>
  );
}

export default FilterInput;
