"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, OrderFilterBar, Pagination } from "@/modules/shared";
import { Order } from "@/types";

export interface OrderRecord extends Partial<Order> {
  id: string;
  customerName: string;
  customerInitials: string;
  date: string;
  status: any;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed";
  amount: string;
}

const sampleOrders: OrderRecord[] = [
  {
    id: "#ORD-88210",
    customerName: "Jane Doe",
    customerInitials: "JD",
    date: "2026-07-21",
    status: "SHIPPED",
    paymentStatus: "Paid",
    amount: "$1,240.00",
  },
  {
    id: "#ORD-88209",
    customerName: "Marcus Smith",
    customerInitials: "MS",
    date: "2026-07-20",
    status: "PROCESSING",
    paymentStatus: "Paid",
    amount: "$320.50",
  },
  {
    id: "#ORD-88208",
    customerName: "Laura Reed",
    customerInitials: "LR",
    date: "2026-07-19",
    status: "PENDING",
    paymentStatus: "Pending",
    amount: "$89.00",
  },
  {
    id: "#ORD-88207",
    customerName: "Chris Kim",
    customerInitials: "CK",
    date: "2026-07-18",
    status: "SHIPPED",
    paymentStatus: "Paid",
    amount: "$2,100.99",
  },
  {
    id: "#ORD-88206",
    customerName: "Sophia Patel",
    customerInitials: "SP",
    date: "2026-07-17",
    status: "DELIVERED",
    paymentStatus: "Paid",
    amount: "$540.00",
  },
  {
    id: "#ORD-88205",
    customerName: "Alexander Wright",
    customerInitials: "AW",
    date: "2026-07-16",
    status: "CANCELLED",
    paymentStatus: "Refunded",
    amount: "$150.00",
  },
];

export function OrderPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Payment: All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalItems = 1248;
  const totalPages = 250;

  const filteredOrders = sampleOrders.filter((order) => {
    if (statusFilter !== "All Statuses" && order.status !== statusFilter) {
      return false;
    }
    if (paymentFilter !== "Payment: All" && order.paymentStatus !== paymentFilter) {
      return false;
    }
    if (dateFilter && order.date !== dateFilter) {
      return false;
    }
    if (
      searchQuery &&
      !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderRecord["status"]) => {
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders Management"
        subtitle="Monitor customer transactions, order status, and payment history."
      />

      {/* Filter Bar Component */}
      <OrderFilterBar
        status={statusFilter}
        onStatusChange={setStatusFilter}
        date={dateFilter}
        onDateChange={setDateFilter}
        payment={paymentFilter}
        onPaymentChange={setPaymentFilter}
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden">
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
                  Date
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#6E5B53] uppercase tracking-wider">
                  Payment
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const cleanId = order.id.replace("#", "");
                  return (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/order/${cleanId}`)}
                      className="hover:bg-[#FAF6F4] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#3D2E28] whitespace-nowrap">
                        <Link
                          href={`/order/${cleanId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#6E4B42] font-semibold hover:underline"
                        >
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#3D2E28] whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-xs flex items-center justify-center shrink-0">
                            {order.customerInitials}
                          </div>
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8A756C] whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#4A3831] whitespace-nowrap">
                        {order.paymentStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#3D2E28] whitespace-nowrap">
                        {order.amount}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#8A756C]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemLabel="orders"
        />
      </div>
    </div>
  );
}

export default OrderPage;
