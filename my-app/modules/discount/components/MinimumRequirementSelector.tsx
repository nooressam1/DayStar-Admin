"use client";

import React from "react";
import { OptionCard, TextInput } from "@/modules/shared";
import { DiscountMinRequirement } from "@/enums";

export interface MinimumRequirementSelectorProps {
  selectedOption: DiscountMinRequirement;
  onChangeOption: (option: DiscountMinRequirement) => void;
  requirementValue: string;
  onChangeRequirementValue: (value: string) => void;
  error?: string;
  label?: string;
  className?: string;
}

export function MinimumRequirementSelector({
  selectedOption,
  onChangeOption,
  requirementValue,
  onChangeRequirementValue,
  error,
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
        isSelected={selectedOption === DiscountMinRequirement.NONE}
        onSelect={() => {
          onChangeOption(DiscountMinRequirement.NONE);
          onChangeRequirementValue("");
        }}
        title="None"
      />

      {/* Option 2: Minimum Purchase Amount ($) */}
      <OptionCard
        isSelected={selectedOption === DiscountMinRequirement.AMOUNT}
        onSelect={() => onChangeOption(DiscountMinRequirement.AMOUNT)}
        title="Minimum Purchase Amount ($)"
        description="Requires a specific total before discount applies"
      >
        <TextInput
          type="number"
          placeholder="e.g. 50"
          value={requirementValue}
          onChange={(e) => onChangeRequirementValue(e.target.value)}
          error={selectedOption === DiscountMinRequirement.AMOUNT ? error : undefined}
          prefix="$"
          containerClassName="w-full sm:w-56"
        />
      </OptionCard>

      {/* Option 3: Minimum Quantity of Items */}
      <OptionCard
        isSelected={selectedOption === DiscountMinRequirement.QUANTITY}
        onSelect={() => onChangeOption(DiscountMinRequirement.QUANTITY)}
        title="Minimum Quantity of Items"
        description="Requires a specific item count in cart"
      >
        <TextInput
          type="number"
          placeholder="e.g. 3"
          value={requirementValue}
          onChange={(e) => onChangeRequirementValue(e.target.value)}
          error={selectedOption === DiscountMinRequirement.QUANTITY ? error : undefined}
          containerClassName="w-full sm:w-56"
        />
      </OptionCard>
    </div>
  );
}

export default MinimumRequirementSelector;
