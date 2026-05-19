export interface Area {
  id: string;
  name: string;
  city_id: string;
  city?: string;
  created_at: string;
  updated_at?: string;
}

export interface AreaInsert {
  name: string;
  city_id: string;
}
export type AreaUpdate = Partial<AreaInsert>;

export interface AreasFilters {
  city_id?: string;
  city?: string;
  page?: number;
  limit?: number;
}
