'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Menu, X } from 'lucide-react';
import { authApi, getStoredUserRole } from '@/Modules/auth/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DASHBOARD_CONFIG,
  DASHBOARD_NAV_ICONS,
  DashboardRole,
  isDashboardNavItemActive,
} from '@/lib/config/dashboard-config';

function SidebarContent({ 
  pathname,
  searchParams,
  handleLogout,
  setIsMobileMenuOpen 
}: { 
  pathname: string;
  searchParams: URLSearchParams;
  handleLogout: () => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}) {
  const role = getStoredUserRole();

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-8 p-4 border-b border-border">
            <Image
              src={DASHBOARD_CONFIG.brand.logo}
              alt={`${DASHBOARD_CONFIG.brand.name} Logo`}
              width={100}
              height={100}
              className="w-24 h-auto"
            />
         
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {DASHBOARD_CONFIG.navigation.filter((item) => {
            if (!item.sidebar) {
              return false;
            }
            if (!role) {
              return true;
            }
            const allowedRoles = item.rolesAllowed as ReadonlyArray<DashboardRole>;
            return allowedRoles.includes(role as DashboardRole);
          }).map((item) => {
            const isActive = isDashboardNavItemActive(item, pathname, searchParams);
            const Icon = DASHBOARD_NAV_ICONS[item.icon];
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  '',
                  isActive 
                    ? 'bg-branding-dark text-white shadow-lg' 
                    : 'text-brand-charcoal hover:bg-brand-cream/50'
                )}
              >
                <Icon className="w-5 h-5 stroke-[1.5]" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5 stroke-[1.5]" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg rounded-xl"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-40 h-full w-72 bg-white shadow-2xl transition-transform duration-300',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent 
          pathname={pathname} 
          searchParams={searchParams}
          handleLogout={handleLogout}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-72 bg-white border-r border-border shadow-xl">
        <SidebarContent 
          pathname={pathname} 
          searchParams={searchParams}
          handleLogout={handleLogout}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </aside>
    </>
  );
}
