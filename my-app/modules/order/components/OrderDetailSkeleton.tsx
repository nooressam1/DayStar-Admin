"use client";

import React from "react";

export interface OrderDetailSkeletonProps {
  className?: string;
}

export function OrderDetailSkeleton({ className = "" }: OrderDetailSkeletonProps) {
  return (
    <div className={`flex flex-col gap-6 pb-12 animate-pulse ${className}`}>
      {/* ── Page Header Skeleton ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Back link skeleton */}
          <div className="w-28 h-4 bg-[#E9E3DE] rounded-md" />
          {/* Title + Status Badge skeleton */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-48 h-8 bg-stone-200 rounded-lg" />
            <div className="w-24 h-6 bg-stone-200 rounded-full" />
          </div>
          {/* Subtitle skeleton */}
          <div className="w-64 h-4 bg-[#E9E3DE] rounded-md" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-36 h-10 bg-stone-200 rounded-xl" />
          <div className="w-36 h-10 bg-stone-200 rounded-xl" />
        </div>
      </div>

      {/* ── Main Grid Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Section: Ordered Items Table Skeleton (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden">
          {/* Card Header Skeleton */}
          <div className="px-6 py-4 border-b border-[#F0E8E3] flex items-center justify-between">
            <div className="w-32 h-5 bg-stone-200 rounded-md" />
            <div className="w-16 h-4 bg-stone-100 rounded-md" />
          </div>

          {/* Items List Skeleton */}
          <div className="divide-y divide-[#F0E8E3]">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Item Image Skeleton */}
                  <div className="w-14 h-14 rounded-xl bg-stone-200 shrink-0" />
                  <div className="space-y-2 flex-1 max-w-xs">
                    {/* Item Name */}
                    <div className="w-3/4 h-4 bg-stone-200 rounded" />
                    {/* Variant / SKU */}
                    <div className="w-1/2 h-3 bg-stone-100 rounded" />
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="text-right space-y-1.5 shrink-0">
                  <div className="w-16 h-4 bg-stone-200 rounded ml-auto" />
                  <div className="w-12 h-3 bg-stone-100 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Price & Payment Summary Card Skeleton (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-5">
          <div className="w-36 h-5 bg-stone-200 rounded-md pb-2" />

          {/* Breakdown Lines */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 bg-stone-100 rounded" />
              <div className="w-16 h-4 bg-stone-200 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-stone-100 rounded" />
              <div className="w-14 h-4 bg-stone-200 rounded" />
            </div>
          </div>

          {/* Total Divider */}
          <div className="pt-4 border-t border-[#F0E8E3] flex items-center justify-between">
            <div className="w-20 h-5 bg-stone-200 rounded" />
            <div className="w-24 h-6 bg-stone-300 rounded" />
          </div>

          {/* Payment Method Badge Skeleton */}
          <div className="pt-4 border-t border-[#F0E8E3] space-y-2">
            <div className="w-28 h-3 bg-stone-100 rounded" />
            <div className="w-36 h-7 bg-[#FAF5F2] border border-[#E9E3DE] rounded-xl" />
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Customer Information Card Skeleton ── */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-6">
        <div className="w-44 h-5 bg-stone-200 rounded-md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Customer Details Skeleton */}
          <div className="flex items-start gap-4">
            {/* Avatar Skeleton */}
            <div className="w-12 h-12 rounded-full bg-stone-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-36 h-4 bg-stone-200 rounded" />
              <div className="w-48 h-3.5 bg-stone-100 rounded" />
              <div className="w-32 h-3.5 bg-stone-100 rounded" />
            </div>
          </div>

          {/* Shipping Address Skeleton */}
          <div className="space-y-2 md:border-l md:border-[#F0E8E3] md:pl-6">
            <div className="w-32 h-4 bg-stone-200 rounded mb-3" />
            <div className="w-full h-3.5 bg-stone-100 rounded" />
            <div className="w-3/4 h-3.5 bg-stone-100 rounded" />
            <div className="w-1/2 h-3.5 bg-stone-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailSkeleton;
