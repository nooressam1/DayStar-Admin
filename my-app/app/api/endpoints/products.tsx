import { Product, ProductParams, CreateProductDto } from "@/types";
import { apiClient, ENDPOINTS, serializeQueryParams } from "@/utils/api";

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
      return await apiClient.request<{ items: Product[]; total: number }>(
        ENDPOINTS.PRODUCT.LIST,
        serializeQueryParams(params)
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return { items: [], total: 0 };
    }
  }

  static async createProduct(dto: CreateProductDto): Promise<Product> {
    return await apiClient.request<Product>(ENDPOINTS.PRODUCT.LIST, undefined, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  static async bulkUpdateProducts(payload: {
    ids: string[];
    on_sale?: boolean;
    discount_percentage?: number | null;
    is_active?: boolean;
    skin_type?: string[];
    concern?: string[];
    step_type?: string;
    category_id?: string;
  }): Promise<Product[]> {
    return await apiClient.request<Product[]>(`${ENDPOINTS.PRODUCT.LIST}/bulk`, undefined, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
  static async updateProduct(id: string, payload: any): Promise<Product> {
    return await apiClient.request<Product>(`${ENDPOINTS.PRODUCT.LIST}/${id}`, undefined, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
}
