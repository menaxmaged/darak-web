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
    <DashboardRoutesContext.Provider value={routes}>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </DashboardRoutesContext.Provider>
  );
}

export function useDashboardRoutes() {
  return useContext(DashboardRoutesContext);
}
