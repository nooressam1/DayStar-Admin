import { Suspense } from "react";
import { InventoryPage } from "@/modules/inventory/index";

export default function InventoryRoute() {
  return (
    <Suspense>
      <InventoryPage />
    </Suspense>
  );
}
