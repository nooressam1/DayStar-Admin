import { Order, OrderWithDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
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
