"use client";

import React from "react";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  totalOrders: number;
  customerSince?: string;
}

export interface ShippingAddressInfo {
  recipient?: string;
  street: string;
  cityStateZip: string;
  country: string;
}

export interface OrderCustomerDetailsCardProps {
  customer: CustomerInfo;
  shippingAddress: ShippingAddressInfo;
  className?: string;
}

export function OrderCustomerDetailsCard({
  customer,
  shippingAddress,
  className = "",
}: OrderCustomerDetailsCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs p-6 flex flex-col gap-6 ${className}`}>
      {/* Card Header */}
      <h2 className="text-base font-bold text-[#583F37]">Customer</h2>

      {/* Customer Avatar & Meta Row */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-sm flex items-center justify-center shrink-0">
          {customer.avatarInitials}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#583F37]">{customer.name}</h3>
          <p className="text-xs text-[#8A756C] mt-0.5">
            {customer.totalOrders} Orders · Customer since {customer.customerSince || "2021"}
          </p>
        </div>
      </div>

      {/* Two-Column Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* USER DETAILS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E4B42] mb-3">
            USER DETAILS
          </h4>
          <div className="space-y-2 text-sm text-[#6E5B53]">
            <p>
              Email: <span className="text-[#3D2E28] font-normal">{customer.email}</span>
            </p>
            <p>
              Phone Number: <span className="text-[#3D2E28] font-normal">{customer.phone}</span>
            </p>
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E4B42] mb-3">
            SHIPPING ADDRESS
          </h4>
          <div className="space-y-1 text-sm text-[#6E5B53]">
            {shippingAddress.recipient && (
              <p className="font-semibold text-[#3D2E28]">{shippingAddress.recipient}</p>
            )}
            <p>{shippingAddress.street}</p>
            <p>{shippingAddress.cityStateZip}</p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCustomerDetailsCard;
