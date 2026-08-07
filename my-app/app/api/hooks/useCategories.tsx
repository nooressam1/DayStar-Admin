import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../endpoints/categories";
import { Category } from "@/types";

export const useGetCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, Partial<Category>>({
    mutationFn: (payload: Partial<Category>) => categoryApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

