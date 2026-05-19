export interface Project {
  id: string;
  name: string;
  city_id: string;
  city?: string;
  developer?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectInsert {
  name: string;
  city_id: string;
  developer?: string;
  description?: string;
}
export type ProjectUpdate = Partial<ProjectInsert>;

export interface ProjectsFilters {
  city_id?: string;
  city?: string;
  page?: number;
  limit?: number;
}
