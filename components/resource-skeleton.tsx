import { Skeleton } from '@/components/ui/skeleton';

type ResourceSkeletonProps = {
  rows?: number;
  showHeader?: boolean;
  showActions?: boolean;
};

export function ResourceSkeleton({
  rows = 6,
  showHeader = true,
  showActions = true,
}: ResourceSkeletonProps) {
  return (
    <div className="space-y-6">
      {showHeader ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          {showActions ? <Skeleton className="h-10 w-32 rounded-xl" /> : null}
        </div>
      ) : null}

      <div className="rounded-3xl border border-border bg-white p-6 shadow-lg">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
