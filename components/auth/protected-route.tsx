'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { FullPageLoader } from '@/components/ui/spinner';
import { ROLE_CONFIG } from '@/lib/config/auth-config';
import { getActiveRoute } from '@/lib/config/route-discovery';
import { useDashboardRoutes } from '@/lib/providers/dashboard-routes-provider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Explicit role list. When omitted, roles are auto-detected from the
   * matching route.json via the DashboardRoutesProvider context.
   */
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routes = useDashboardRoutes();

  const activeRoute = getActiveRoute(routes, pathname, searchParams);
  const effectiveRoles = allowedRoles ?? activeRoute?.roles;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (effectiveRoles && !hasRole(effectiveRoles)) {
      const roleConf = ROLE_CONFIG[user?.role ?? ''];
      if (!roleConf || roleConf.fallbackToLogout) {
        logout();
      } else {
        router.push(roleConf.defaultPath);
      }
    }
  }, [isAuthenticated, isLoading, effectiveRoles, user, router, logout, hasRole]);

  if (isLoading) return <FullPageLoader message="Authenticating..." />;
  if (!isAuthenticated || (effectiveRoles && !hasRole(effectiveRoles))) return null;

  return <>{children}</>;
}
