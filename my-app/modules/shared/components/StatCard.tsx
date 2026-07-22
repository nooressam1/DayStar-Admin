"use client";

import React from "react";
import Link from "next/link";

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  showSparkline?: boolean;
  progressPercentage?: number;
  actionLink?: {
    text: string;
    href: string;
  };
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  showSparkline = false,
  progressPercentage,
  actionLink,
  children,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-[#E9E3DE] shadow-xs flex flex-col justify-between min-h-[128px] ${className}`}
    >
      <div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C766E] block mb-1">
          {title}
        </span>
        <p className="text-2xl font-bold text-[#1E293B] tracking-tight">
          {value}
        </p>
      </div>

      <div className="mt-3">
        {/* Custom children if passed */}
        {children ? (
          children
        ) : change ? (
          /* Trend & Sparkline */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#157F5D]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M7 17L17 7M17 7H9M17 7V15"
                />
              </svg>
              <span>{change}</span>
            </div>
            {showSparkline && (
              <svg
                className="w-16 h-6 stroke-[#2D7D6B] overflow-visible"
                fill="none"
                viewBox="0 0 60 20"
              >
                <path
                  d="M 2 15 C 10 17, 18 18, 26 14 C 34 10, 42 4, 58 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ) : progressPercentage !== undefined ? (
          /* Progress Bar */
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#EEF4FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#006B4D] rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[#64748B]">
              {progressPercentage}%
            </span>
          </div>
        ) : actionLink ? (
          /* Action Link */
          <div>
            <Link
              href={actionLink.href}
              className="text-xs font-semibold text-[#C84A4A] underline underline-offset-3 hover:text-[#B33B3B] transition-colors inline-flex items-center gap-1"
            >
              {actionLink.text} &rarr;
            </Link>
          </div>
        ) : (
          /* Spacer for visual consistency */
          <div className="h-4" />
        )}
      </div>
    </div>
  );
}

export default StatCard;
