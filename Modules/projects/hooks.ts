import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { projectApi } from './api';
import type { ProjectsFilters } from './types';

export const useProjects = (filters: ProjectsFilters = {}) =>
  useQuery({ queryKey: ['projects', filters], queryFn: () => projectApi.list(filters) });

export const useProject = (id: string | undefined) =>
  useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.get(id!),
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectApi.update,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project', variables.id] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
