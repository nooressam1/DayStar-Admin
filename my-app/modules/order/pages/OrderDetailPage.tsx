"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, Modal } from "@/modules/shared";
import { Order, OrderItem as DBOrderItem, Address, Profile } from "@/types";

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetailData {
  id: string;
  placedDate: string;
  source: string;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed" | "Unpaid";
  fulfillmentStatus: "Shipped" | "Processing" | "Delivered" | "Cancelled" | "Pending";
  paymentMethodText: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatarInitials: string;
    totalOrders: number;
    customerSince?: string;
  };
  shippingAddress: {
    recipient: string;
    street: string;
    cityStateZip: string;
    country: string;
  };
  billingAddress: {
    recipient: string;
    street: string;
    cityStateZip: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalPrice: number;
}

const sampleItems: OrderItem[] = [
  {
    id: "item-1",
    name: "Apex Pro Keyboard",
    subtitle: "Switch: OmniPoint 2.0",
    sku: "KB-APX-PRO",
    price: 199.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "item-2",
    name: "QcK Heavy XL",
    subtitle: "Size: Extra Large",
    sku: "MP-QCK-XL",
    price: 29.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "item-3",
    name: "Coiled USB-C Cable",
    subtitle: "Color: Midnight Black",
    sku: "CB-CLD-BLK",
    price: 35.00,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
  },
];

const mockOrderDetails: Record<string, OrderDetailData> = {
  "MH-98421": {
    id: "#MH-98421",
    placedDate: "October 24, 2023 at 2:14 PM",
    source: "Website",
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    paymentMethodText: "Cash On deliver",
    customer: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 0123-4567",
      avatarInitials: "JD",
      totalOrders: 12,
      customerSince: "2021",
    },
    shippingAddress: {
      recipient: "Jane Doe",
      street: "123 Industrial Way, Suite 400",
      cityStateZip: "San Francisco, CA 94103",
      country: "United States",
    },
    billingAddress: {
      recipient: "Jane Doe",
      street: "123 Industrial Way, Suite 400",
      cityStateZip: "San Francisco, CA 94103",
      country: "United States",
    },
    items: sampleItems,
    subtotal: 252.00,
    discount: 23.00,
    deliveryFee: 54.00,
    totalPrice: 283.00,
  },
};

const defaultOrder: OrderDetailData = {
  id: "#MH-98421",
  placedDate: "October 24, 2023 at 2:14 PM",
  source: "Website",
  paymentStatus: "Paid",
  fulfillmentStatus: "Shipped",
  paymentMethodText: "Cash On deliver",
  customer: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 0123-4567",
    avatarInitials: "JD",
    totalOrders: 12,
    customerSince: "2021",
  },
  shippingAddress: {
    recipient: "Jane Doe",
    street: "123 Industrial Way, Suite 400",
    cityStateZip: "San Francisco, CA 94103",
    country: "United States",
  },
  billingAddress: {
    recipient: "Jane Doe",
    street: "123 Industrial Way, Suite 400",
    cityStateZip: "San Francisco, CA 94103",
    country: "United States",
  },
  items: sampleItems,
  subtotal: 252.00,
  discount: 23.00,
  deliveryFee: 54.00,
  totalPrice: 283.00,
};

export function OrderDetailPage({ orderId: propOrderId }: { orderId?: string }) {
  const params = useParams();
  const rawId = propOrderId || (params?.id as string) || "MH-98421";
  const cleanId = rawId.replace("%23", "").replace("#", "");

  const orderData = mockOrderDetails[cleanId] || {
    ...defaultOrder,
    id: cleanId.startsWith("ORD-") || cleanId.startsWith("MH-") ? `#${cleanId}` : `#${cleanId.toUpperCase()}`,
  };

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isRefunded, setIsRefunded] = useState(orderData.paymentStatus === "Refunded");

  const handlePrintPackingSlip = () => {
    window.print();
  };

  const handleConfirmRefund = () => {
    setIsRefunded(true);
    setShowRefundModal(false);
  };

  const totalItemsCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Navigation Back Link */}
      <div>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7A6860] hover:text-[#4A352F] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </Link>
      </div>

      {/* Main Order Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-[#E9E3DE] pb-6">
        {/* Left Side: Order Title, Badges, and Subtitle */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center flex-wrap gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#583F37]">
              Order {orderData.id}
            </h1>

            {/* Badges */}
            <span
              className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${isRefunded
                  ? "bg-red-100 text-red-800"
                  : orderData.paymentStatus === "Paid"
                    ? "bg-[#50E3C2] text-[#044E35]"
                    : "bg-amber-100 text-amber-800"
                }`}
            >
              {isRefunded ? "Refunded" : orderData.paymentStatus}
            </span>

            <span className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-[#E0E7FF] text-[#3730A3]">
              {orderData.fulfillmentStatus}
            </span>
          </div>

          <p className="text-sm text-[#7A6860]">
            Placed on {orderData.placedDate} from {orderData.source}
          </p>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrintPackingSlip}
            className="px-4 py-2 text-sm font-medium text-[#583F37] border border-[#8C7A70] rounded-xl hover:bg-[#F5EFEA] transition-colors flex items-center gap-2 shadow-xs bg-white cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#583F37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Packing Slip
          </button>

          <button
            onClick={() => setShowRefundModal(true)}
            disabled={isRefunded}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 shadow-xs bg-white cursor-pointer ${isRefunded
                ? "text-gray-400 border border-gray-200 cursor-not-allowed"
                : "text-[#C53030] border border-[#E53E3E] hover:bg-red-50"
              }`}
          >
            <svg className="w-4 h-4 text-[#C53030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefunded ? "Refunded" : "Refund"}
          </button>
        </div>
      </div>

      {/* Main Grid Section: Ordered Items (Left) and Price/Payment Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Section: Ordered Items Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[#E9E3DE] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#3D2E28]">Ordered Items</h2>
            <span className="text-sm text-[#7A6860] font-medium">{totalItemsCount} Items</span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F4] border-b border-[#E9E3DE]">
                  <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                    PRODUCT
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                    PRICE
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                    QTY
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8E3]">
                {orderData.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF6F4]/50 transition-colors">
                    {/* Product Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl border border-[#E9E3DE] shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#583F37] leading-snug">{item.name}</p>
                          {item.subtitle && (
                            <p className="text-xs text-[#8A756C] mt-0.5">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* SKU Cell */}
                    <td className="px-6 py-4 text-sm text-[#6E5B53] font-medium whitespace-nowrap">
                      {item.sku}
                    </td>

                    {/* Price Cell */}
                    <td className="px-6 py-4 text-sm text-[#3D2E28] font-medium whitespace-nowrap">
                      ${item.price.toFixed(2)}
                    </td>

                    {/* Qty Cell */}
                    <td className="px-6 py-4 text-sm text-[#3D2E28] font-medium whitespace-nowrap">
                      {item.quantity}
                    </td>

                    {/* Total Cell */}
                    <td className="px-6 py-4 text-sm text-[#3D2E28] font-semibold whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section: Price Summary & Payment Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E9E3DE] shadow-xs p-6 flex flex-col gap-6">
          {/* Price Summary Section */}
          <div>
            <h2 className="text-lg font-bold text-[#583F37] mb-4">Price Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-[#6E5B53]">
                <span>Sub Total</span>
                <span className="font-semibold text-[#3D2E28]">${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#6E5B53]">
                <span>Discount</span>
                <span className="font-semibold text-[#3D2E28]">${orderData.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#6E5B53]">
                <span>Delivery fee</span>
                <span className="font-semibold text-[#3D2E28]">${orderData.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#6E5B53]">
                <span>Total Price</span>
                <span className="font-semibold text-[#3D2E28]">${(orderData.subtotal - orderData.discount + orderData.deliveryFee).toFixed(2)}</span>
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
                <p className="font-semibold text-[#3D2E28]">{orderData.paymentMethodText}</p>
              </div>

              <div>
                <p className="text-xs text-[#8A756C] font-medium mb-1">Payment Status</p>
                <p className="font-semibold text-[#3D2E28]">{isRefunded ? "Refunded" : orderData.paymentStatus === "Paid" ? "Paid" : "Unpaid"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Customer Card (Matches requested design) */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] shadow-xs p-6 flex flex-col gap-6">
        {/* Card Header */}
        <h2 className="text-base font-bold text-[#583F37]">Customer</h2>

        {/* Customer Avatar & Meta Row */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#E4EBF9] text-[#30457A] font-bold text-sm flex items-center justify-center shrink-0">
            {orderData.customer.avatarInitials}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#583F37]">{orderData.customer.name}</h3>
            <p className="text-xs text-[#8A756C] mt-0.5">
              {orderData.customer.totalOrders} Orders · Customer since {orderData.customer.customerSince || "2021"}
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
                Email: <span className="text-[#3D2E28] font-normal">{orderData.customer.email}</span>
              </p>
              <p>
                Phone Number: <span className="text-[#3D2E28] font-normal">{orderData.customer.phone}</span>
              </p>
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E4B42] mb-3">
              SHIPPING ADDRESS
            </h4>
            <div className="space-y-1 text-sm text-[#6E5B53]">
              <p>{orderData.shippingAddress.street}</p>
              <p>{orderData.shippingAddress.cityStateZip}</p>
              <p>{orderData.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleConfirmRefund}
        title={`Process Refund for ${orderData.id}`}
        subtitle="Are you sure you want to issue a full refund for this order?"
        confirmText="Confirm Refund"
        confirmVariant="danger"
        maxWidth="md"
      >
        <div>
          <label className="block text-xs font-medium text-[#8A756C] mb-1">Reason for refund (optional)</label>
          <textarea
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="e.g. Customer return, damaged package..."
            className="w-full text-sm border border-[#D1C7BD] rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white text-[#3D2E28]"
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}

export default OrderDetailPage;
