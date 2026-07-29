"use client";

import React from "react";
import { Address, Profile } from "@/types";

export interface OrderCustomerDetailsCardProps {
  user?: Profile | null;
  address?: Address | null;
  fullName?: string;
  phoneNumber?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
    avatarInitials?: string;
    totalOrders?: number;
    customerSince?: string;
  };
  shippingAddress?: {
    recipient?: string;
    street: string;
    cityStateZip?: string;
    country: string;
  };
  className?: string;
}

export function OrderCustomerDetailsCard({
  user,
  address,
  fullName,
  phoneNumber,
  customer,
  shippingAddress,
  className = "",
}: OrderCustomerDetailsCardProps) {
  const name = user?.full_name || fullName || customer?.name || "Customer";
  const email = user?.email || customer?.email || "N/A";
  const phone = phoneNumber || customer?.phone || "N/A";

  const initials =
    user?.avatar_url
      ? undefined
      : name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "CU";

  const street = address?.street || shippingAddress?.street || "No street address specified";
  const cityStateZip = address
    ? [address.city, address.governorate || address.area, address.postal_code].filter(Boolean).join(", ")
    : shippingAddress?.cityStateZip || "";
  const country = address?.country || shippingAddress?.country || "United States";
  const recipient = address?.label ? `${name} (${address.label})` : shippingAddress?.recipient || name;

  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] shadow-xs p-6 flex flex-col gap-6 ${className}`}>
      {/* Card Header */}
      <h2 className="text-base font-bold text-[#583F37]">Customer Details</h2>

      {/* Customer Avatar & Meta Row */}
      <div className="flex items-center gap-3.5">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-[#583F37]">{name}</h3>
          <p className="text-xs text-[#8A756C] mt-0.5">
            {customer?.totalOrders ? `${customer.totalOrders} Orders · ` : ""}Verified Account
          </p>
        </div>
      </div>

      {/* Two-Column Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* USER DETAILS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E4B42] mb-3">
            CONTACT INFO
          </h4>
          <div className="space-y-2 text-sm text-[#6E5B53]">
            <p>
              Email: <span className="text-[#3D2E28] font-normal">{email}</span>
            </p>
            <p>
              Phone: <span className="text-[#3D2E28] font-normal">{phone}</span>
            </p>
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E4B42] mb-3">
            SHIPPING ADDRESS
          </h4>
          <div className="space-y-1 text-sm text-[#6E5B53]">
            {recipient && <p className="font-semibold text-[#3D2E28]">{recipient}</p>}
            <p>{street}</p>
            {cityStateZip && <p>{cityStateZip}</p>}
            <p>{country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCustomerDetailsCard;
