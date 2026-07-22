"use client";

import React from "react";

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  helperText?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  containerClassName?: string;
}

export function TextInput({
  label,
  helperText,
  error,
  prefix,
  suffix,
  fullWidth = true,
  containerClassName = "",
  className = "",
  disabled,
  id,
  ...props
}: TextInputProps) {
  const generatedId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

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

      {/* Input Container with Prefix/Suffix */}
      <div className="relative flex items-center w-full">
        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#7A6860]">
            {prefix}
          </div>
        )}

        <input
          id={generatedId}
          disabled={disabled}
          className={`w-full text-sm border rounded-xl p-3 bg-white text-[#3D2E28] placeholder:text-[#8A756C] transition-all duration-150 outline-hidden ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-[#E9E3DE] focus:ring-2 focus:ring-[#004D5A]/30 focus:border-[#004D5A]"
          } ${prefix ? "pl-10" : ""} ${suffix ? "pr-10" : ""} ${
            disabled ? "bg-stone-100 opacity-60 cursor-not-allowed" : ""
          } ${className}`}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3.5 flex items-center text-sm font-semibold text-[#6E4B42]">
            {suffix}
          </div>
        )}
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

export default TextInput;
