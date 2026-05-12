import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { ibmProofApi } from './api';

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
