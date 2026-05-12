import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardRoutesProvider } from '@/lib/providers/dashboard-routes-provider';
import { discoverRoutes } from '@/lib/config/route-scanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const routes = discoverRoutes();

  return (
    <DashboardRoutesProvider routes={routes}>
      <div className="min-h-screen bg-brand-cream">
        <Suspense fallback={null}>
          <DashboardSidebar />
        </Suspense>

        <main className="lg:ml-72 min-h-screen">
          <div className="p-8 lg:p-12 space-y-8">
            <Suspense fallback={null}>
              <PageHeader />
            </Suspense>
            {children}
          </div>
        </main>
      </div>
    </DashboardRoutesProvider>
  );
}
