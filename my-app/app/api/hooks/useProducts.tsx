import { Product, ProductParams } from "@/types";
import { useQuery } from "@tanstack/react-query";
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
