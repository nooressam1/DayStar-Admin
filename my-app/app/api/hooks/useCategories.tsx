import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../endpoints/categories";
import { Category, CategoryQueryParams } from "@/types";

export const useGetCategories = (params?: CategoryQueryParams) => {
  return useQuery<{ items: Category[]; total: number }, Error>({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getCategories(params),
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

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { id: string; payload: Partial<Category> }>({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Category> }) =>
      categoryApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

