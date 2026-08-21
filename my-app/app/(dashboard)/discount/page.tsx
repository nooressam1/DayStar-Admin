import { Suspense } from "react";
import { DiscountPage } from "@/modules/discount/index";

export default function DiscountRoute() {
  return (
    <Suspense>
      <DiscountPage />
    </Suspense>
  );
}
