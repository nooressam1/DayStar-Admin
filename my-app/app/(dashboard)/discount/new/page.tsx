import { Suspense } from "react";
import { AddDiscountPage } from "@/modules/discount/index";

export default function AddDiscountRoute() {
  return (
    <Suspense>
      <AddDiscountPage />
    </Suspense>
  );
}
