import { Customer, CustomerQueryParams } from "@/types";
import { apiClient, serializeQueryParams } from "@/utils/api";

export class customerApi {
  static async getCustomers(
    params?: CustomerQueryParams
  ): Promise<{ items: Customer[]; total: number }> {
    try {
      const res = await apiClient.request<{ items: Customer[]; total: number }>(
        "/customers/admin",
        serializeQueryParams(params)
      );

      return {
        items: res?.items || [],
        total: res?.total || 0,
      };
    } catch (error) {
      console.error("Error fetching customers from backend:", error);
      return { items: [], total: 0 };
    }
  }

  static async toggleDisableCustomer(
    id: string,
    is_disabled: boolean
  ): Promise<{ success: boolean; customer: Customer }> {
    try {
      return await apiClient.request<{ success: boolean; customer: Customer }>(
        `/customers/admin/${id}/toggle-disable`,
        undefined,
        {
          method: "PATCH",
          body: JSON.stringify({ is_disabled }),
        }
      );
    } catch (error) {
      console.error(`Error toggling status for customer ${id}:`, error);
      throw error;
    }
  }
}
