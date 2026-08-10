import { Customer, CustomerQueryParams } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "../endpoints/customers";

export const useGetCustomers = (params?: CustomerQueryParams) => {
  return useQuery<{ items: Customer[]; total: number }, Error>({
    queryKey: ["admin-customers", params],
    queryFn: () => customerApi.getCustomers(params),
  });
};

export const useToggleDisableCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; customer: Customer },
    Error,
    { id: string; is_disabled: boolean }
  >({
    mutationFn: ({ id, is_disabled }) =>
      customerApi.toggleDisableCustomer(id, is_disabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });
};
