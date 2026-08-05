import { Order, OrderWithDetails } from "@/types";
import { apiClient, ENDPOINTS } from "@/utils/api";

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
    const stringParams: Record<string, string> = {};
    if (params?.page) stringParams.page = params.page.toString();
    if (params?.limit) stringParams.limit = params.limit.toString();
    if (params?.status) stringParams.status = params.status;
    if (params?.search) stringParams.search = params.search;

    return await apiClient.request<{ items: Order[]; total: number }>(
      ENDPOINTS.ORDER.ADMIN_LIST,
      stringParams
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
}
