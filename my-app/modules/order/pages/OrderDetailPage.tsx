"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, Modal, Button, StatusBadge } from "@/modules/shared";
import { OrderedItemsTable } from "../components/OrderedItemsTable";
import { OrderPriceSummaryCard } from "../components/OrderPriceSummaryCard";
import { OrderCustomerDetailsCard } from "../components/OrderCustomerDetailsCard";
import { OrderWithDetails } from "@/types";
import {
  useGetAdminOrder,
  useCancelAdminOrder,
  useCompletePaymentAdminOrder,
  useUpdateAdminOrderStatus,
} from "@/app/api/hooks/useOrders";
import { formatMoney, formatDate } from "@/utils/format";

export function OrderDetailPage({ orderId: propOrderId }: { orderId?: string }) {
  const params = useParams();
  const rawId = propOrderId || (params?.id as string) || "";
  const cleanId = rawId.replace("%23", "").replace("#", "");

  const { data: fetchedOrder, isLoading, isError, error, refetch } = useGetAdminOrder(cleanId);
  const cancelOrderMutation = useCancelAdminOrder();
  const completePaymentMutation = useCompletePaymentAdminOrder();
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompletePaymentModal, setShowCompletePaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
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
  const statusLower = currentStatus.toLowerCase();
  const isCancelled = statusLower === "cancelled" || statusLower === "refunded";
  const isDelivered = statusLower === "delivered" || statusLower === "completed";

  // Payment method detection (Default: Cash on Delivery)
  const paymentMethod = (orderData.payment_method || "Cash on Delivery").trim();
  const isCOD =
    !orderData.payment_method ||
    /cash/i.test(paymentMethod) ||
    /cod/i.test(paymentMethod);
  const isCard = !isCOD;

  const rawPaymentStatus = (orderData.payment_status || "").toLowerCase();
  const isPaymentComplete =
    rawPaymentStatus === "paid" ||
    rawPaymentStatus === "completed" ||
    isCard ||
    (isCOD && isDelivered);

  const canRefund = isDelivered && isPaymentComplete;

  const handlePrintPackingSlip = () => {
    window.print();
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelOrderMutation.mutateAsync({
        id: cleanId,
      });
      setCurrentStatus("Cancelled");
      setShowCancelModal(false);
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const handleConfirmCompletePayment = async () => {
    try {
      await completePaymentMutation.mutateAsync(cleanId);
      setCurrentStatus("Delivered");
      setShowCompletePaymentModal(false);
    } catch (err) {
      console.error("Failed to complete payment:", err);
    }
  };

  const handleConfirmRefund = async () => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: cleanId,
        status: "Refunded",
      });
      setCurrentStatus("Refunded");
      setShowRefundModal(false);
    } catch (err) {
      console.error("Failed to refund order:", err);
    }
  };

  const formattedDate = formatDate(orderData.created_at, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
            <StatusBadge status={currentStatus} size="md" />
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

            {/* Completed Payment Button (COD only) */}
            {isCOD && !isCancelled && !isDelivered && (
              <Button
                variant="primary"
                onClick={() => setShowCompletePaymentModal(true)}
                disabled={completePaymentMutation.isPending}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              >
                {completePaymentMutation.isPending ? "Updating..." : "Completed Payment"}
              </Button>
            )}

            {/* Refund Order Button (When payment is complete and order is delivered) */}
            {canRefund && (
              <Button
                variant="danger-outline"
                onClick={() => setShowRefundModal(true)}
                disabled={updateOrderStatusMutation.isPending}
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
                {updateOrderStatusMutation.isPending ? "Refunding..." : "Refund Order"}
              </Button>
            )}

            {/* Cancel Button (For COD or Card) */}
            {!isCancelled && !isDelivered && (
              <Button
                variant="danger-outline"
                onClick={() => setShowCancelModal(true)}
                disabled={cancelOrderMutation.isPending}
                icon={
                  <svg className="w-4 h-4 text-[#C53030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
              >
                Cancel Order
              </Button>
            )}
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
          paymentMethodText={paymentMethod}
          orderStatus={currentStatus}
          isRefunded={statusLower === "refunded"}
        />
      </div>

      {/* Bottom Customer Card Component */}
      <OrderCustomerDetailsCard
        user={orderData.user}
        address={orderData.address}
        fullName={orderData.full_name}
        phoneNumber={orderData.phone_number}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title={`Cancel Order ${displayOrderNumber}`}
        subtitle={
          isCard
            ? `⚠️ This order was paid via Card. Canceling this order will automatically issue a refund back to the customer.`
            : `Are you sure you want to cancel this order?`
        }
        confirmText={isCard ? "Refund & Cancel Order" : "Cancel Order"}
        confirmVariant="danger"
        maxWidth="md"
      >
        <div className="text-sm text-[#6E5B53]">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs leading-relaxed">
            <p className="font-semibold text-red-900 mb-0.5">Order Cancellation Notice</p>
            {isCard ? (
              <p>
                By proceeding, this order will be officially <strong>cancelled</strong> and a full refund of{" "}
                <strong>{formatMoney(orderData.total)}</strong> will be credited back to the customer's payment card.
              </p>
            ) : (
              <p>
                By proceeding, this order will be officially <strong>cancelled</strong>. No cash collection will take place, and the order will be marked as non-fulfilled.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Refund Confirmation Modal (Delivered Orders) */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleConfirmRefund}
        title={`Process Refund for ${displayOrderNumber}`}
        subtitle={`Are you sure you want to issue a full refund of ${formatMoney(orderData.total)} for this delivered order?`}
        confirmText="Confirm Refund"
        confirmVariant="danger"
        maxWidth="md"
      >
        <div className="text-sm text-[#6E5B53]">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed font-medium">
            Notice: This order is marked as delivered. Issuing a refund will update the status to <strong>Refunded</strong> and record a full return of {formatMoney(orderData.total)}.
          </div>
        </div>
      </Modal>

      {/* Completed Payment Modal (COD) */}
      <Modal
        isOpen={showCompletePaymentModal}
        onClose={() => setShowCompletePaymentModal(false)}
        onConfirm={handleConfirmCompletePayment}
        title={`Complete Payment for ${displayOrderNumber}`}
        subtitle={`Confirm that Cash on Delivery payment of ${formatMoney(
          orderData.total
        )} has been successfully collected from the customer.`}
        confirmText="Confirm Payment Collected"
        confirmVariant="primary"
        maxWidth="md"
      >
        <p className="text-sm text-[#6E5B53]">
          This action will mark the order as delivered and completed.
        </p>
      </Modal>
    </div>
  );
}

export default OrderDetailPage;


