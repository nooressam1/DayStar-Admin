import { Product, ProductParams } from "@/types";
import { apiClient, ENDPOINTS } from "@/utils/api";

export class productApi {
  static async getProduct(id: string): Promise<Product | null> {
    try {
      return await apiClient.request<Product>(ENDPOINTS.PRODUCT.BY_ID(id));
    } catch {
      return null;
    }
  }

  static async getProducts(params?: ProductParams): Promise<{ items: Product[]; total: number }> {
    try {
      const stringParams: Record<string, string> = {};
      if (params?.page) stringParams.page = params.page.toString();
      if (params?.limit) stringParams.limit = params.limit.toString();
      if (params?.categoryId) stringParams.categoryId = params.categoryId;
      if (params?.collection) stringParams.collection = params.collection;
      if (params?.search) stringParams.search = params.search;
      if (params?.discount) stringParams.discount = params.discount.toString();

      return await apiClient.request<{ items: Product[]; total: number }>(
        ENDPOINTS.PRODUCT.LIST,
        stringParams
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return { items: [], total: 0 };
    }
  }
}