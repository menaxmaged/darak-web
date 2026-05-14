export interface Project {
  id: string;
  name: string;
  city: string;
  developer?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;

export interface ProjectsFilters {
  city?: string;
  page?: number;
  limit?: number;
}
