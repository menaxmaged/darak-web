import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { authApi } from './api';
import { useAuth } from '@/lib/providers/auth-provider';

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onError: (error) => {
      console.error('Register error:', getErrorMessage(error));
    },
  });
};

export const useLogin = () => {
      const { login } = useAuth();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data);
    },
    onError: (error) => {
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

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onError: (error) => {
      console.error('Verify OTP error:', getErrorMessage(error));
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authApi.resendOtp,
    onError: (error) => {
      console.error('Resend OTP error:', getErrorMessage(error));
    },
  });
};
