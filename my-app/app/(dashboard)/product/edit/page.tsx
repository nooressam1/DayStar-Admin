import { Suspense } from "react";
import { BulkEditProductsPage } from "@/modules/product/index";

export default function EditProductRoute() {
  return (
    <Suspense>
      <BulkEditProductsPage />
    </Suspense>
  );
}
