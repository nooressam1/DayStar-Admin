import { Category, CategoryQueryParams } from "@/types";
import { apiClient, ENDPOINTS, serializeQueryParams } from "@/utils/api";

export class categoryApi {
  static async getCategories(
    params?: CategoryQueryParams
  ): Promise<{ items: Category[]; total: number }> {
    try {
      const res = await apiClient.request<any>(
        ENDPOINTS.CATEGORY.LIST,
        serializeQueryParams(params)
      );

      let items: Category[] = [];

      if (Array.isArray(res)) {
        items = res;
      } else if (res && Array.isArray(res.items)) {
        items = res.items;
      } else if (res && Array.isArray(res.data)) {
        items = res.data;
      }

      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        items = items.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.slug?.toLowerCase().includes(q)
        );
      }

      if (params?.status && params.status !== "All Statuses") {
        const targetStatus = params.status.toLowerCase().trim();
        items = items.filter((c) => {
          const catStatus = typeof c.status === "boolean"
            ? (c.status ? "active" : "inactive")
            : String(c.status || "active").toLowerCase().trim();
          return catStatus === targetStatus;
        });
      }

      const total = items.length;
      const page = params?.page;
      const limit = params?.limit;

      const paginatedItems = page && limit
        ? items.slice((page - 1) * limit, page * limit)
        : items;

      return {
        items: paginatedItems,
        total,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { items: [], total: 0 };
    }
  }

  static async getCategory(id: string): Promise<Category | null> {
    try {
      return await apiClient.request<Category>(ENDPOINTS.CATEGORY.BY_ID(id));
    } catch {
      return null;
    }
  }

  static async createCategory(payload: Partial<Category>): Promise<Category> {
    try {
      return await apiClient.request<Category>(ENDPOINTS.CATEGORY.LIST, undefined, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateCategory(id: string, payload: Partial<Category>): Promise<Category> {
    try {
      return await apiClient.request<Category>(ENDPOINTS.CATEGORY.BY_ID(id), undefined, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<{ success: boolean }> {
    try {
      return await apiClient.request<{ success: boolean }>(ENDPOINTS.CATEGORY.BY_ID(id), undefined, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
}
