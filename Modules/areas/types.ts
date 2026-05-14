export interface Area {
  id: string;
  name: string;
  city: string;
  created_at: string;
  updated_at?: string;
}

export type AreaInsert = Omit<Area, 'id' | 'created_at' | 'updated_at'>;
export type AreaUpdate = Partial<AreaInsert>;

export interface AreasFilters {
  city?: string;
  page?: number;
  limit?: number;
}
