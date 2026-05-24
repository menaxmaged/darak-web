'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api-client';
import type { LoginResponse } from '@/Modules/auth/types';
import { authApi } from '@/Modules/auth/api';


interface AuthContextType {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  updateUser: (user: LoginResponse['user']) => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.get();
      if (token) {
        try {
          const freshUser = await authApi.checkAuth();
          // console.log('Checked auth on init, got user:', freshUser);
          if (freshUser) {
            setUser(freshUser);
          } else {
            tokenManager.remove();
          }
        } catch {
          tokenManager.remove();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (data: LoginResponse) => {
    console.log('Logging in user:', data);
    setUser(data.user);
     tokenManager.set(data.token? data.token : '');
    
  };

  const logout = () => {
    setUser(null);
    tokenManager.remove();
    router.push('/login');
  };

  const updateUser = (updatedUser: LoginResponse['user']) => {
    setUser(updatedUser);
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authApi.checkAuth();
      if (freshUser) {
        setUser(freshUser);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
