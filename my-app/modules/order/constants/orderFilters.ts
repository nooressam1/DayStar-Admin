import { OrderStatus } from "@/enums";

export const ORDER_STATUS_OPTIONS = [
  { label: "All Statuses", value: "All Statuses" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Processing", value: OrderStatus.PROCESSING },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];
