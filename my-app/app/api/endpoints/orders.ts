import { Order, OrderWithDetails } from "@/types";
import { apiClient, ENDPOINTS, serializeQueryParams } from "@/utils/api";

export interface OrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export class orderApi {
  static async getAdminOrders(
    params?: OrderParams
  ): Promise<{ items: Order[]; total: number }> {
    return await apiClient.request<{ items: Order[]; total: number }>(
      ENDPOINTS.ORDER.ADMIN_LIST,
      serializeQueryParams(params)
    );
  }

  static async getAdminOrder(id: string): Promise<OrderWithDetails | null> {
    try {
      return await apiClient.request<OrderWithDetails>(ENDPOINTS.ORDER.ADMIN_GET(id));
    } catch {
      return null;
    }
  }

  static async getOrder(id: string): Promise<Order | null> {
    try {
      return await apiClient.request<Order>(ENDPOINTS.ORDER.GET(id));
    } catch {
      return null;
    }
  }

  static async updateAdminOrderStatus(
    id: string,
    status: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.request<{ success: boolean; message: string }>(
      `/orders/admin/${id}/status`,
      undefined,
      {
        method: "PATCH",
        body: JSON.stringify({ status, reason }),
      }
    );
  }

  static async cancelAdminOrder(
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.request<{ success: boolean; message: string }>(
      `/orders/admin/${id}/cancel`,
      undefined,
      {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      }
    );
  }

  static async completePaymentAdminOrder(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.request<{ success: boolean; message: string }>(
      `/orders/admin/${id}/complete-payment`,
      undefined,
      {
        method: "PATCH",
      }
    );
  }

  static async completeDeliveryAdminOrder(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.request<{ success: boolean; message: string }>(
      `/orders/admin/${id}/complete-delivery`,
      undefined,
      {
        method: "PATCH",
      }
    );
  }
}
