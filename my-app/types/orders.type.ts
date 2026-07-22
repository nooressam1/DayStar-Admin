export interface Order {
  id: string;
  order_number: number;
  user_id: string;
  address_id: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  total: number;
  created_at: string;
  full_name?: string;
  phone_number?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price_snapshot: number;
  product_name?: string;
  sku?: string;
}
