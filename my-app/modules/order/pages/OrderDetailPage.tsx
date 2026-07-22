"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, Modal, Button } from "@/modules/shared";
import { OrderedItemsTable } from "../components/OrderedItemsTable";
import { OrderPriceSummaryCard } from "../components/OrderPriceSummaryCard";
import { OrderCustomerDetailsCard } from "../components/OrderCustomerDetailsCard";
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
      {/* Page Header */}
      <PageHeader
        title={
          <div className="flex items-center flex-wrap gap-3">
            <span>Order {orderData.id}</span>
            <span
              className={`px-5 py-1 text-xs sm:text-sm font-medium rounded-full ${isRefunded
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
        }
        subtitle={`Placed on ${orderData.placedDate} `}
        backLink={{
          href: "/order",
          label: "Back to Orders",
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handlePrintPackingSlip}
              icon={
                <svg className="w-4 h-4 text-[#583F37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              }
            >
              Print Packing Slip
            </Button>

            <Button
              variant="danger-outline"
              onClick={() => setShowRefundModal(true)}
              disabled={isRefunded}
              icon={
                <svg className="w-4 h-4 text-[#C53030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              }
            >
              {isRefunded ? "Refunded" : "Refund"}
            </Button>
          </>
        }
      />

      {/* Main Grid Section: Ordered Items (Left) and Price/Payment Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Section: Ordered Items Component */}
        <OrderedItemsTable
          items={orderData.items}
          className="lg:col-span-2"
        />

        {/* Right Section: Price & Payment Summary Component */}
        <OrderPriceSummaryCard
          subtotal={orderData.subtotal}
          discount={orderData.discount}
          deliveryFee={orderData.deliveryFee}
          paymentMethodText={orderData.paymentMethodText}
          paymentStatus={orderData.paymentStatus}
          isRefunded={isRefunded}
        />
      </div>

      {/* Bottom Customer Card Component */}
      <OrderCustomerDetailsCard
        customer={orderData.customer}
        shippingAddress={orderData.shippingAddress}
      />

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
