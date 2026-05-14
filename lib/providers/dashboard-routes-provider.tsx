'use client';

import { createContext, useContext } from 'react';
import type { DiscoveredRoute } from '@/lib/config/route-discovery';
import { ProtectedRoute } from '@/components/auth/protected-route';

const DashboardRoutesContext = createContext<DiscoveredRoute[]>([]);

export function DashboardRoutesProvider({
  routes,
  children,
}: {
  routes: DiscoveredRoute[];
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
    <DashboardRoutesContext.Provider value={routes}>
      {children}
    </DashboardRoutesContext.Provider>
    </ProtectedRoute>
  );
}

export function useDashboardRoutes() {
  return useContext(DashboardRoutesContext);
}
