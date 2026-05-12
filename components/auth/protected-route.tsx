'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { FullPageLoader } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, user,logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (allowedRoles && !hasRole(allowedRoles)) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (user?.role === 'seller') {
          router.push('/dashboard/seller');
        } else if (user?.role === 'sales') {
          router.push('/dashboard/salesAdmin');
        } else {
          
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                logout();
        // router.push('/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, hasRole, allowedRoles, router, user,logout]);

  if (isLoading) {
    return <FullPageLoader message="Authenticating..." />;
  }

  if (!isAuthenticated || (allowedRoles && !hasRole(allowedRoles))) {
    console.warn('Unauthorized access attempt to protected route');
    return null;
  }

  return <>{children}</>;
}
