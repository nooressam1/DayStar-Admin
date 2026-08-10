"use client";

import React from "react";
import Link from "next/link";

import { OrderStatus } from "@/enums";
import { getInitials } from "@/utils/format";

import { StatusBadge } from "./StatusBadge";

export interface RecentOrderItem {
  id: string;
  customerName: string;
  customerInitials?: string;
  status: OrderStatus;
  amount: string;
}

export interface RecentOrdersTableProps {
  title?: string;
  viewAllHref?: string;
  orders?: RecentOrderItem[];
  isLoading?: boolean;
  className?: string;
}

export function RecentOrdersTable({
  title = "Recent Orders",
  viewAllHref = "/order",
  orders = [],
  isLoading = false,
  className = "",
}: RecentOrdersTableProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden ${className}`}>
      {/* Header Row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9E3DE] bg-white">
        <h3 className="text-base font-bold text-[#3D2E28]">{title}</h3>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[#30457A] hover:text-[#1E2E57] hover:underline transition-colors"
        >
          View All Orders
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF5F2] border-b border-[#E9E3DE]">
              <th className="px-6 py-3.5 text-xs font-bold text-[#6E5B53] uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#6E5B53] uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#6E5B53] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#6E5B53] uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E8E3]">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="w-20 h-4 bg-stone-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0" />
                      <div className="w-32 h-4 bg-stone-200 rounded" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-6 bg-stone-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-4 bg-stone-200 rounded" />
                  </td>
                </tr>
              ))
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#FAF6F4] transition-colors"
                >
                  {/* Order ID */}
                  <td className="px-6 py-4 text-sm font-medium text-[#3D2E28] whitespace-nowrap">
                    {order.id}
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4 text-sm text-[#3D2E28] whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(order.customerName, order.customerInitials)}
                      </div>
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} size="sm" />
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-sm font-semibold text-[#3D2E28] whitespace-nowrap">
                    {order.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;
