import { Product, ProductParams, CreateProductDto } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../endpoints/products";

export const useGetProducts = (params?: ProductParams) => {
  return useQuery<{ items: Product[]; total: number }, Error>({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery<Product | null, Error>({
    queryKey: ["product", id],
    queryFn: () => productApi.getProduct(id),
    enabled: Boolean(id),
  });
};
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductDto>({
    mutationFn: (newProduct) => productApi.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
};

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();

  return useMutation<Product[], Error, Parameters<typeof productApi.bulkUpdateProducts>[0]>({
    mutationFn: (payload) => productApi.bulkUpdateProducts(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, any>({
    mutationFn: (payload) => productApi.updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
};
