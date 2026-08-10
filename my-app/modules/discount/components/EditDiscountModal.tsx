"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/modules/shared";
import { DiscountRecord } from "../pages/DiscountPage";
import { isDiscountCodeTaken } from "../utils/discountStorage";
import { useUpdateDiscount } from "@/app/api/hooks/useDiscounts";

export interface EditDiscountModalProps {
  discount: DiscountRecord | null;
  isOpen: boolean;
  onClose: () => void;
  discountsList: DiscountRecord[];
}

export function EditDiscountModal({
  discount,
  isOpen,
  onClose,
  discountsList,
}: EditDiscountModalProps) {
  const updateDiscountMutation = useUpdateDiscount();

  const [editForm, setEditForm] = useState({
    code: "",
    type: "Percentage",
    value: 0,
    status: "Active" as "Active" | "Scheduled",
    minRequirementType: "none" as "none" | "amount" | "quantity",
    minRequirementValue: "",
    startDate: "",
    endDate: "",
  });
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (discount) {
      setEditError(null);

      let numVal = 0;
      if (typeof discount.value === "number") {
        numVal = discount.value;
      } else if (typeof discount.value === "string") {
        const match = discount.value.match(/\d+(\.\d+)?/);
        if (match) numVal = parseFloat(match[0]);
      }

      setEditForm({
        code: discount.code,
        type: discount.type || "Percentage",
        value: numVal,
        status: discount.status === "Scheduled" ? "Scheduled" : "Active",
        minRequirementType: discount.minRequirementType || "none",
        minRequirementValue: discount.minRequirementValue || "",
        startDate: discount.startDate || new Date().toISOString().split("T")[0],
        endDate: discount.endDate || "",
      });
    }
  }, [discount]);

  const handleSaveEdit = async () => {
    if (!discount) return;
    setEditError(null);

    const cleanCode = editForm.code.trim().toUpperCase();
    if (!cleanCode) {
      setEditError("Discount code is required.");
      return;
    }

    if (isDiscountCodeTaken(cleanCode, discountsList, discount.id)) {
      setEditError("This discount code is already taken.");
      return;
    }

    try {
      await updateDiscountMutation.mutateAsync({
        id: discount.id,
        payload: {
          code: cleanCode,
          type: editForm.type,
          value: Number(editForm.value) || 0,
          is_active: editForm.status === "Active",
          min_requirement_type: editForm.minRequirementType,
          min_requirement_value: editForm.minRequirementValue
            ? Number(editForm.minRequirementValue)
            : undefined,
          active_start_date: editForm.startDate || undefined,
          active_end_date: editForm.endDate || undefined,
        },
      });
      onClose();
    } catch (err: any) {
      console.error("Failed to update discount:", err);
      setEditError(err?.message || "Failed to update discount. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSaveEdit}
      title="Edit Discount"
      subtitle={`Update details for ${discount?.code || "discount"}`}
      confirmText={updateDiscountMutation.isPending ? "Saving..." : "Save Changes"}
      confirmVariant="primary"
      maxWidth="md"
    >
      <div className="space-y-4 text-sm text-[#3D2E28]">
        {editError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {editError}
          </div>
        )}

        {/* Code */}
        <div>
          <label className="block text-xs font-medium text-[#8A756C] mb-1">
            Discount Code
          </label>
          <input
            type="text"
            value={editForm.code}
            onChange={(e) =>
              setEditForm({ ...editForm, code: e.target.value.toUpperCase() })
            }
            className="w-full text-sm font-mono border border-[#D1C7BD] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white uppercase text-[#3D2E28]"
            placeholder="e.g. SUMMER20"
          />
        </div>

        {/* Type & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#8A756C] mb-1">
              Discount Type
            </label>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              className="w-full text-sm border border-[#D1C7BD] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white text-[#3D2E28]"
            >
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed Amount">Fixed Amount ($)</option>
              <option value="Free Shipping">Free Shipping</option>
            </select>
          </div>

          {editForm.type !== "Free Shipping" && (
            <div>
              <label className="block text-xs font-medium text-[#8A756C] mb-1">
                Value ({editForm.type === "Percentage" ? "%" : "$"})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={editForm.value}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    value: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full text-sm border border-[#D1C7BD] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white text-[#3D2E28]"
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-[#8A756C] mb-1">
            Status
          </label>
          <select
            value={editForm.status}
            onChange={(e) =>
              setEditForm({ ...editForm, status: e.target.value as any })
            }
            className="w-full text-sm border border-[#D1C7BD] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white text-[#3D2E28]"
          >
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#8A756C] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={editForm.startDate}
              onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
              className="w-full text-sm border border-[#D1C7BD] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white text-[#3D2E28]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8A756C] mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={editForm.endDate}
              onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
              className="w-full text-sm border border-[#D1C7BD] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8C7A70] bg-white text-[#3D2E28]"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EditDiscountModal;
