"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Button, TextInput } from "@/modules/shared";
import { MinimumRequirementSelector } from "../components/MinimumRequirementSelector";
import { DiscountType } from "@/enums";
import { useAddDiscountForm, DiscountFormErrors } from "../hooks/useAddDiscountForm";
import { fetchDiscountsApi, createDiscountApi } from "../utils/discountStorage";
import { DiscountRecord } from "./DiscountPage";

export function AddDiscountPage() {
  const router = useRouter();
  const [existingDiscounts, setExistingDiscounts] = useState<DiscountRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    state,
    isFreeShipping,
    isPercentage,
    isFixedAmount,
    setField,
    changeDiscountType,
    changeMinRequirement,
    validateForm,
  } = useAddDiscountForm();

  const [errors, setErrors] = useState<DiscountFormErrors>({});

  useEffect(() => {
    fetchDiscountsApi().then(setExistingDiscounts);
  }, []);

  const clearError = (field: keyof DiscountFormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm(existingDiscounts);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const numericMinVal = state.minRequirementOption === "none"
      ? 0
      : parseFloat(state.minRequirementValue) || 0;

    const payload = {
      code: state.code.trim().toUpperCase(),
      type: state.discountType,
      value: isFreeShipping ? 0 : parseFloat(state.value) || 0,
      is_active: state.isActive,
      min_requirement_type: state.minRequirementOption,
      min_requirement_value: numericMinVal,
      active_start_date: state.startDate,
      active_end_date: state.endDate || undefined,
    };

    try {
      await createDiscountApi(payload);
      router.push("/discount");
    } catch (err: any) {
      setIsSubmitting(false);
      const msg = err?.message || err?.details?.message || "Failed to create discount.";
      if (msg.toLowerCase().includes("code") || msg.toLowerCase().includes("exist")) {
        setErrors((prev) => ({
          ...prev,
          code: msg.includes("already exists") ? msg : "This discount code already exists. Discount codes cannot be repeated.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, code: msg }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Create Discount"
        subtitle="Configure a new promotional offer, minimum requirement rules, and active date range for your customers."
        backLink={{
          href: "/discount",
          label: "Back to Discounts",
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => router.push("/discount")}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Discount
            </Button>
          </>
        }
      />

      {/* Main Card Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9E3DE] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
        {/* DISCOUNT CODE */}
        <TextInput
          label="DISCOUNT CODE"
          required
          placeholder="SUMMER-SALE-20"
          value={state.code}
          onChange={(e) => {
            setField("code", e.target.value);
            clearError("code");
          }}
          error={errors.code}
          helperText="Customers will enter this code at checkout."
          className="font-mono font-semibold"
        />


        {/* DISCOUNT TYPE & VALUE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
              DISCOUNT TYPE
            </label>
            <div className="relative">
              <select
                value={state.discountType}
                onChange={(e) => {
                  changeDiscountType(e.target.value as DiscountType);
                  clearError("value");
                }}
                className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#004D5A] pr-10"
              >
                <option value={DiscountType.PERCENTAGE}>Percentage (%)</option>
                <option value={DiscountType.FIXED_AMOUNT}>Fixed Amount ($)</option>
                <option value={DiscountType.FREE_SHIPPING}>Free Shipping</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <TextInput
            label="VALUE"
            placeholder={isFreeShipping ? "N/A (Free Shipping)" : isFixedAmount ? "10" : "20"}
            value={isFreeShipping ? "0" : state.value}
            disabled={isFreeShipping}
            onChange={(e) => {
              setField("value", e.target.value);
              clearError("value");
            }}
            error={errors.value}
            suffix={isFixedAmount ? "$" : isFreeShipping ? "" : "%"}
            className="font-semibold"
          />
        </div>

        {/* MINIMUM REQUIREMENTS */}
        <MinimumRequirementSelector
          selectedOption={state.minRequirementOption}
          onChangeOption={(opt) => {
            changeMinRequirement(opt);
            clearError("minRequirement");
          }}
          requirementValue={state.minRequirementValue}
          onChangeRequirementValue={(val) => {
            setField("minRequirementValue", val);
            clearError("minRequirement");
          }}
          error={errors.minRequirement}
        />

        {/* ACTIVE DATES */}
        <div>
          <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-3">
            ACTIVE DATES
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#7A6860] mb-1.5">Start Date</label>
              <input
                type="date"
                value={state.startDate}
                onChange={(e) => {
                  setField("startDate", e.target.value);
                  clearError("startDate");
                }}
                className={`w-full text-sm border rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 ${
                  errors.startDate
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-[#E9E3DE] focus:ring-[#004D5A]/30"
                }`}
              />
              {errors.startDate && <p className="text-xs text-red-600 font-medium mt-1.5">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#7A6860] mb-1.5">End Date (Optional)</label>
              <input
                type="date"
                value={state.endDate}
                onChange={(e) => {
                  setField("endDate", e.target.value);
                  clearError("endDate");
                }}
                className={`w-full text-sm border rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 ${
                  errors.endDate
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-[#E9E3DE] focus:ring-[#004D5A]/30"
                }`}
              />
              {errors.endDate && <p className="text-xs text-red-600 font-medium mt-1.5">{errors.endDate}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDiscountPage;
