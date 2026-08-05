"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, Modal, Button } from "@/modules/shared";
import { OrderedItemsTable } from "../components/OrderedItemsTable";
import { OrderPriceSummaryCard } from "../components/OrderPriceSummaryCard";
import { OrderCustomerDetailsCard } from "../components/OrderCustomerDetailsCard";
import { OrderWithDetails } from "@/types";
import { useGetAdminOrder } from "@/app/api/hooks/useOrders";

export function OrderDetailPage({ orderId: propOrderId }: { orderId?: string }) {
  const params = useParams();
  const rawId = propOrderId || (params?.id as string) || "";
  const cleanId = rawId.replace("%23", "").replace("#", "");

  const { data: fetchedOrder, isLoading, isError, error, refetch } = useGetAdminOrder(cleanId);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>("Pending");

  useEffect(() => {
    if (fetchedOrder?.status) {
      setCurrentStatus(fetchedOrder.status);
    }
  }, [fetchedOrder]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-[#8A756C] font-medium">
        Loading order details...
      </div>
    );
  }

  if (isError || !fetchedOrder) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-4">
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-xs">
          <h2 className="font-bold text-lg">Order Not Found</h2>
          <p className="text-sm mt-1">{(error as any)?.message || "Could not fetch order details from backend."}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/order" className="px-4 py-2 bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl hover:bg-stone-300">
              Back to Orders
            </Link>
            <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderData: OrderWithDetails = fetchedOrder;
  const isRefunded = currentStatus === "Cancelled" || currentStatus === "Refunded";

  const handlePrintPackingSlip = () => {
    window.print();
  };

  const handleConfirmRefund = () => {
    setCurrentStatus("Refunded");
    setShowRefundModal(false);
  };

  const formattedDate = orderData.created_at
    ? new Date(orderData.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "N/A";

  const displayOrderNumber = `#${orderData.order_number}`;

  const calculatedSubtotal = orderData.items && orderData.items.length > 0
    ? orderData.items.reduce((sum, item) => sum + ((item.unit_price_snapshot || 0) * (item.quantity || 1)), 0)
    : orderData.total;

  const discountVal = (orderData as any).discount_amount ?? orderData.discount ?? 0;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title={
          <div className="flex items-center flex-wrap gap-3">
            <span>Order {displayOrderNumber}</span>
            <span
              className={`px-5 py-1 text-xs sm:text-sm font-medium rounded-full ${currentStatus === "Refunded" || currentStatus === "Cancelled"
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
          subtotal={orderData.subtotal || calculatedSubtotal}
          discount={discountVal}
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

