"use client";

import React from "react";

export interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden flex flex-col justify-between animate-pulse ${className}`}
    >
      {/* Image Area Skeleton */}
      <div className="relative h-48 w-full bg-stone-200 shrink-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-lg bg-stone-300/60" />
      </div>

      {/* Card Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category Pill */}
          <div className="w-20 h-3 bg-stone-200 rounded" />
          {/* Title */}
          <div className="w-3/4 h-4 bg-stone-200 rounded" />
          {/* SKU */}
          <div className="w-24 h-2.5 bg-stone-100 rounded" />
        </div>

        {/* Footer: Price + Stock */}
        <div className="pt-2 border-t border-[#F0E8E3] flex items-center justify-between">
          <div className="w-16 h-5 bg-stone-200 rounded" />
          <div className="w-20 h-3.5 bg-stone-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
