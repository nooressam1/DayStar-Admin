import { Suspense } from "react";
import { QueryPage } from "@/modules/query/index";

export default function QueriesRoute() {
  return (
    <Suspense>
      <QueryPage />
    </Suspense>
  );
}
