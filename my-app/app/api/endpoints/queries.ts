import {
  ContactSubmission,
  ContactSubmissionQueryParams,
  ContactSubmissionsResponse,
  UpdateContactSubmissionDto,
} from "@/types";
import { apiClient, ENDPOINTS, serializeQueryParams } from "@/utils/api";

export class queryApi {
  static async getQueries(
    params?: ContactSubmissionQueryParams
  ): Promise<ContactSubmissionsResponse> {
    try {
      const res = await apiClient.request<ContactSubmissionsResponse | ContactSubmission[]>(
        ENDPOINTS.CONTACT.LIST,
        serializeQueryParams(params)
      );

      if (res && typeof res === "object" && "items" in res && Array.isArray(res.items)) {
        return res as ContactSubmissionsResponse;
      }

      // Fallback if backend returned plain array
      const items = Array.isArray(res) ? res : [];
      return {
        items,
        total: items.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        pendingCount: items.filter((q) => q.status === "pending").length,
        inProgressCount: items.filter((q) => q.status === "in_progress").length,
        resolvedCount: items.filter((q) => q.status === "resolved").length,
      };
    } catch (error) {
      console.error("Error fetching contact queries from backend:", error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        pendingCount: 0,
        inProgressCount: 0,
        resolvedCount: 0,
      };
    }
  }

  static async updateQueryStatus(
    id: string,
    dto: UpdateContactSubmissionDto
  ): Promise<ContactSubmission> {
    try {
      return await apiClient.request<ContactSubmission>(
        ENDPOINTS.CONTACT.UPDATE(id),
        undefined,
        {
          method: "PATCH",
          body: JSON.stringify(dto),
        }
      );
    } catch (error) {
      console.error(`Error updating query ${id}:`, error);
      throw error;
    }
  }
}
