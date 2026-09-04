export interface Category {
  id: string;
  name: string;
  photo?: string | null;
  slug: string;
  status?: string;
  created_at?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

