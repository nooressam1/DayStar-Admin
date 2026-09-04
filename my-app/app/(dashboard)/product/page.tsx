import { Suspense } from "react";
import { ProductPage } from "@/modules/product/index";

export default function ProductRoute() {
  return (
    <Suspense>
      <ProductPage />
    </Suspense>
  );
}
