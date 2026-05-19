export interface City {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export type CityInsert = Omit<City, 'id' | 'created_at' | 'updated_at'>;
export type CityUpdate = Partial<CityInsert>;

export interface CitiesFilters {
  page?: number;
  limit?: number;
}
