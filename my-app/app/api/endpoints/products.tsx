import { Product, ProductParams, CreateProductDto } from "@/types";
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
      if (params?.includeInactive !== undefined) stringParams.includeInactive = params.includeInactive.toString();
      if (params?.all !== undefined) stringParams.all = params.all.toString();

      return await apiClient.request<{ items: Product[]; total: number }>(
        ENDPOINTS.PRODUCT.LIST,
        stringParams
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
