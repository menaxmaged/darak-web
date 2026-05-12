'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Filter, ChevronRight, FileText, CheckSquare, XSquare,
  ArrowUpDown, MoreHorizontal, Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useApplications, useUpdateApplicationStatus, useBulkUpdateStatus } from '@/Modules/applications/applications';
import { APPLICATION_STATUS_CONFIG, IBM_PROOF_STATUS_CONFIG, formatDate } from '@/lib/status-helpers';
import { Application, ApplicationStatus } from '@/lib/eyoot-types';

// ─── Row skeleton ─────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr>
      {[180, 140, 140, 100, 100, 80, 90].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── App row ──────────────────────────────────────────────────────────────────
function AppRow({
  app, selected, onSelect,
}: {
  app: Application;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();
  const statusCfg = APPLICATION_STATUS_CONFIG[app.status];
  const ibmCfg = IBM_PROOF_STATUS_CONFIG[app.ibmProofStatus];

  const ALL: ApplicationStatus[] = [
    'applied', 'ibm-course-required', 'interview',
    'approved', 'volunteering-required', 'certificate-ready', 'declined',
  ];

  return (
    <tr className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${selected ? 'bg-primary/5' : ''}`}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-border"
        />
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/students/${app.studentId}`}
          className="font-medium text-sm text-primary hover:underline"
        >
          {app.studentName}
        </Link>
        <p className="text-xs text-muted-foreground">{app.studentEmail}</p>
      </td>
      <td className="px-4 py-3">
        <Link href={`/dashboard/companies/${app.companyId}`} className="flex items-center gap-2 group/link">
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover/link:text-primary transition-colors">{app.companyName}</p>
            <p className="text-xs text-muted-foreground">{app.positionTitle}</p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3">
        <Select
          value={app.status}
          onValueChange={(v) => updateStatus({ id: app.id, status: v as ApplicationStatus })}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 text-xs w-44 border-0 bg-transparent p-0 hover:bg-muted rounded-lg px-2">
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </SelectTrigger>
          <SelectContent>
            {ALL.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {APPLICATION_STATUS_CONFIG[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3">
        <Badge variant={ibmCfg.variant}>{ibmCfg.label}</Badge>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(app.appliedAt)}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(app.updatedAt)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/dashboard/applications/${app.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            View <ChevronRight className="w-3 h-3" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/students/${app.studentId}`}>View Student</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/applications/${app.id}`}>Full Application</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateStatus({ id: app.id, status: 'approved' })}
                className="text-emerald-600"
              >
                <CheckSquare className="w-4 h-4 mr-2" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateStatus({ id: app.id, status: 'declined' })}
                className="text-destructive"
              >
                <XSquare className="w-4 h-4 mr-2" /> Decline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const params: Record<string, unknown> = {};
  if (statusFilter !== 'all') params.status = statusFilter;
  if (search) params.search = search;

  const { data, isLoading } = useApplications(params);
  const { mutate: bulkUpdate, isPending: bulkPending } = useBulkUpdateStatus();

  const apps: Application[] = (data?.data as Application[] | undefined) ?? [];

  const filtered = apps.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.studentName.toLowerCase().includes(q) ||
      a.companyName.toLowerCase().includes(q) ||
      a.positionTitle.toLowerCase().includes(q)
    );
  });

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };

  const selectedArr = Array.from(selected);

  const handleBulk = (status: ApplicationStatus) => {
    bulkUpdate({ ids: selectedArr, status }, {
      onSuccess: () => setSelected(new Set()),
    });
  };

  const ALL_STATUSES: ApplicationStatus[] = [
    'applied', 'ibm-course-required', 'interview',
    'approved', 'volunteering-required', 'certificate-ready', 'declined',
  ];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search student, company or position…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-52">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{APPLICATION_STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions bar */}
      {selectedArr.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-2xl">
          <span className="text-sm font-medium text-primary">
            {selectedArr.length} selected
          </span>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              onClick={() => handleBulk('approved')} disabled={bulkPending}>
              <CheckSquare className="w-3.5 h-3.5" /> Approve All
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handleBulk('declined')} disabled={bulkPending}>
              <XSquare className="w-3.5 h-3.5" /> Decline All
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
              onClick={() => handleBulk('ibm-course-required')} disabled={bulkPending}>
              Move to IBM Stage
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
              onClick={() => handleBulk('interview')} disabled={bulkPending}>
              Move to Interview
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto"
            onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Summary */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="gray">{filtered.length} total</Badge>
          {ALL_STATUSES.map((s) => {
            const count = filtered.filter((a) => a.status === s).length;
            if (!count) return null;
            return <Badge key={s} variant={APPLICATION_STATUS_CONFIG[s].variant}>{APPLICATION_STATUS_CONFIG[s].label}: {count}</Badge>;
          })}
        </div>
      )}

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded border-border"
                    />
                  </th>
                  {['Student', 'Company / Position', 'Status', 'IBM Proof', 'Applied', 'Updated', ''].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {col && (
                        <span className="flex items-center gap-1">
                          {col} {col && <ArrowUpDown className="w-3 h-3" />}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No applications found</p>
                        <p className="text-xs mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  )
                  : filtered.map((app) => (
                    <AppRow
                      key={app.id}
                      app={app}
                      selected={selected.has(app.id)}
                      onSelect={(checked) => {
                        const next = new Set(selected);
                        if (checked) next.add(app.id);
                        else next.delete(app.id);
                        setSelected(next);
                      }}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
