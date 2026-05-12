import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { IBMProof, IBMProofStatus } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockIBMProofsList, mockIBMProofSuccess } from './mock';

export const ibmProofApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<IBMProof[]>('/admin/ibm-proofs', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockIBMProofsList);
  },

  review: async ({ id, status, reason }: { id: number; status: IBMProofStatus; reason?: string }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/ibm-proofs/${id}/review`, { status, reason });
      return response.data;
    }, mockIBMProofSuccess);
  },
};

export const useIBMProofs = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['ibm-proofs', params],
    queryFn: () => ibmProofApi.list(params),
  });

export const useReviewIBMProof = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ibmProofApi.review,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ibm-proofs'] });
      qc.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
