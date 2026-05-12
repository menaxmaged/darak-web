'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { PageHeader } from '@/components/page-header';
import { DashboardRole, getActiveDashboardNavItem } from '@/lib/config/dashboard-config';
import { getStoredUserRole } from '@/Modules/auth/auth';

type DashboardLayoutClientProps = {
  children: React.ReactNode;
};

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  const activeItem = useMemo(
    () => getActiveDashboardNavItem(pathname, searchParams),
    [pathname, searchParams]
  );

  useEffect(() => {
    const role = getStoredUserRole();
    if (!activeItem) {
      setIsAuthorized(true);
      return;
    }

    if (!role) {
      setIsAuthorized(false);
    //  router.replace('/login');
      return;
    }

    if (!activeItem.rolesAllowed.includes(role as DashboardRole)) {
      setIsAuthorized(false);
      router.replace('/dashboard');
      return;
    }

    setIsAuthorized(true);
  }, [activeItem, router]);

  if (!isAuthorized) {
    return null;
  }

  return (
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
  );
}
