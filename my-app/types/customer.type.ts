export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  orders_count: number;
  created_at: string;
  is_disabled: boolean;
  avatar_url?: string;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "disabled";
}
