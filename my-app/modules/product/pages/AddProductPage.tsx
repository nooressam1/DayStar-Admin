"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Button, MediaUpload } from "@/modules/shared";
import { ProductVariant } from "@/types";
import {
  GeneralInformationCard,
  SkincareQuizCard,
  ProductStatusCard,
  PromotionalSaleCard,
  ProductVariantsCard,
  InventoryCard,
  OrganizationCard,
} from "../components";




const skinTypeOptions = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "All Skin Types"];
const skinConcernOptions = [
  "Acne & Blemishes",
  "Aging & Fine Lines",
  "Hyperpigmentation",
  "Dryness & Dehydration",
  "Redness & Sensitivity",
  "Uneven Texture",
  "Enlarged Pores",
];
const stepTypeOptions = [
  "Cleanser",
  "Toner",
  "Serum / Treatment",
  "Moisturizer",
  "Sunscreen / SPF",
  "Eye Cream",
  "Exfoliator / Mask",
];

export function AddProductPage() {
  const router = useRouter();

  // Media state
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608248597263-00de4680826d?w=300&auto=format&fit=crop&q=80",
  ]);

  // General Info state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  // Skincare Quiz Fields
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(["Combination", "Sensitive"]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(["Acne & Blemishes", "Dryness & Dehydration"]);
  const [routineStep, setRoutineStep] = useState("Serum / Treatment");

  // Status & Sale states (Separate)
  const [isActive, setIsActive] = useState(true);
  const [isOnSale, setIsOnSale] = useState(false);

  // Pricing (Percentage based discount for sale items)
  const [regularPrice, setRegularPrice] = useState("35.00");
  const [discountPercentage, setDiscountPercentage] = useState("20");

  // Variants state (Sizes & Stock)
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "var-1", size: "30ml / 1 fl oz", sku: "SKU-SERUM-30", price: 28.00, stock: 50 },
    { id: "var-2", size: "50ml / 1.7 fl oz", sku: "SKU-SERUM-50", price: 42.00, stock: 35 },
  ]);

  // Sidebar Inventory & Organization
  const [mainSku, setMainSku] = useState("SKU-12345");
  const [totalQuantity, setTotalQuantity] = useState("85");
  const [category, setCategory] = useState("Skincare");

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleAddVariantRow = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      size: "100ml / 3.4 fl oz",
      sku: `SKU-SERUM-${variants.length + 1}`,
      price: 65.00,
      stock: 20,
    };
    setVariants([...variants, newVar]);
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: ProductVariant[keyof ProductVariant]) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const calculateCalculatedSalePrice = () => {
    const reg = parseFloat(regularPrice) || 0;
    const disc = parseFloat(discountPercentage) || 0;
    if (reg <= 0 || disc <= 0) return reg.toFixed(2);
    const sale = reg * (1 - disc / 100);
    return Math.max(0, sale).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/product");
  };

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
            >
              Add Product
            </Button>
          </>
        }
      />

      {/* Form Content Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Media Card */}
          <MediaUpload
            label="Product Media"
            multiple
            value={images}
            onChange={setImages}
          />

          {/* General Information Card */}
          <GeneralInformationCard
            productName={productName}
            onProductNameChange={setProductName}
            description={description}
            onDescriptionChange={setDescription}
          />

          {/* Skincare Quiz & Attributes Card */}
          <SkincareQuizCard
            skinTypeOptions={skinTypeOptions}
            skinConcernOptions={skinConcernOptions}
            stepTypeOptions={stepTypeOptions}
            selectedSkinTypes={selectedSkinTypes}
            onToggleSkinType={toggleSkinType}
            selectedConcerns={selectedConcerns}
            onToggleConcern={toggleConcern}
            routineStep={routineStep}
            onRoutineStepChange={setRoutineStep}
          />

          {/* Product Status Card */}
          <ProductStatusCard
            isActive={isActive}
            onToggleActive={() => setIsActive(!isActive)}
          />

          {/* Promotional Sale Card */}
          <PromotionalSaleCard
            isOnSale={isOnSale}
            onToggleSale={() => setIsOnSale(!isOnSale)}
            regularPrice={regularPrice}
            onRegularPriceChange={setRegularPrice}
            discountPercentage={discountPercentage}
            onDiscountPercentageChange={setDiscountPercentage}
            calculatedSalePrice={calculateCalculatedSalePrice()}
          />

          {/* Product Variants Card */}
          <ProductVariantsCard
            variants={variants}
            onAddVariantRow={handleAddVariantRow}
            onUpdateVariant={handleUpdateVariant}
            onRemoveVariant={handleRemoveVariant}
          />
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-6">
          {/* Inventory Card */}
          <InventoryCard
            mainSku={mainSku}
            onMainSkuChange={setMainSku}
            totalQuantity={totalQuantity}
            onTotalQuantityChange={setTotalQuantity}
          />

          {/* Organization Card */}
          <OrganizationCard
            category={category}
            onCategoryChange={setCategory}
          />
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;
