import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../endpoints/categories";

export const useGetCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(),
  });
};
