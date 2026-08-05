import { apiClient } from "@/utils/api/client";
import { ENDPOINTS } from "@/utils/api/endpoints";
import { DiscountRecord } from "../pages/DiscountPage";

export async function fetchDiscountsApi(): Promise<DiscountRecord[]> {
  try {
    const rawDiscounts = await apiClient.request<any[]>(ENDPOINTS.DISCOUNT.LIST, undefined, {
      method: "GET",
    });

    if (Array.isArray(rawDiscounts)) {
      return rawDiscounts.map((d) => ({
        id: d.id,
        code: d.code,
        title: d.title || `${d.code} Discount`,
        type: d.type,
        value:
          d.type === "Free Shipping"
            ? "Free Shipping"
            : d.type === "Fixed Amount"
            ? `$${d.value}.00 OFF`
            : `${d.value}% OFF`,
        status: d.is_active ? "Active" : "Scheduled",
        startDate: d.start_date || "2026-06-01",
        endDate: d.end_date || undefined,
        minRequirementType: d.min_requirement_type || "none",
        minRequirementValue: d.min_requirement_value ? String(d.min_requirement_value) : undefined,
      }));
    }
  } catch (error) {
    console.error("Error fetching discounts from API:", error);
  }
  return [];
}

export async function createDiscountApi(payload: {
  code: string;
  title?: string;
  type: string;
  value: number;
  is_active?: boolean;
  min_requirement_type?: string;
  min_requirement_value?: number;
  start_date?: string;
  end_date?: string;
}): Promise<DiscountRecord> {
  const result = await apiClient.request<any>(ENDPOINTS.DISCOUNT.CREATE, undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: result.id || `disc-${Date.now()}`,
    code: result.code || payload.code,
    title: result.title || payload.title || `${payload.code} Discount`,
    type: result.type || payload.type,
    value:
      payload.type === "Free Shipping"
        ? "Free Shipping"
        : payload.type === "Fixed Amount"
        ? `$${payload.value}.00 OFF`
        : `${payload.value}% OFF`,
    status: payload.is_active !== false ? "Active" : "Scheduled",
    startDate: payload.start_date || new Date().toISOString().split("T")[0],
    endDate: payload.end_date || undefined,
    minRequirementType: payload.min_requirement_type as any,
    minRequirementValue: payload.min_requirement_value ? String(payload.min_requirement_value) : undefined,
  };
}

export async function deleteDiscountApi(id: string): Promise<void> {
  await apiClient.request(ENDPOINTS.DISCOUNT.DELETE(id), undefined, {
    method: "DELETE",
  });
}

export function isDiscountCodeTaken(code: string, discounts: DiscountRecord[], excludeId?: string): boolean {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return false;
  return discounts.some(
    (d) => d.code.trim().toUpperCase() === normalized && d.id !== excludeId
  );
}

export function isDiscountTitleTaken(title: string, discounts: DiscountRecord[], excludeId?: string): boolean {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return false;
  return discounts.some(
    (d) => (d.title || "").trim().toLowerCase() === normalized && d.id !== excludeId
  );
}
