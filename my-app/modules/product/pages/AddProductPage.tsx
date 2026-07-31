"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { useAddProductForm, FormErrors } from "../hooks/useAddProductForm";
import { SkinType, SkinConcern, StepType } from "@/enums";

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

import { useAddProduct } from "@/app/api/hooks/useProducts";
import { CreateProductDto } from "@/types";

export function AddProductPage() {
  const router = useRouter();
  const [errors, setErrors] = React.useState<FormErrors>({});
  const { mutate: createProduct, isPending } = useAddProduct();

  const {
    state,
    calculatedSalePrice,
    validateForm,
    setField,
    toggleSkinType,
    toggleConcern,
    addVariant,
    updateVariant,
    removeVariant,
  } = useAddProductForm();

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

    const payload: CreateProductDto = {
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

    createProduct(payload, {
      onSuccess: () => {
        router.push("/product");
      },
      onError: (err: any) => {
        setErrors({ productName: err.message || "Failed to create product." });
      },
    });
  };

  const errorList = Object.values(errors).filter(Boolean);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Add New Product"
        subtitle="Fill in the details below to list a new item in your store catalog."
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
              {isPending ? "Saving Product..." : "Add Product"}
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
        <div className="lg:col-span-2 space-y-6">
          {/* Product Media Card */}
          <MediaUpload
            label="Product Media"
            multiple
            value={state.images}
            onChange={(val) => setField("images", val)}
          />

          {/* General Information Card */}
          <GeneralInformationCard
            productName={state.productName}
            onProductNameChange={(val) => setField("productName", val)}
            description={state.description}
            onDescriptionChange={(val) => setField("description", val)}
          />

          {/* Skincare Quiz & Attributes Card */}
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

          {/* Product Status Card */}
          <ProductStatusCard
            isActive={state.isActive}
            onToggleActive={() => setField("isActive", !state.isActive)}
          />

          {/* Promotional Sale Card */}
          <PromotionalSaleCard
            isOnSale={state.isOnSale}
            onToggleSale={() => setField("isOnSale", !state.isOnSale)}
            regularPrice={state.regularPrice}
            onRegularPriceChange={(val) => setField("regularPrice", val)}
            discountPercentage={state.discountPercentage}
            onDiscountPercentageChange={(val) => setField("discountPercentage", val)}
            calculatedSalePrice={calculatedSalePrice}
          />

          {/* Product Variants Card */}
          <ProductVariantsCard
            variants={state.variants}
            onAddVariantRow={addVariant}
            onUpdateVariant={updateVariant}
            onRemoveVariant={removeVariant}
          />
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-6">
          {/* Inventory Card */}
          <InventoryCard
            totalPrice={state.regularPrice}
            onTotalPriceChange={(val) => setField("regularPrice", val)}
          />

          {/* Organization Card */}
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
