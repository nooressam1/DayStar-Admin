"use client";

import React from "react";

export interface OrderFilterBarProps {
  status?: string;
  onStatusChange?: (status: string) => void;
  date?: string;
  onDateChange?: (date: string) => void;
  payment?: string;
  onPaymentChange?: (payment: string) => void;
  search?: string;
  onSearchChange?: (search: string) => void;
  className?: string;
}

export function OrderFilterBar({
  status = "All Statuses",
  onStatusChange,
  date = "",
  onDateChange,
  payment = "Payment: All",
  onPaymentChange,
  search = "",
  onSearchChange,
  className = "",
}: OrderFilterBarProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E9E3DE] p-3 shadow-xs flex flex-wrap items-center gap-3 ${className}`}
    >
      {/* Filters Badge */}
      <div className="flex items-center gap-2 bg-[#F0E6DF] text-[#4A3831] font-semibold text-sm px-4 py-2 rounded-xl shrink-0 select-none">
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
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filters</span>
      </div>

      {/* Vertical Divider */}
      <div className="hidden sm:block w-[1px] h-6 bg-[#EAE1DA] mx-0.5 shrink-0" />

      {/* Status Dropdown */}
      <div className="relative shrink-0">
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="appearance-none bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm px-3.5 py-2 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium"
        >
          <option value="All Statuses">All Statuses</option>
          <option value="SHIPPED">Shipped</option>
          <option value="PROCESSING">Processing</option>
          <option value="PENDING">Pending</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Date Input */}
      <div className="shrink-0">
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange?.(e.target.value)}
          className="bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium text-[#4A3831]"
        />
      </div>

      {/* Payment Dropdown */}
      <div className="relative shrink-0">
        <select
          value={payment}
          onChange={(e) => onPaymentChange?.(e.target.value)}
          className="appearance-none bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm px-3.5 py-2 pr-9 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#754E45] cursor-pointer font-medium"
        >
          <option value="Payment: All">Payment: All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
          <option value="Failed">Failed</option>
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A675E]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex-1 min-w-[180px]">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search ....."
          className="w-full bg-[#F9F5F2] border border-[#EBE3DE] text-[#4A3831] text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#754E45] placeholder-[#A08D84]"
        />
      </div>
    </div>
  );
}

export default OrderFilterBar;
