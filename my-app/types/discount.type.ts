export interface Discount {
  id: string;
  code: string;
  value: number;
  type: string; // "Percentage" | "Fixed Amount" | "Free Shipping"
  created_at: string;
  is_active?: boolean;
  min_requirement_type?: "none" | "amount" | "quantity";
  min_requirement_value?: number;
  start_date?: string;
  end_date?: string;
}
