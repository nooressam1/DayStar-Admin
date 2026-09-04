"use client";

import React from "react";
import Link from "next/link";
import { ColumnConfig, StatusBadge, formatDate, getInitials, formatMoney } from "@/modules/shared";
import { Order } from "@/types";

export const OrderNumberCell = React.memo(({ order }: { order: Order }) => (
  <Link
    href={`/order/${order.id}`}
    onClick={(e) => e.stopPropagation()}
    className="text-[#6E4B42] font-semibold hover:underline"
  >
    #{order.order_number}
  </Link>
));
OrderNumberCell.displayName = "OrderNumberCell";

export const CustomerCell = React.memo(({ order }: { order: Order }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-xs flex items-center justify-center shrink-0">
      {getInitials(order.full_name)}
    </div>
    <div className="flex flex-col">
      <span className="font-medium">{order.full_name || "—"}</span>
      {order.phone_number && (
        <span className="text-xs text-[#8A756C]">{order.phone_number}</span>
      )}
    </div>
  </div>
));
CustomerCell.displayName = "CustomerCell";

export const StatusBadgeCell = React.memo(({ order }: { order: Order }) => (
  <StatusBadge status={order.status} size="md" />
));
StatusBadgeCell.displayName = "StatusBadgeCell";

export const orderColumns: ColumnConfig<Order>[] = [
  {
    key: "order_number",
    header: "Order #",
    accessor: (order: Order) => <OrderNumberCell order={order} />,
  },
  {
    key: "full_name",
    header: "Customer",
    accessor: (order: Order) => <CustomerCell order={order} />,
  },
  {
    key: "created_at",
    header: "Date",
    accessor: (order: Order) => formatDate(order.created_at),
    className: "text-[#8A756C]",
  },
  {
    key: "Order_status",
    header: "Order Status",
    accessor: (order: Order) => <StatusBadgeCell order={order} />,
  },
  {
    key: "total",
    header: "Amount",
    accessor: (order: Order) => formatMoney(order.total),
    className: "font-semibold text-[#3D2E28]",
  },
];
