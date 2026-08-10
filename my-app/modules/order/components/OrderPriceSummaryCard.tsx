"use client";

import React from "react";
import { formatMoney } from "@/utils/format";
import { StatusBadge } from "@/modules/shared";

export interface OrderPriceSummaryCardProps {
  total?: number;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  paymentMethodText?: string;
  paymentStatus?: string;
  orderStatus?: string;
  status?: string; // fallback for orderStatus
  isRefunded?: boolean;
  className?: string;
}

export function OrderPriceSummaryCard({
  total,
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  paymentMethodText = "Cash on Delivery",
  paymentStatus,
  orderStatus,
  status = "Pending",
  isRefunded = false,
  className = "",
}: OrderPriceSummaryCardProps) {
  const calculatedTotal = total ?? (subtotal - discount + deliveryFee);
  const displaySubtotal = subtotal || calculatedTotal;
  const currentOrderStatus = orderStatus || status;
  const orderStatusUpper = (currentOrderStatus || "").toUpperCase();

  const isCOD =
    paymentMethodText.toLowerCase().includes("cash") ||
    paymentMethodText.toLowerCase().includes("cod");
  const isCard = !isCOD;

  // Resolved payment status logic:
  // - If order is explicitly Refunded -> "Refunded"
  // - If order is Cancelled:
  //     - Card payment (paid at checkout) -> "Refunded"
  //     - COD payment that was delivered/completed (was paid) -> "Refunded"
  //     - Unpaid COD payment -> "Cancelled"
  // - If order is Delivered/Completed -> "Paid"
  // - Active orders -> Card is "Paid", COD is "Pending"
  let resolvedPaymentStatus: string;

  if (orderStatusUpper === "REFUNDED") {
    resolvedPaymentStatus = "Refunded";
  } else if (orderStatusUpper === "CANCELLED") {
    if (isCard || isRefunded) {
      resolvedPaymentStatus = "Refunded";
    } else {
      resolvedPaymentStatus = "Cancelled";
    }
  } else if (orderStatusUpper === "DELIVERED" || orderStatusUpper === "COMPLETED") {
    resolvedPaymentStatus = "Paid";
  } else {
    resolvedPaymentStatus = paymentStatus || (isCard ? "Paid" : "Pending");
  }

  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs p-6 flex flex-col gap-6 ${className}`}>
      {/* Order Status Section (Above Price Summary) */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8A756C] mb-2">Order Status</h2>
        <div>
          <StatusBadge status={currentOrderStatus} />
        </div>
      </div>

      <hr className="border-t border-[#F0E8E3]" />

      {/* Price Summary Section */}
      <div>
        <h2 className="text-lg font-bold text-[#583F37] mb-4">Price Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-[#6E5B53]">
            <span>Sub Total</span>
            <span className="font-semibold text-[#3D2E28]">{formatMoney(displaySubtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-[#6E5B53]">
              <span>Discount</span>
              <span className="font-semibold text-[#3D2E28]">{formatMoney(discount)}</span>
            </div>
          )}
          {deliveryFee > 0 && (
            <div className="flex justify-between items-center text-[#6E5B53]">
              <span>Delivery fee</span>
              <span className="font-semibold text-[#3D2E28]">{formatMoney(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[#6E5B53] pt-1 border-t border-[#F5EFEA] mt-2">
            <span className="font-bold text-[#583F37]">Total Price</span>
            <span className="font-bold text-[#583F37] text-base">{formatMoney(calculatedTotal)}</span>
          </div>
        </div>
      </div>

      <hr className="border-t border-[#F0E8E3]" />

      {/* Payment Summary Section */}
      <div>
        <h2 className="text-lg font-bold text-[#583F37] mb-4">Payment Summary</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-[#8A756C] font-medium mb-1">Payment Method</p>
            <p className="font-semibold text-[#3D2E28]">{paymentMethodText}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#8A756C] font-medium mb-1">Payment Status</p>
            <div>
              <StatusBadge status={resolvedPaymentStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPriceSummaryCard;
