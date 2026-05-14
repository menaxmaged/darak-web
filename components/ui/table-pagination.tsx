'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ListMeta } from '@/types';

interface TablePaginationProps {
  meta?: ListMeta;
  page: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({ meta, page, onPageChange }: TablePaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  const start = (meta.currentPage - 1) * meta.pageSize + 1;
  const end = Math.min(meta.currentPage * meta.pageSize, meta.totalItems);

  return (
    <div className="flex items-center justify-between mt-4 px-1 text-sm">
      <p className="text-muted-foreground">
        {start}–{end} of {meta.totalItems}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 py-1.5 rounded-md border border-border text-xs font-medium bg-secondary">
          {meta.currentPage} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
