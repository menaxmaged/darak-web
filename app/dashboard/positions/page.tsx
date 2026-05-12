'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Filter, Briefcase, ChevronRight, AlertTriangle, Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { usePositions } from '@/Modules/positions/positions';
import { capacityColor, capacityTextColor, formatDate } from '@/lib/status-helpers';
import { Position } from '@/lib/eyoot-types';

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${capacityColor(used, total)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-medium shrink-0 ${capacityTextColor(used, total)}`}>
        {used}/{total}
      </span>
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr>
      {[160, 120, 100, 180, 80, 80, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function PositionRow({ pos }: { pos: Position }) {
  const isFull = pos.status === 'full' || pos.usedCapacity >= pos.capacity;
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isFull && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
          <p className="font-medium text-sm text-foreground">{pos.title}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/companies/${pos.companyId}`}
          className="text-sm text-primary hover:underline"
        >
          {pos.companyName}
        </Link>
      </td>
      <td className="px-4 py-3">
        <Badge variant={isFull ? 'destructive' : pos.status === 'active' ? 'success' : 'gray'}>
          {isFull ? 'Full' : pos.status}
        </Badge>
      </td>
      <td className="px-4 py-3 min-w-40">
        <CapacityBar used={pos.usedCapacity} total={pos.capacity} />
      </td>
      <td className="px-4 py-3 text-sm text-center">{pos.applicantsCount}</td>
      <td className="px-4 py-3 text-sm text-center text-emerald-600 font-medium">{pos.approvedCount}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(pos.deadline)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/dashboard/positions/${pos.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            View <ChevronRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/dashboard/applications?positionId=${pos.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Applicants
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default function PositionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const params: Record<string, unknown> = {};
  if (statusFilter !== 'all') params.status = statusFilter;
  if (search) params.search = search;

  const { data, isLoading } = usePositions(params);
  const positions: Position[] = data?.data ?? [];

  const filtered = positions.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.companyName.toLowerCase().includes(q);
  });

  const fullCount = filtered.filter((p) => p.status === 'full' || p.usedCapacity >= p.capacity).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search positions or companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Add Position
        </Button>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="gray">{filtered.length} positions</Badge>
          {fullCount > 0 && (
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" /> {fullCount} full
            </Badge>
          )}
        </div>
      )}

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Position', 'Company', 'Status', 'Capacity', 'Applicants', 'Approved', 'Deadline', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                        <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No positions found</p>
                      </td>
                    </tr>
                  )
                  : filtered.map((p) => <PositionRow key={p.id} pos={p} />)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
