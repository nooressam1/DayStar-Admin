"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader, Button, MediaUpload } from "@/modules/shared";
import {
  GeneralInformationCard,
  SkincareQuizCard,
  ProductStatusCard,
  PromotionalSaleCard,
  ProductVariantsCard,
  InventoryCard,
  OrganizationCard,
} from "../components";
import { useAddProductForm, FormErrors, mapProductToFormState } from "../hooks/useAddProductForm";
import { SkinType, SkinConcern, StepType } from "@/enums";
import { useAddProduct, useGetProduct, useUpdateProduct } from "@/app/api/hooks/useProducts";
import { CreateProductDto } from "@/types";

const skinTypeOptions = [
  SkinType.OILY,
  SkinType.DRY,
  SkinType.COMBINATION,
  SkinType.SENSITIVE,
  SkinType.NORMAL,
  "All Skin Types",
];
const skinConcernOptions = [
  SkinConcern.ACNE,
  SkinConcern.PIGMENTATION,
  SkinConcern.AGING,
  SkinConcern.REDNESS,
  SkinConcern.DRYNESS,
];
const stepTypeOptions = [
  StepType.CLEANSER,
  StepType.TONER,
  StepType.SERUM,
  StepType.TREATMENT,
  StepType.MOISTURIZER,
  StepType.SPF,
  StepType.UNASSIGNED,
];

export interface AddProductPageProps {
  productId?: string;
}

export function AddProductPage({ productId: propProductId }: AddProductPageProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = propProductId || searchParams.get("id") || "";
  const isEditMode = Boolean(productId);

  const [errors, setErrors] = React.useState<FormErrors>({});

  const { data: existingProduct, isLoading: isFetching } = useGetProduct(productId);
  const { mutate: createProduct, isPending: isCreating } = useAddProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(productId);

  const isPending = isCreating || isUpdating;

  const {
    state,
    calculatedSalePrice,
    validateForm,
    setField,
    setFormState,
    toggleSkinType,
    toggleConcern,
    addVariant,
    updateVariant,
    removeVariant,
  } = useAddProductForm();

  const loadedProductIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (isEditMode && existingProduct && loadedProductIdRef.current !== existingProduct.id) {
      loadedProductIdRef.current = existingProduct.id;
      setFormState(mapProductToFormState(existingProduct));
    }
  }, [isEditMode, existingProduct, setFormState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm();
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    const slug = state.productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    if (isEditMode) {
      const updatePayload: any = {
        name: state.productName,
        description: state.description,
        slug,
        category_id: state.category && state.category.trim() ? state.category.trim() : null,
        images: state.images,
        price: parseFloat(state.regularPrice) || 0,
        is_active: state.isActive,
        on_sale: state.isOnSale,
        discount_percentage: state.isOnSale ? parseFloat(state.discountPercentage) || null : null,
        skin_type: state.selectedSkinTypes,
        concern: state.selectedConcerns,
        step_type: state.routineStep,
        variants: state.variants.map((v) => ({
          id: v.id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v.id) ? v.id : undefined,
          size: v.size,
          sku: v.sku,
          stock: Number(v.stock) || 0,
        })),
      };

      updateProduct(updatePayload, {
        onSuccess: () => {
          router.push("/product");
        },
        onError: (err: any) => {
          setErrors({ productName: err.message || "Failed to update product." });
        },
      });
    } else {
      const createPayload: CreateProductDto = {
        name: state.productName,
        description: state.description,
        slug,
        category_id: state.category,
        images: state.images,
        price: parseFloat(state.regularPrice) || 0,
        is_active: state.isActive,
        on_sale: state.isOnSale,
        discount_percentage: state.isOnSale ? parseFloat(state.discountPercentage) || null : null,
        skin_type: state.selectedSkinTypes,
        concern: state.selectedConcerns,
        step_type: state.routineStep,
        variants: state.variants.map((v) => ({
          size: v.size,
          sku: v.sku,
          stock: Number(v.stock) || 0,
        })),
      };

      createProduct(createPayload, {
        onSuccess: () => {
          router.push("/product");
        },
        onError: (err: any) => {
          setErrors({ productName: err.message || "Failed to create product." });
        },
      });
    }
  };

  const errorList = Object.values(errors).filter(Boolean);

  if (isEditMode && isFetching) {
    return (
      <div className="py-12 text-center text-sm font-semibold text-[#8A756C]">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title={isEditMode ? "Edit Product" : "Add New Product"}
        subtitle={
          isEditMode
            ? "Update the details below for your item."
            : "Fill in the details below to list a new item in your store catalog."
        }
        backLink={{
          href: "/product",
          label: "Back to Product Catalog",
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => router.push("/product")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending
                ? "Saving Product..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </>
        }
      />

      {errorList.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm space-y-1">
          <p className="font-semibold">Please fix the following issues before saving:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errorList.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Content Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols Wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GeneralInformationCard
            productName={state.productName}
            onProductNameChange={(val) => setField("productName", val)}
            description={state.description}
            onDescriptionChange={(val) => setField("description", val)}
          />

          <SkincareQuizCard
            skinTypeOptions={skinTypeOptions}
            skinConcernOptions={skinConcernOptions}
            stepTypeOptions={stepTypeOptions}
            selectedSkinTypes={state.selectedSkinTypes}
            onToggleSkinType={toggleSkinType}
            selectedConcerns={state.selectedConcerns}
            onToggleConcern={toggleConcern}
            routineStep={state.routineStep}
            onRoutineStepChange={(val) => setField("routineStep", val)}
          />

          <MediaUpload
            label="Product Images"
            images={state.images}
            onChange={(imgs) => setField("images", imgs)}
            multiple={true}
            maxFiles={3}
            helperText="Upload up to 3 product images (SVG, PNG, JPG or GIF)"
          />

          <ProductVariantsCard
            variants={state.variants}
            onAddVariantRow={addVariant}
            onUpdateVariant={updateVariant}
            onRemoveVariant={removeVariant}
            hideAddVariant={isEditMode}
          />
        </div>

        {/* Right Column (1 Col Wide) */}
        <div className="flex flex-col gap-6">
          <ProductStatusCard
            isActive={state.isActive}
            onToggleActive={() => setField("isActive", !state.isActive)}
          />

          <PromotionalSaleCard
            isOnSale={state.isOnSale}
            onToggleSale={() => setField("isOnSale", !state.isOnSale)}
            regularPrice={state.regularPrice}
            onRegularPriceChange={(val) => setField("regularPrice", val)}
            discountPercentage={state.discountPercentage}
            onDiscountPercentageChange={(val) => setField("discountPercentage", val)}
            calculatedSalePrice={calculatedSalePrice}
          />

          <InventoryCard
            totalPrice={state.regularPrice}
            onTotalPriceChange={(val) => setField("regularPrice", val)}
          />

          <OrganizationCard
            category={state.category}
            onCategoryChange={(val) => setField("category", val)}
          />
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;
