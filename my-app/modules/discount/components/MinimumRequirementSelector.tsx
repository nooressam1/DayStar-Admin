"use client";

import React from "react";
import { OptionCard, TextInput } from "@/modules/shared";

export type MinRequirementType = "none" | "amount" | "quantity";

export interface MinimumRequirementSelectorProps {
  selectedOption: MinRequirementType;
  onChangeOption: (option: MinRequirementType) => void;
  minPurchaseAmount: string;
  onChangeMinPurchaseAmount: (value: string) => void;
  minQuantity: string;
  onChangeMinQuantity: (value: string) => void;
  label?: string;
  className?: string;
}

export function MinimumRequirementSelector({
  selectedOption,
  onChangeOption,
  minPurchaseAmount,
  onChangeMinPurchaseAmount,
  minQuantity,
  onChangeMinQuantity,
  label = "MINIMUM REQUIREMENTS",
  className = "",
}: MinimumRequirementSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider mb-3">
          {label}
        </label>
      )}

      {/* Option 1: None */}
      <OptionCard
        isSelected={selectedOption === "none"}
        onSelect={() => onChangeOption("none")}
        title="None"
      />

      {/* Option 2: Minimum Purchase Amount ($) */}
      <OptionCard
        isSelected={selectedOption === "amount"}
        onSelect={() => onChangeOption("amount")}
        title="Minimum Purchase Amount ($)"
        description="Requires a specific total before discount applies"
      >
        <TextInput
          type="number"
          placeholder="e.g. 50"
          value={minPurchaseAmount}
          onChange={(e) => onChangeMinPurchaseAmount(e.target.value)}
          prefix="$"
          containerClassName="w-full sm:w-56"
        />
      </OptionCard>

      {/* Option 3: Minimum Quantity of Items */}
      <OptionCard
        isSelected={selectedOption === "quantity"}
        onSelect={() => onChangeOption("quantity")}
        title="Minimum Quantity of Items"
        description="Requires a specific item count in cart"
      >
        <TextInput
          type="number"
          placeholder="e.g. 3"
          value={minQuantity}
          onChange={(e) => onChangeMinQuantity(e.target.value)}
          containerClassName="w-full sm:w-56"
        />
      </OptionCard>
    </div>
  );
}

export default MinimumRequirementSelector;
