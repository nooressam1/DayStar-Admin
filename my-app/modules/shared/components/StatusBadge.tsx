"use client";

import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple";

export type BadgeSize = "sm" | "md" | "lg";

export interface StatusBadgeProps {
  status?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  label?: string;
  dot?: boolean;
  className?: string;
}

/**
 * Maps a status string to its standard visual variant style
 */

export function getVariantFromStatus(status?: string): BadgeVariant {
  if (!status) return "neutral";
  const normalized = status.trim().toUpperCase();

  switch (normalized) {
    case "ACTIVE":
    case "PAID":
    case "DELIVERED":
    case "COMPLETED":
    case "SHIPPED":
    case "IN STOCK":
    case "PUBLISHED":
      return "success";

    case "PROCESSING":
    case "SCHEDULED":
    case "IN PROGRESS":
      return "info";

    case "PENDING":
    case "DRAFT":
    case "UNFULFILLED":
    case "LOW STOCK":
      return "warning";

    case "CANCELLED":
    case "REFUNDED":
    case "FAILED":
    case "EXPIRED":
    case "OUT OF STOCK":
      return "danger";

    case "INACTIVE":
    case "ARCHIVED":
    case "DISABLED":
    default:
      return "neutral";
  }
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#80F2C5]/20 text-[#044E35] border border-[#50E3C2]/40",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  warning: "bg-amber-50 text-amber-800 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  neutral: "bg-stone-100 text-stone-600 border border-stone-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-[#044E35]",
  info: "bg-blue-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  neutral: "bg-stone-400",
  purple: "bg-purple-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2.5 py-0.5 font-semibold",
  md: "text-xs px-3 py-1 font-semibold",
  lg: "text-xs sm:text-sm px-4 py-1.5 font-semibold",
};

export function StatusBadge({
  status,
  variant,
  size = "md",
  label,
  dot = false,
  className = "",
}: StatusBadgeProps) {
  const activeVariant = variant || getVariantFromStatus(status);
  const displayText = label || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider transition-colors shrink-0 ${variantStyles[activeVariant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[activeVariant]}`}
        />
      )}
      <span>{displayText}</span>
    </span>
  );
}

export default StatusBadge;
