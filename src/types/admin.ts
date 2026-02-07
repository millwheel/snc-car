export interface ManufacturerRow {
  manufacturer_id: number;
  code: string;
  name: string;
  logo_path: string | null;
  category: 'DOMESTIC' | 'IMPORT';
  sort_order: number;
  is_visible: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface SaleCarRow {
  sale_car_id: number;
  manufacturer_id: number;
  name: string;
  description: string | null;
  thumbnail_path: string | null;
  rent_price: number | null;
  lease_price: number | null;
  badges: string[];
  is_visible: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReleasedCarRow {
  released_car_id: number;
  car_name: string;
  thumbnail_path: string | null;
  released_at: string;
  is_visible: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: number;
  username: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface ManufacturerWithAuthor extends ManufacturerRow {
  users: { nickname: string } | null;
}

export interface SaleCarWithAuthor extends SaleCarRow {
  manufacturers: { name: string } | null;
  users: { nickname: string } | null;
}

export interface ReleasedCarWithAuthor extends ReleasedCarRow {
  users: { nickname: string } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
