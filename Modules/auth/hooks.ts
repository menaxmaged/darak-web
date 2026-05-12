import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { authApi } from './api';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onError: (error) => {
      console.log('Login error encountered:', error);
      console.error('Login error:', getErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
      console.error('Reset password error:', getErrorMessage(error));
    },
  });
};
