import { DiscountType, DiscountMinRequirement } from "@/enums";

export interface Discount {
  id: string;
  code: string;
  value: number;
  type: DiscountType | string;
  created_at: string;
  is_active?: boolean;
  min_requirement_type?: DiscountMinRequirement | string;
  min_requirement_value?: number;
  active_start_date?: string;
  active_end_date?: string;
}
