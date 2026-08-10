import { apiClient, ENDPOINTS } from "@/utils/api";

export interface CreateDiscountPayload {
  code: string;
  type: string;
  value: number;
  is_active?: boolean;
  min_requirement_type?: string;
  min_requirement_value?: number;
  active_start_date?: string;
  active_end_date?: string;
}

export interface UpdateDiscountPayload {
  code?: string;
  type?: string;
  value?: number;
  is_active?: boolean;
  min_requirement_type?: string;
  min_requirement_value?: number;
  active_start_date?: string;
  active_end_date?: string;
}

export class discountsApi {
  static async getDiscounts(): Promise<any[]> {
    try {
      const res = await apiClient.request<any[]>(ENDPOINTS.DISCOUNT.LIST, undefined, {
        method: "GET",
      });
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error("Error fetching discounts:", error);
      return [];
    }
  }

  static async getDiscountByCode(code: string): Promise<any | null> {
    try {
      return await apiClient.request<any>(ENDPOINTS.DISCOUNT.GET(code));
    } catch {
      return null;
    }
  }

  static async createDiscount(payload: CreateDiscountPayload): Promise<any> {
    try {
      return await apiClient.request<any>(ENDPOINTS.DISCOUNT.CREATE, undefined, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error creating discount:", error);
      throw error;
    }
  }

  static async updateDiscount(id: string, payload: UpdateDiscountPayload): Promise<any> {
    try {
      return await apiClient.request<any>(ENDPOINTS.DISCOUNT.UPDATE(id), undefined, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(`Error updating discount ${id}:`, error);
      throw error;
    }
  }

  static async deleteDiscount(id: string): Promise<{ success: boolean }> {
    try {
      return await apiClient.request<{ success: boolean }>(ENDPOINTS.DISCOUNT.DELETE(id), undefined, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error deleting discount ${id}:`, error);
      throw error;
    }
  }
}
