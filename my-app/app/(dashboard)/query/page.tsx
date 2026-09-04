import { Suspense } from "react";
import { QueryPage } from "@/modules/query/index";

export default function QueryRoute() {
  return (
    <Suspense>
      <QueryPage />
    </Suspense>
  );
}
