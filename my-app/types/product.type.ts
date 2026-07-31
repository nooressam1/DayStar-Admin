export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  images: string[];
  slug: string;
  price: number;
  created_at: string;
  is_active: boolean;
  on_sale?: boolean;
  skin_type?: string[];
  concern?: string[];
  step_type?: string;
  discount_percentage?: number | null;
}
export interface ProductParams {
  page?: number;
  limit?: number;
  category?: string;
  categoryId?: string;
  collection?: string;
  search?: string;
  discount?: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  category_id?: string | null;
  images: string[];
  price: number;
  is_active?: boolean;
  on_sale?: boolean;
  discount_percentage?: number | null;
  skin_type?: string[];
  concern?: string[];
  step_type?: string;
  variants?: Omit<Variant, "id" | "product_id">[];
}

export interface Variant {
  id: string;
  product_id: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
}

export type ProductVariant = Omit<Variant, "product_id">;

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  body: string;
  comment?: string | null;
  title: string;
  created_at?: string;
  date?: string | number;
  timestamp?: number | string;
  profile?: {
    username: string;
  };
}
