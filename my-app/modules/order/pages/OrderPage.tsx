"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Filter, FilterConfig, Table, ColumnConfig, Pagination } from "@/modules/shared";
import { OrderStatus, PaymentStatus } from "@/enums";

export interface OrderRecord {
  id: string;
  customerName: string;
  customerInitials: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus | string;
  amount: string;
}

const sampleOrders: OrderRecord[] = [
  {
    id: "#ORD-88210",
    customerName: "Jane Doe",
    customerInitials: "JD",
    date: "2026-07-21",
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    amount: "$1,240.00",
  },
  {
    id: "#ORD-88209",
    customerName: "Marcus Smith",
    customerInitials: "MS",
    date: "2026-07-20",
    status: OrderStatus.PROCESSING,
    paymentStatus: PaymentStatus.PAID,
    amount: "$320.50",
  },
  {
    id: "#ORD-88208",
    customerName: "Laura Reed",
    customerInitials: "LR",
    date: "2026-07-19",
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    amount: "$89.00",
  },
  {
    id: "#ORD-88207",
    customerName: "Chris Kim",
    customerInitials: "CK",
    date: "2026-07-18",
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    amount: "$2,100.99",
  },
  {
    id: "#ORD-88206",
    customerName: "Sophia Patel",
    customerInitials: "SP",
    date: "2026-07-17",
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    amount: "$540.00",
  },
  {
    id: "#ORD-88205",
    customerName: "Alexander Wright",
    customerInitials: "AW",
    date: "2026-07-16",
    status: OrderStatus.CANCELLED,
    paymentStatus: PaymentStatus.REFUNDED,
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
      case OrderStatus.SHIPPED:
      case OrderStatus.DELIVERED:
        return "bg-[#80F2C5] text-[#085C3A]";
      case OrderStatus.PROCESSING:
        return "bg-[#D6E2FF] text-[#2546A3]";
      case OrderStatus.PENDING:
        return "bg-[#FFE0E0] text-[#A62424]";
      case OrderStatus.CANCELLED:
        return "bg-[#E2E8F0] text-[#475569]";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const orderConfig: FilterConfig[] = [
    {
      key: "status",
      type: "select",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "All Statuses", value: "All Statuses" },
        { label: "Shipped", value: OrderStatus.SHIPPED },
        { label: "Processing", value: OrderStatus.PROCESSING },
        { label: "Pending", value: OrderStatus.PENDING },
        { label: "Delivered", value: OrderStatus.DELIVERED },
        { label: "Cancelled", value: OrderStatus.CANCELLED },
      ],
    },
    {
      key: "date",
      type: "date",
      value: dateFilter,
      onChange: setDateFilter,
    },
    {
      key: "payment",
      type: "select",
      value: paymentFilter,
      onChange: setPaymentFilter,
      options: [
        { label: "Payment: All", value: "Payment: All" },
        { label: "Paid", value: PaymentStatus.PAID },
        { label: "Pending", value: PaymentStatus.PENDING },
        { label: "Refunded", value: PaymentStatus.REFUNDED },
        { label: "Failed", value: PaymentStatus.FAILED },
      ],
    },
    {
      key: "search",
      type: "search",
      value: searchQuery,
      onChange: setSearchQuery,
      placeholder: "Search orders...",
    },
  ];

  const orderColumns: ColumnConfig<OrderRecord>[] = [
    {
      key: "id",
      header: "Order ID",
      accessor: (order) => {
        const cleanId = order.id.replace("#", "");
        return (
          <Link
            href={`/order/${cleanId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[#6E4B42] font-semibold hover:underline"
          >
            {order.id}
          </Link>
        );
      },
    },
    {
      key: "customerName",
      header: "Customer",
      accessor: (order) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-xs flex items-center justify-center shrink-0">
            {order.customerInitials}
          </div>
          <span className="font-medium">{order.customerName}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      accessor: "date",
      className: "text-[#8A756C]",
    },
    {
      key: "paymentStatus",
      header: "Payment",
      accessor: "paymentStatus",
      className: "font-medium text-[#4A3831]",
    },
    {
      key: "status",
      header: "Status",
      accessor: (order) => (
        <span
          className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(
            order.status
          )}`}
        >
          {order.status}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      accessor: "amount",
      className: "font-semibold text-[#3D2E28]",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders Management"
        subtitle="Monitor customer transactions, order status, and payment history."
      />

      {/* Universal Reusable Filter Component */}
      <Filter config={orderConfig} />

      {/* Declarative Table Component with Column Config */}
      <div className="space-y-0">
        <Table
          data={filteredOrders}
          columns={orderColumns}
          keyExtractor={(order) => order.id}
          onRowClick={(order) => router.push(`/order/${order.id.replace("#", "")}`)}
          emptyText="No orders match your filter criteria."
        />

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
