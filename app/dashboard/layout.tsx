import { Suspense } from 'react';
// import DashboardLayoutClient from '@/components/dashboard-layout-client';
import { PageHeader } from '@/components/page-header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        // <ProtectedRoute>

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
    // </ProtectedRoute>

    
  );
}
