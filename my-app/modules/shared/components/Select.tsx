"use client";

import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: (string | SelectOption)[];
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

export function Select({
  label,
  options = [],
  helperText,
  error,
  fullWidth = true,
  containerClassName = "",
  className = "",
  disabled,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}

      {/* Select Container with Caret Icon */}
      <div className="relative w-full">
        <select
          id={generatedId}
          disabled={disabled}
          className={`w-full text-sm border rounded-xl p-3 bg-white text-[#3D2E28] appearance-none cursor-pointer pr-10 transition-all duration-150 outline-hidden ${error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-[#E9E3DE] focus:ring-2 focus:ring-[#004D5A]/30 focus:border-[#004D5A]"
            } ${disabled ? "bg-stone-100 opacity-60 cursor-not-allowed" : ""} ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => {
              if (typeof opt === "string") {
                return (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                );
              }
              return (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              );
            })
            : children}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Helper Text or Error Message */}
      {error ? (
        <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#7A6860] mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
}

export const Dropdown = Select;
export type DropdownProps = SelectProps;
export default Select;
