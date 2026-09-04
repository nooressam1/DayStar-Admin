import { Suspense } from "react";
import { AddProductPage } from "@/modules/product/index";

export default function AddProductRoute() {
  return (
    <Suspense>
      <AddProductPage />
    </Suspense>
  );
}
