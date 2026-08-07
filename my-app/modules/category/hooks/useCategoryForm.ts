"use client";

import { useReducer, useCallback } from "react";
import { Category } from "@/types";

// ── Form State Interface ──────────────────────────────────────────

export interface CategoryFormState {
  name: string;
  slug: string;
  photo: string;
  status: string;
}

const initialCategoryState: CategoryFormState = {
  name: "",
  slug: "",
  photo: "",
  status: "Active",
};

// ── Reducer Action Types ──────────────────────────────────────────

export type CategoryFormAction =
  | { type: "SET_FIELD"; field: keyof CategoryFormState; value: string }
  | { type: "SET_STATE"; state: Partial<CategoryFormState> }
  | { type: "RESET" };

function categoryFormReducer(
  state: CategoryFormState,
  action: CategoryFormAction
): CategoryFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_STATE":
      return { ...state, ...action.state };

    case "RESET":
      return initialCategoryState;

    default:
      return state;
  }
}

// ── Validation Errors Interface ───────────────────────────────────

export interface CategoryFormErrors {
  name?: string;
  slug?: string;
  photo?: string;
}

// ── Custom Hook ───────────────────────────────────────────────────

export function useCategoryForm(overrideInitialState?: Partial<CategoryFormState>) {
  const [state, dispatch] = useReducer(
    categoryFormReducer,
    overrideInitialState
      ? { ...initialCategoryState, ...overrideInitialState }
      : initialCategoryState
  );

  const setField = useCallback(
    <K extends keyof CategoryFormState>(field: K, value: CategoryFormState[K]) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    []
  );

  const setFormState = useCallback((newState: Partial<CategoryFormState>) => {
    dispatch({ type: "SET_STATE", state: newState });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const validateForm = useCallback(
    (existingCategories: Category[] = [], excludeId?: string): { isValid: boolean; errors: CategoryFormErrors } => {
      const errors: CategoryFormErrors = {};

      if (!state.photo || !state.photo.trim()) {
        errors.photo = "Category photo is required.";
      }

      const trimmedName = state.name.trim();
      if (!trimmedName) {
        errors.name = "Category name is required.";
      } else if (
        existingCategories.some(
          (c) => c.name.trim().toLowerCase() === trimmedName.toLowerCase() && c.id !== excludeId
        )
      ) {
        errors.name = "A category with this name already exists.";
      }

      if (state.slug.trim()) {
        const normalizedSlug = state.slug.trim().toLowerCase();
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(normalizedSlug)) {
          errors.slug = "Slug must contain only lowercase letters, numbers, and hyphens.";
        } else if (
          existingCategories.some(
            (c) => (c.slug || "").trim().toLowerCase() === normalizedSlug && c.id !== excludeId
          )
        ) {
          errors.slug = "This category slug is already in use.";
        }
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    },
    [state]
  );

  return {
    state,
    dispatch,
    setField,
    setFormState,
    resetForm,
    validateForm,
  };
}

export default useCategoryForm;
