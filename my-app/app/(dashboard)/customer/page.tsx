import { Suspense } from "react";
import { CustomerPage } from "@/modules/customer/index";

export default function CustomerRoute() {
  return (
    <Suspense>
      <CustomerPage />
    </Suspense>
  );
}
