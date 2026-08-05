"use client";

import React from "react";
import { formatMoney } from "@/utils/format";

export interface OrderPriceSummaryCardProps {
  total?: number;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  paymentMethodText?: string;
  paymentStatus?: string;
  status?: string;
  isRefunded?: boolean;
  className?: string;
}

export function OrderPriceSummaryCard({
  total,
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  paymentMethodText = "Cash on Delivery",
  paymentStatus = "Paid",
  status = "Processing",
  isRefunded = false,
  className = "",
}: OrderPriceSummaryCardProps) {
  const calculatedTotal = total ?? (subtotal - discount + deliveryFee);
  const displaySubtotal = subtotal || calculatedTotal;

  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs p-6 flex flex-col gap-6 ${className}`}>
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
          <div className="flex justify-between items-center text-[#6E5B53] pt-1">
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

          <div>
            <p className="text-xs text-[#8A756C] font-medium mb-1">Status</p>
            <p className="font-semibold text-[#3D2E28]">
              {isRefunded ? "Refunded" : status || paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPriceSummaryCard;
