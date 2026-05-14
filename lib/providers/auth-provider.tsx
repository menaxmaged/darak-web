'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api-client';
import type { LoginResponse } from '@/Modules/auth/types';

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
    // Check for existing session on mount
    const initAuth = () => {
      const token = tokenManager.get();
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          tokenManager.remove();
          localStorage.removeItem('role');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (data: LoginResponse) => {
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.user.role);
    tokenManager.set(data.token);
  };

  const logout = () => {
    setUser(null);
    tokenManager.remove();
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const updateUser = (updatedUser: LoginResponse['user']) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('role', updatedUser.role);
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as LoginResponse['user'];
        setUser(parsedUser);
        localStorage.setItem('role', parsedUser.role);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const isAdmin = hasRole('admin');
  const isAdvertiser = hasRole('advertiser');
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
    hasRole,
    isAdmin,
    isAdvertiser,
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
