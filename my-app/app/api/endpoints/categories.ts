import { Category } from "@/types";
import { apiClient, ENDPOINTS } from "@/utils/api";

export class categoryApi {
  static async getCategories(): Promise<Category[]> {
    try {
      return await apiClient.request<Category[]>(ENDPOINTS.CATEGORY.LIST);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async getCategory(id: string): Promise<Category | null> {
    try {
      return await apiClient.request<Category>(ENDPOINTS.CATEGORY.BY_ID(id));
    } catch {
      return null;
    }
  }
}
