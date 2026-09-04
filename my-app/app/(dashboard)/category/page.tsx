import { Suspense } from "react";
import { CategoryPage } from "@/modules/category/index";

export default function CategoryRoute() {
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}
