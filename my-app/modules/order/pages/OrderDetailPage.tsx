"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, Modal, Button, StatusBadge } from "@/modules/shared";
import { OrderedItemsTable } from "../components/OrderedItemsTable";
import { OrderPriceSummaryCard } from "../components/OrderPriceSummaryCard";
import { OrderCustomerDetailsCard } from "../components/OrderCustomerDetailsCard";
import { OrderDetailSkeleton } from "../components/OrderDetailSkeleton";
import { OrderWithDetails } from "@/types";
import {
  useGetAdminOrder,
  useCancelAdminOrder,
  useCompletePaymentAdminOrder,
  useCompleteDeliveryAdminOrder,
  useUpdateAdminOrderStatus,
} from "@/app/api/hooks/useOrders";
import { Printer, Check, RotateCcw, X } from "lucide-react";
import { formatMoney, formatDate } from "@/utils/format";
import { calculateSubtotal } from "../utils/orderCalculations";

type ModalType = "cancel" | "completePayment" | "completeDelivery" | "refund" | null;

export function OrderDetailPage({ orderId: propOrderId }: { orderId?: string }) {
  const params = useParams();
  const rawId = propOrderId || (params?.id as string) || "";
  const cleanId = rawId.replace("%23", "").replace("#", "");

  const { data: fetchedOrder, isLoading, isError, error, refetch } = useGetAdminOrder(cleanId);
  const cancelOrderMutation = useCancelAdminOrder();
  const completePaymentMutation = useCompletePaymentAdminOrder();
  const completeDeliveryMutation = useCompleteDeliveryAdminOrder();
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  if (isLoading) {
    return <OrderDetailSkeleton />;
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
  const currentStatus = fetchedOrder?.status ?? "Pending";
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
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const handleConfirmCompletePayment = async () => {
    try {
      await completePaymentMutation.mutateAsync(cleanId);
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to complete payment:", err);
    }
  };

  const handleConfirmCompleteDelivery = async () => {
    try {
      await completeDeliveryMutation.mutateAsync(cleanId);
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to complete delivery:", err);
    }
  };

  const handleConfirmRefund = async () => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: cleanId,
        status: "Refunded",
      });
      setActiveModal(null);
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

  const calculatedSubtotal = calculateSubtotal(orderData.items, orderData.total);

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
              icon={<Printer className="w-4 h-4 text-[#583F37]" />}
            >
              Print Packing Slip
            </Button>

            {/* Completed Payment Button (COD only) */}
            {isCOD && !isCancelled && !isDelivered && (
              <Button
                variant="primary"
                onClick={() => setActiveModal("completePayment")}
                disabled={completePaymentMutation.isPending}
                icon={<Check className="w-4 h-4 text-white" />}
              >
                {completePaymentMutation.isPending ? "Updating..." : "Completed Payment"}
              </Button>
            )}

            {/* Complete Delivery Button (Online Payment only) */}
            {!isCOD && !isCancelled && !isDelivered && (
              <Button
                variant="primary"
                onClick={() => setActiveModal("completeDelivery")}
                disabled={completeDeliveryMutation.isPending}
                icon={<Check className="w-4 h-4 text-white" />}
              >
                {completeDeliveryMutation.isPending ? "Updating..." : "Complete Delivery"}
              </Button>
            )}

            {/* Refund Order Button (When payment is complete and order is delivered) */}
            {canRefund && (
              <Button
                variant="danger-outline"
                onClick={() => setActiveModal("refund")}
                disabled={updateOrderStatusMutation.isPending}
                icon={<RotateCcw className="w-4 h-4 text-[#C53030]" />}
              >
                {updateOrderStatusMutation.isPending ? "Refunding..." : "Refund Order"}
              </Button>
            )}

            {/* Cancel Button (For COD or Card) */}
            {!isCancelled && !isDelivered && (
              <Button
                variant="danger-outline"
                onClick={() => setActiveModal("cancel")}
                disabled={cancelOrderMutation.isPending}
                icon={<X className="w-4 h-4 text-[#C53030]" />}
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
        isOpen={activeModal === "cancel"}
        onClose={() => setActiveModal(null)}
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
        isOpen={activeModal === "refund"}
        onClose={() => setActiveModal(null)}
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
        isOpen={activeModal === "completePayment"}
        onClose={() => setActiveModal(null)}
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

      {/* Complete Delivery Modal (Online Payment) */}
      <Modal
        isOpen={activeModal === "completeDelivery"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmCompleteDelivery}
        title={`Complete Delivery for ${displayOrderNumber}`}
        subtitle={`Confirm that this order has been successfully delivered to the customer.`}
        confirmText="Confirm Delivery"
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
