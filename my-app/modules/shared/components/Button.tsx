"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "danger-outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  // Variant styles matching store theme (#004D5A dark teal, #583F37 dark brown)
  const variantStyles = {
    primary:
      "bg-[#004D5A] hover:bg-[#003B46] text-white shadow-xs focus:ring-2 focus:ring-[#004D5A]/40",
    secondary:
      "bg-white border border-[#D1C7BD] text-[#583F37] hover:bg-[#FAF5F2] focus:ring-2 focus:ring-[#583F37]/20",
    danger:
      "bg-[#C53030] hover:bg-[#9B2C2C] text-white shadow-xs focus:ring-2 focus:ring-red-500/40",
    "danger-outline":
      "bg-white border border-[#E53E3E] text-[#C53030] hover:bg-red-50 focus:ring-2 focus:ring-red-500/20",
    ghost:
      "bg-transparent text-[#583F37] hover:bg-[#FAF5F2] focus:ring-2 focus:ring-[#583F37]/20",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg font-medium",
    md: "px-4 py-2.5 text-sm gap-2 rounded-xl font-medium",
    lg: "px-6 py-3 text-base gap-2.5 rounded-xl font-bold",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer active:scale-[0.98]";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-150 outline-hidden select-none shrink-0 ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
}

export default Button;
