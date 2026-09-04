"use client";

import { useReducer } from "react";

export interface EnabledSections {
  saleDetails: boolean;
  productStatus: boolean;
  skinQuiz: boolean;
  generalDetails: boolean;
  bulkNote: boolean;
}

export interface BulkEditFormData {
  enabledSections: EnabledSections;
  saleStatus: string;
  saleDiscountPercentage: string;
  productStatus: string;
  skinType: string;
  productConcerns: string;
  productStepType: string;
  category: string;
  bulkNote: string;
}

export interface BulkEditFormErrors {
  general?: string;
  saleStatus?: string;
  saleDiscountPercentage?: string;
  productStatus?: string;
  skinType?: string;
  productConcerns?: string;
  productStepType?: string;
  category?: string;
  bulkNote?: string;
}

export type BulkEditAction =
  | { type: "SET_FIELD"; field: keyof BulkEditFormData; value: any }
  | { type: "TOGGLE_SECTION"; section: keyof EnabledSections; enabled?: boolean }
  | { type: "RESET_FORM"; initialState?: Partial<BulkEditFormData> }
  | { type: "SET_STATE"; state: Partial<BulkEditFormData> };

export const initialBulkEditState: BulkEditFormData = {
  enabledSections: {
    saleDetails: false,
    productStatus: false,
    skinQuiz: false,
    generalDetails: false,
    bulkNote: false,
  },
  saleStatus: "Active",
  saleDiscountPercentage: "",
  productStatus: "Active",
  skinType: "Oily",
  productConcerns: "Oily",
  productStepType: "Toner",
  category: "",
  bulkNote: "....",
};

function bulkEditReducer(
  state: BulkEditFormData,
  action: BulkEditAction
): BulkEditFormData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_SECTION":
      return {
        ...state,
        enabledSections: {
          ...state.enabledSections,
          [action.section]:
            action.enabled !== undefined
              ? action.enabled
              : !state.enabledSections[action.section],
        },
      };
    case "RESET_FORM":
      return { ...initialBulkEditState, ...action.initialState };
    case "SET_STATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

export function useBulkEditForm(overrideInitialState?: Partial<BulkEditFormData>) {
  const [state, dispatch] = useReducer(
    bulkEditReducer,
    overrideInitialState
      ? { ...initialBulkEditState, ...overrideInitialState }
      : initialBulkEditState
  );

  const setField = (field: keyof BulkEditFormData, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const toggleSection = (section: keyof EnabledSections, enabled?: boolean) => {
    dispatch({ type: "TOGGLE_SECTION", section, enabled });
  };

  const resetForm = (newInitialState?: Partial<BulkEditFormData>) => {
    dispatch({ type: "RESET_FORM", initialState: newInitialState });
  };

  const setFormState = (newState: Partial<BulkEditFormData>) => {
    dispatch({ type: "SET_STATE", state: newState });
  };

  const validateForm = (): { isValid: boolean; errors: BulkEditFormErrors } => {
    const errors: BulkEditFormErrors = {};
    const {
      enabledSections,
      saleStatus,
      saleDiscountPercentage,
      productStatus,
      skinType,
      productConcerns,
      productStepType,
      category,
      bulkNote,
    } = state;

    const anyEnabled = Object.values(enabledSections).some(Boolean);
    if (!anyEnabled) {
      errors.general = "Please select at least one section to edit before saving.";
      return { isValid: false, errors };
    }

    // 1. Sale Details Validation
    if (enabledSections.saleDetails) {
      if (!saleStatus) {
        errors.saleStatus = "Please select a sale status.";
      }
      if (saleStatus === "Active") {
        const cleanDisc = saleDiscountPercentage.replace("%", "").trim();
        const discNum = parseFloat(cleanDisc);
        if (!cleanDisc || isNaN(discNum) || discNum <= 0 || discNum > 100) {
          errors.saleDiscountPercentage =
            "Please enter a discount percentage greater than 0% when sale status is Active.";
        }
      }
    }

    // 2. Product Status Validation
    if (enabledSections.productStatus) {
      if (!productStatus) {
        errors.productStatus = "Please select a product status.";
      }
    }

    // 3. Skin Quiz Validation
    if (enabledSections.skinQuiz) {
      if (!skinType.trim()) {
        errors.skinType = "Please select a skin type.";
      }
      if (!productConcerns.trim()) {
        errors.productConcerns = "Please select product concerns.";
      }
      if (!productStepType.trim()) {
        errors.productStepType = "Please select a routine step type.";
      }
    }

    // 4. General Details Validation
    if (enabledSections.generalDetails) {
      if (!category.trim()) {
        errors.category = "Please select a category.";
      }
    }

    // 5. Bulk Note Validation
    if (enabledSections.bulkNote) {
      if (!bulkNote.trim() || bulkNote === "....") {
        errors.bulkNote = "Please select or enter a valid bulk update note.";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    formData: state,
    state,
    enabledSections: state.enabledSections,
    dispatch,
    setField,
    handleChange: setField,
    toggleSection,
    resetForm,
    setFormState,
    validateForm,
  };
}

export default useBulkEditForm;
