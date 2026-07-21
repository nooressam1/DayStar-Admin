"use client";

import React from "react";
import Link from "next/link";

export type OrderStatus = "SHIPPED" | "PROCESSING" | "PENDING" | "CANCELLED" | "DELIVERED";

export interface OrderItem {
  id: string;
  customerName: string;
  customerInitials?: string;
  status: OrderStatus;
  amount: string;
}

export interface RecentOrdersTableProps {
  title?: string;
  viewAllHref?: string;
  orders?: OrderItem[];
  className?: string;
}

const defaultOrders: OrderItem[] = [
  {
    id: "#ORD-88210",
    customerName: "Jane Doe",
    customerInitials: "JD",
    status: "SHIPPED",
    amount: "$1,240.00",
  },
  {
    id: "#ORD-88209",
    customerName: "Marcus Smith",
    customerInitials: "MS",
    status: "PROCESSING",
    amount: "$320.50",
  },
  {
    id: "#ORD-88208",
    customerName: "Laura Reed",
    customerInitials: "LR",
    status: "PENDING",
    amount: "$89.00",
  },
  {
    id: "#ORD-88207",
    customerName: "Chris Kim",
    customerInitials: "CK",
    status: "SHIPPED",
    amount: "$2,100.99",
  },
];

export function RecentOrdersTable({
  title = "Recent Orders",
  viewAllHref = "/order",
  orders = defaultOrders,
  className = "",
}: RecentOrdersTableProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "SHIPPED":
      case "DELIVERED":
        return "bg-[#80F2C5] text-[#085C3A]";
      case "PROCESSING":
        return "bg-[#D6E2FF] text-[#2546A3]";
      case "PENDING":
        return "bg-[#FFE0E0] text-[#A62424]";
      case "CANCELLED":
        return "bg-[#E2E8F0] text-[#475569]";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const getInitials = (name: string, fallbackInitials?: string) => {
    if (fallbackInitials) return fallbackInitials;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
            {orders.map((order) => (
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
                  <span
                    className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-sm font-semibold text-[#3D2E28] whitespace-nowrap">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;
