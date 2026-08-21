import { Suspense } from "react";
import { OrderDetailPage } from "@/modules/order/index";

export default function OrderDetailsRoute() {
  return (
    <Suspense>
      <OrderDetailPage />
    </Suspense>
  );
}
