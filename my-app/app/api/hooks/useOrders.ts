import { Order, OrderWithDetails } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi, OrderParams } from "../endpoints/orders";

export const useGetAdminOrders = (params?: OrderParams) => {
  return useQuery<{ items: Order[]; total: number }, Error>({
    queryKey: ["admin-orders", params],
    queryFn: () => orderApi.getAdminOrders(params),
  });
};

export const useGetAdminOrder = (id: string) => {
  return useQuery<OrderWithDetails | null, Error>({
    queryKey: ["admin-order", id],
    queryFn: () => orderApi.getAdminOrder(id),
    enabled: Boolean(id),
  });
};

export const useGetOrder = (id: string) => {
  return useQuery<Order | null, Error>({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrder(id),
    enabled: Boolean(id),
  });
};

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { id: string; status: string; reason?: string }
  >({
    mutationFn: ({ id, status, reason }) =>
      orderApi.updateAdminOrderStatus(id, status, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.id] });
    },
  });
};

export const useCancelAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { id: string; reason?: string }
  >({
    mutationFn: ({ id, reason }) => orderApi.cancelAdminOrder(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.id] });
    },
  });
};

export const useCompletePaymentAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    string
  >({
    mutationFn: (id: string) => orderApi.completePaymentAdminOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
    },
  });
};
