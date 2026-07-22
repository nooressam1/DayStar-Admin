"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Button, TextInput } from "@/modules/shared";
import { MinimumRequirementSelector } from "../components/MinimumRequirementSelector";
import { Discount } from "@/types";

export function AddDiscountPage() {
  const router = useRouter();

  const [code, setCode] = useState("SUMMER-SALE-20");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed Amount" | "Free Shipping">("Percentage");
  const [value, setValue] = useState("20");
  const [status, setStatus] = useState<"Active" | "Scheduled" | "Expired">("Active");

  // Minimum Requirements
  const [minRequirementOption, setMinRequirementOption] = useState<"none" | "amount" | "quantity">("none");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [minQuantity, setMinQuantity] = useState("");

  // Dates
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountPayload: Discount = {
      id: `disc-${Date.now()}`,
      code,
      value: parseFloat(value) || 0,
      type: discountType,
      created_at: new Date().toISOString(),
      is_active: status === "Active",
      min_requirement_type: minRequirementOption,
      min_requirement_value: minRequirementOption === "amount" ? parseFloat(minPurchaseAmount) || 0 : minRequirementOption === "quantity" ? parseInt(minQuantity, 10) || 0 : 0,
      start_date: startDate,
      end_date: endDate || undefined,
    };
    console.log("Submitting Discount DB Schema Payload:", discountPayload);
    router.push("/discount");
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
            <Button
              onClick={handleSubmit}
            >
              Create Discount
            </Button>
          </>
        }
      />

      {/* Main Card Form (Matches Screenshot Layout Exactly) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9E3DE] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
        {/* DISCOUNT CODE */}
        <TextInput
          label="DISCOUNT CODE"
          required
          placeholder="SUMMER-SALE-20"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          helperText="Customers will enter this code at checkout."
          className="font-mono font-semibold"
        />

        {/* CAMPAIGN TITLE */}
        <TextInput
          label="CAMPAIGN TITLE (OPTIONAL)"
          placeholder="e.g. Summer Special Offer 20% Off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DISCOUNT TYPE & VALUE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-2">
              DISCOUNT TYPE
            </label>
            <div className="relative">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#004D5A] pr-10"
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed Amount">Fixed Amount ($)</option>
                <option value="Free Shipping">Free Shipping</option>
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
          placeholder="20"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          suffix={discountType === "Fixed Amount" ? "$" : discountType === "Free Shipping" ? "" : "%"}
          className="font-semibold"
        />
        </div>

        {/* MINIMUM REQUIREMENTS */}
        <MinimumRequirementSelector
          selectedOption={minRequirementOption}
          onChangeOption={setMinRequirementOption}
          minPurchaseAmount={minPurchaseAmount}
          onChangeMinPurchaseAmount={setMinPurchaseAmount}
          minQuantity={minQuantity}
          onChangeMinQuantity={setMinQuantity}
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 focus:ring-[#004D5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#7A6860] mb-1.5">End Date (Optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-sm border border-[#E9E3DE] rounded-xl p-3 bg-white text-[#3D2E28] focus:outline-hidden focus:ring-2 focus:ring-[#004D5A]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDiscountPage;
