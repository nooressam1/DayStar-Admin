"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, Modal, Button } from "@/modules/shared";
import { OrderedItemsTable } from "../components/OrderedItemsTable";
import { OrderPriceSummaryCard } from "../components/OrderPriceSummaryCard";
import { OrderCustomerDetailsCard } from "../components/OrderCustomerDetailsCard";
import { OrderWithDetails, OrderItem, Address, Profile } from "@/types";

const sampleDBItems: OrderItem[] = [
  {
    id: "item-1",
    order_id: "ord-88421",
    variant_id: "var-101",
    product_name: "Apex Pro Keyboard",
    sku: "KB-APX-PRO",
    unit_price_snapshot: 199.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "item-2",
    order_id: "ord-88421",
    variant_id: "var-102",
    product_name: "QcK Heavy XL Mousepad",
    sku: "MP-QCK-XL",
    unit_price_snapshot: 29.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "item-3",
    order_id: "ord-88421",
    variant_id: "var-103",
    product_name: "Coiled USB-C Cable",
    sku: "CB-CLD-BLK",
    unit_price_snapshot: 35.00,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
  },
];

const sampleAddress: Address = {
  id: "addr-101",
  user_id: "usr-201",
  label: "Office",
  street: "123 Industrial Way, Suite 400",
  city: "San Francisco",
  governorate: "CA",
  postal_code: "94103",
  country: "United States",
  created_at: "2023-01-15T00:00:00Z",
  is_default: true,
};

const sampleUser: Profile = {
  id: "usr-201",
  username: "janedoe",
  role: "customer",
  email: "jane.doe@example.com",
  full_name: "Jane Doe",
};

const mockDatabaseOrders: Record<string, OrderWithDetails> = {
  "ORD-88210": {
    id: "ord-88421",
    order_number: 88210,
    user_id: "usr-201",
    address_id: "addr-101",
    status: "Shipped",
    total: 283.00,
    created_at: "2023-10-24T14:14:00Z",
    full_name: "Jane Doe",
    phone_number: "+1 (555) 0123-4567",
    subtotal: 264.98,
    discount: 20.00,
    delivery_fee: 38.02,
    payment_method: "Cash on Delivery",
    items: sampleDBItems,
    address: sampleAddress,
    user: sampleUser,
  },
};

const defaultDBOrder: OrderWithDetails = {
  id: "ord-88421",
  order_number: 98421,
  user_id: "usr-201",
  address_id: "addr-101",
  status: "Shipped",
  total: 283.00,
  created_at: "2023-10-24T14:14:00Z",
  full_name: "Jane Doe",
  phone_number: "+1 (555) 0123-4567",
  subtotal: 264.98,
  discount: 20.00,
  delivery_fee: 38.02,
  payment_method: "Cash on Delivery",
  items: sampleDBItems,
  address: sampleAddress,
  user: sampleUser,
};

export function OrderDetailPage({ orderId: propOrderId }: { orderId?: string }) {
  const params = useParams();
  const rawId = propOrderId || (params?.id as string) || "ORD-88210";
  const cleanId = rawId.replace("%23", "").replace("#", "");

  const orderData: OrderWithDetails = mockDatabaseOrders[cleanId] || {
    ...defaultDBOrder,
    id: cleanId,
    order_number: parseInt(cleanId.replace(/\D/g, ""), 10) || 98421,
  };

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>(orderData.status || "Shipped");

  const isRefunded = currentStatus === "Cancelled" || currentStatus === "Refunded";

  const handlePrintPackingSlip = () => {
    window.print();
  };

  const handleConfirmRefund = () => {
    setCurrentStatus("Refunded");
    setShowRefundModal(false);
  };

  const formattedDate = new Date(orderData.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayOrderNumber = `#ORD-${orderData.order_number}`;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title={
          <div className="flex items-center flex-wrap gap-3">
            <span>Order {displayOrderNumber}</span>
            <span
              className={`px-5 py-1 text-xs sm:text-sm font-medium rounded-full ${
                currentStatus === "Refunded" || currentStatus === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : currentStatus === "Shipped" || currentStatus === "Delivered"
                  ? "bg-[#50E3C2] text-[#044E35]"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {currentStatus}
            </span>
          </div>
        }
        subtitle={`Placed on ${formattedDate}`}
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
          items={orderData.items || []}
          className="lg:col-span-2"
        />

        {/* Right Section: Price & Payment Summary Component */}
        <OrderPriceSummaryCard
          total={orderData.total}
          subtotal={orderData.subtotal}
          discount={orderData.discount}
          deliveryFee={orderData.delivery_fee}
          paymentMethodText={orderData.payment_method}
          status={currentStatus}
          isRefunded={isRefunded}
        />
      </div>

      {/* Bottom Customer Card Component */}
      <OrderCustomerDetailsCard
        user={orderData.user}
        address={orderData.address}
        fullName={orderData.full_name}
        phoneNumber={orderData.phone_number}
      />

      {/* Refund Confirmation Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleConfirmRefund}
        title={`Process Refund for ${displayOrderNumber}`}
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

