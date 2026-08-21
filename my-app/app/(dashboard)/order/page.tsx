import { Suspense } from "react";
import { OrderPage } from "@/modules/order/index";

export default function OrderRoute() {
  return (
    <Suspense>
      <OrderPage />
    </Suspense>
  );
}
