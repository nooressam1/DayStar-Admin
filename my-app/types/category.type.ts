export interface Category {
  id: string;
  name: string;
  photo: string;
  slug: string;
  created_at?: string;
  parent_id?: string | null;
  description?: string | null;
  is_visible?: boolean;
}
