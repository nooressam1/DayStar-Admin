"use client";

import { useReducer, useCallback } from "react";
import { DiscountType, DiscountMinRequirement } from "@/enums";
import { isDiscountCodeTaken } from "../utils/discountStorage";
import { DiscountRecord } from "../pages/DiscountPage";

// ── State ──────────────────────────────────────────────

export interface AddDiscountState {
  code: string;
  discountType: DiscountType;
  value: string;
  isActive: boolean;
  minRequirementOption: DiscountMinRequirement;
  minRequirementValue: string;
  startDate: string;
  endDate: string;
}

const initialState: AddDiscountState = {
  code: "SUMMER-SALE-20",
  discountType: DiscountType.PERCENTAGE,
  value: "20",
  isActive: true,
  minRequirementOption: DiscountMinRequirement.NONE,
  minRequirementValue: "",
  startDate: "2026-06-01",
  endDate: "",
};

// ── Actions ────────────────────────────────────────────

export type AddDiscountAction =
  | { type: "SET_FIELD"; field: keyof AddDiscountState; value: any }
  | { type: "SET_STATE"; state: Partial<AddDiscountState> }
  | { type: "CHANGE_DISCOUNT_TYPE"; discountType: DiscountType }
  | { type: "CHANGE_MIN_REQUIREMENT"; option: DiscountMinRequirement };

// ── Reducer ────────────────────────────────────────────

function addDiscountReducer(state: AddDiscountState, action: AddDiscountAction): AddDiscountState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_STATE":
      return { ...state, ...action.state };

    case "CHANGE_DISCOUNT_TYPE": {
      const newType = action.discountType;
      let newValue = state.value;

      if (newType === DiscountType.FREE_SHIPPING) {
        newValue = "0";
      } else if (newType === DiscountType.PERCENTAGE && state.value === "0") {
        newValue = "20";
      }

      return { ...state, discountType: newType, value: newValue };
    }

    case "CHANGE_MIN_REQUIREMENT":
      return {
        ...state,
        minRequirementOption: action.option,
        minRequirementValue: "",
      };

    default:
      return state;
  }
}

// ── Errors ─────────────────────────────────────────────

export interface DiscountFormErrors {
  code?: string;
  value?: string;
  minRequirement?: string;
  startDate?: string;
  endDate?: string;
}

// ── Hook ───────────────────────────────────────────────

export function useAddDiscountForm(overrideInitialState?: Partial<AddDiscountState>) {
  const [state, dispatch] = useReducer(
    addDiscountReducer,
    overrideInitialState ? { ...initialState, ...overrideInitialState } : initialState
  );

  const isFreeShipping = state.discountType === DiscountType.FREE_SHIPPING;
  const isPercentage = state.discountType === DiscountType.PERCENTAGE;
  const isFixedAmount = state.discountType === DiscountType.FIXED_AMOUNT;

  const setField = useCallback(<K extends keyof AddDiscountState>(field: K, value: AddDiscountState[K]) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const setFormState = useCallback((newState: Partial<AddDiscountState>) => {
    dispatch({ type: "SET_STATE", state: newState });
  }, []);

  const changeDiscountType = useCallback((discountType: DiscountType) => {
    dispatch({ type: "CHANGE_DISCOUNT_TYPE", discountType });
  }, []);

  const changeMinRequirement = useCallback((option: DiscountMinRequirement) => {
    dispatch({ type: "CHANGE_MIN_REQUIREMENT", option });
  }, []);

  const validateForm = useCallback((existingDiscounts: DiscountRecord[] = [], excludeId?: string): { isValid: boolean; errors: DiscountFormErrors } => {
    const errors: DiscountFormErrors = {};

    const formattedCode = state.code.trim();
    if (!formattedCode) {
      errors.code = "Discount code is required.";
    } else if (isDiscountCodeTaken(formattedCode, existingDiscounts, excludeId)) {
      errors.code = "This discount code already exists. Discount codes cannot be repeated.";
    }


    if (!isFreeShipping) {
      const numVal = parseFloat(state.value);
      if (!state.value.trim() || isNaN(numVal) || numVal <= 0) {
        errors.value = "Please enter a valid amount greater than 0.";
      } else if (isPercentage && numVal > 100) {
        errors.value = "Percentage discount cannot exceed 100%.";
      }
    }

    if (state.minRequirementOption === DiscountMinRequirement.AMOUNT) {
      const minAmt = parseFloat(state.minRequirementValue);
      if (!state.minRequirementValue.trim() || isNaN(minAmt) || minAmt <= 0) {
        errors.minRequirement = "Please enter a valid minimum amount greater than $0.";
      }
    } else if (state.minRequirementOption === DiscountMinRequirement.QUANTITY) {
      const minQty = parseInt(state.minRequirementValue, 10);
      if (!state.minRequirementValue.trim() || isNaN(minQty) || minQty <= 0) {
        errors.minRequirement = "Please enter a valid minimum quantity greater than 0.";
      }
    }

    if (!state.startDate) {
      errors.startDate = "Start date is required.";
    }

    if (state.startDate && state.endDate && new Date(state.endDate) < new Date(state.startDate)) {
      errors.endDate = "End date cannot be earlier than start date.";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }, [state, isFreeShipping, isPercentage]);

  return {
    state,
    dispatch,
    isFreeShipping,
    isPercentage,
    isFixedAmount,
    setField,
    setFormState,
    changeDiscountType,
    changeMinRequirement,
    validateForm,
  };
}

export default useAddDiscountForm;
