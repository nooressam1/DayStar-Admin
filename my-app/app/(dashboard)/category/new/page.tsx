import { Suspense } from "react";
import { AddCategoryPage } from "@/modules/category/index";

export default function AddCategoryRoute() {
  return (
    <Suspense>
      <AddCategoryPage />
    </Suspense>
  );
}
