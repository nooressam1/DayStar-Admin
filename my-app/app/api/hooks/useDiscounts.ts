import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discountsApi, CreateDiscountPayload, UpdateDiscountPayload } from "../endpoints/discounts";

export const useGetDiscounts = () => {
  return useQuery<any[], Error>({
    queryKey: ["discounts"],
    queryFn: () => discountsApi.getDiscounts(),
  });
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateDiscountPayload>({
    mutationFn: (payload: CreateDiscountPayload) => discountsApi.createDiscount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string; payload: UpdateDiscountPayload }>({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDiscountPayload }) =>
      discountsApi.updateDiscount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id: string) => discountsApi.deleteDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};
