"use client";

import { useReducer, useMemo } from "react";
import { ProductVariant } from "@/types";

export interface AddProductState {
  images: string[];
  productName: string;
  description: string;
  selectedSkinTypes: string[];
  selectedConcerns: string[];
  routineStep: string;
  isActive: boolean;
  isOnSale: boolean;
  regularPrice: string;
  discountPercentage: string;
  variants: ProductVariant[];
  totalQuantity: string;
  category: string;
}

export type AddProductAction =
  | { type: "SET_FIELD"; field: keyof AddProductState; value: any }
  | { type: "SET_STATE"; state: Partial<AddProductState> }
  | { type: "TOGGLE_SKIN_TYPE"; skinType: string }
  | { type: "TOGGLE_CONCERN"; concern: string }
  | { type: "ADD_VARIANT" }
  | { type: "UPDATE_VARIANT"; id: string; field: keyof ProductVariant; value: any }
  | { type: "REMOVE_VARIANT"; id: string };

import { StepType } from "@/enums";

const initialState: AddProductState = {
  images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80"],
  productName: "",
  description: "",
  selectedSkinTypes: ["Combination", "Sensitive"],
  selectedConcerns: ["Acne & Blemishes", "Dryness & Dehydration"],
  routineStep: StepType.SERUM,
  isActive: true,
  isOnSale: false,
  regularPrice: "35.00",
  discountPercentage: "20",
  variants: [{ id: "var-1", size: "30ml", sku: "SKU-SERUM-30", stock: 50 }],
  totalQuantity: "85",
  category: "",
};

function addProductReducer(state: AddProductState, action: AddProductAction): AddProductState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_STATE":
      return { ...state, ...action.state };

    case "TOGGLE_SKIN_TYPE":
      return {
        ...state,
        selectedSkinTypes: state.selectedSkinTypes.includes(action.skinType)
          ? state.selectedSkinTypes.filter((t) => t !== action.skinType)
          : [...state.selectedSkinTypes, action.skinType],
      };

    case "TOGGLE_CONCERN":
      return {
        ...state,
        selectedConcerns: state.selectedConcerns.includes(action.concern)
          ? state.selectedConcerns.filter((c) => c !== action.concern)
          : [...state.selectedConcerns, action.concern],
      };

    case "ADD_VARIANT": {
      const newVar: ProductVariant = {
        id: `var-${Date.now()}`,
        size: "100ml / 3.4 fl oz",
        sku: `SKU-SERUM-${state.variants.length + 1}`,
        stock: 20,
      };
      return { ...state, variants: [...state.variants, newVar] };
    }

    case "UPDATE_VARIANT":
      return {
        ...state,
        variants: state.variants.map((v) =>
          v.id === action.id ? { ...v, [action.field]: action.value } : v
        ),
      };

    case "REMOVE_VARIANT":
      if (state.variants.length <= 1) return state;
      return {
        ...state,
        variants: state.variants.filter((v) => v.id !== action.id),
      };

    default:
      return state;
  }
}

export interface FormErrors {
  images?: string;
  productName?: string;
  description?: string;
  selectedSkinTypes?: string;
  selectedConcerns?: string;
  routineStep?: string;
  regularPrice?: string;
  discountPercentage?: string;
  variants?: string;
  totalQuantity?: string;
  category?: string;
}

export function useAddProductForm(overrideInitialState?: Partial<AddProductState>) {
  const [state, dispatch] = useReducer(
    addProductReducer,
    overrideInitialState ? { ...initialState, ...overrideInitialState } : initialState
  );

  const calculatedSalePrice = useMemo(() => {
    const reg = parseFloat(state.regularPrice) || 0;
    const disc = parseFloat(state.discountPercentage) || 0;
    if (reg <= 0 || disc <= 0) return reg.toFixed(2);
    return Math.max(0, reg * (1 - disc / 100)).toFixed(2);
  }, [state.regularPrice, state.discountPercentage]);

  const validateForm = (): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};

    if (!state.images || state.images.length === 0) {
      errors.images = "At least one product image is required.";
    }
    if (!state.productName.trim()) {
      errors.productName = "Product name is required.";
    }
    if (!state.description.trim()) {
      errors.description = "Product description is required.";
    }
    if (!state.selectedSkinTypes || state.selectedSkinTypes.length === 0) {
      errors.selectedSkinTypes = "Select at least one skin type.";
    }
    if (!state.selectedConcerns || state.selectedConcerns.length === 0) {
      errors.selectedConcerns = "Select at least one skin concern.";
    }
    if (!state.routineStep.trim()) {
      errors.routineStep = "Routine step is required.";
    }
    if (!state.regularPrice.trim() || isNaN(parseFloat(state.regularPrice)) || parseFloat(state.regularPrice) <= 0) {
      errors.regularPrice = "Please enter a valid price.";
    }
    if (state.isOnSale && (!state.discountPercentage.trim() || isNaN(parseFloat(state.discountPercentage)))) {
      errors.discountPercentage = "Please enter a valid discount percentage.";
    }
    if (!state.variants || state.variants.length === 0) {
      errors.variants = "At least one variant is required.";
    } else {
      const hasInvalidVariant = state.variants.some(
        (v) => !v.size.trim() || !v.sku.trim() || v.stock < 0
      );
      if (hasInvalidVariant) {
        errors.variants = "All variants must have size, SKU, and valid stock quantity.";
      }
    }

    if (!state.totalQuantity.trim() || isNaN(parseInt(state.totalQuantity)) || parseInt(state.totalQuantity) < 0) {
      errors.totalQuantity = "Please enter a valid total quantity.";
    }
    if (!state.category.trim()) {
      errors.category = "Category is required.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const setField = (field: keyof AddProductState, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const toggleSkinType = (skinType: string) => {
    dispatch({ type: "TOGGLE_SKIN_TYPE", skinType });
  };

  const toggleConcern = (concern: string) => {
    dispatch({ type: "TOGGLE_CONCERN", concern });
  };

  const addVariant = () => {
    dispatch({ type: "ADD_VARIANT" });
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    dispatch({ type: "UPDATE_VARIANT", id, field, value });
  };

  const removeVariant = (id: string) => {
    dispatch({ type: "REMOVE_VARIANT", id });
  };

  const setFormState = (newState: Partial<AddProductState>) => {
    dispatch({ type: "SET_STATE", state: newState });
  };

  return {
    state,
    dispatch,
    calculatedSalePrice,
    validateForm,
    setField,
    setFormState,
    toggleSkinType,
    toggleConcern,
    addVariant,
    updateVariant,
    removeVariant,
  };
}

export function mapProductToFormState(product: any): Partial<AddProductState> {
  if (!product) return {};

  const priceVal = Number(product.price) || 0;
  const regularPrice = priceVal > 500 ? (priceVal / 100).toFixed(2) : priceVal.toFixed(2);

  return {
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [],
    productName: product.name || "",
    description: product.description || "",
    selectedSkinTypes: Array.isArray(product.skin_type) ? product.skin_type : [],
    selectedConcerns: Array.isArray(product.concern) ? product.concern : [],
    routineStep: product.step_type || "",
    isActive: product.is_active ?? true,
    isOnSale: product.on_sale ?? false,
    regularPrice,
    discountPercentage:
      product.discount_percentage !== undefined && product.discount_percentage !== null
        ? product.discount_percentage.toString()
        : "",
    category: product.category_id || product.category?.id || "",
    variants:
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants.map((v: any) => ({
            id: v.id,
            size: v.size || "",
            sku: v.sku || "",
            stock: v.stock ?? 0,
          }))
        : [{ id: `var-${Date.now()}`, size: "Standard", sku: `SKU-${product.id || '1'}`, stock: 0 }],
  };
}

export default useAddProductForm;
