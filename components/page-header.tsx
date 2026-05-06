'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getActiveDashboardNavItem } from '@/lib/config/dashboard-config';

export function PageHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeItem = getActiveDashboardNavItem(pathname, searchParams);

  if (!activeItem?.page) {
    return null;
  }

  const { title, description, action } = activeItem.page;

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between', className)}>
      <div>
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">{title}</h1>
        {description ? <p className="text-brand-gray">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href}>
          <Button className="rounded-xl">{action.label}</Button>
        </Link>
      ) : null}
    </div>
  );
}
