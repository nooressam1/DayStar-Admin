"use client";

import React from "react";
import { Modal, Button } from "@/modules/shared";
import { Customer } from "@/types";

export interface ToggleCustomerStatusModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ToggleCustomerStatusModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ToggleCustomerStatusModalProps) {
  if (!customer) return null;

  const isDisabled = customer.is_disabled;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isDisabled ? "Enable Customer Account" : "Disable Customer Account"}
    >
      <div className="space-y-4 pt-2">
        <p className="text-sm text-[#583F37]">
          Are you sure you want to{" "}
          <strong>{isDisabled ? "enable" : "disable"}</strong> the account for{" "}
          <strong>{customer.full_name}</strong> ({customer.id})?
        </p>
        <p className="text-xs text-[#8A756C]">
          {isDisabled
            ? "Enabling this account will restore full store access and allow checkout."
            : "Disabling this account will prevent the customer from logging in or placing new orders."}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE3DE]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Cancel
          </button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            variant={isDisabled ? "primary" : "secondary"}
            className={isDisabled ? "" : "!bg-red-600 !text-white hover:!bg-red-700"}
          >
            {isDisabled ? "Enable Account" : "Disable Account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ToggleCustomerStatusModal;
