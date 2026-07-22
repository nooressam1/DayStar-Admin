"use client";

import React from "react";
import Link from "next/link";

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  backLink,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {backLink && (
        <div>
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7A6860] hover:text-[#4A352F] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {backLink.label}
          </Link>
        </div>
      )}

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${actions || backLink ? "border-b border-[#E9E3DE] pb-6" : ""}`}>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#583F37] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#7A6860] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
