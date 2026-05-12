'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Briefcase, Users, FileText, AlertTriangle, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePosition } from '@/Modules/positions/positions';
import { useApplications, useUpdateApplicationStatus } from '@/Modules/applications/applications';
import { APPLICATION_STATUS_CONFIG, capacityColor, capacityTextColor, formatDate } from '@/lib/status-helpers';
import { Application, ApplicationStatus } from '@/lib/eyoot-types';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

function ApplicantRow({ app }: { app: Application }) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();
  const cfg = APPLICATION_STATUS_CONFIG[app.status];
  const ALL: ApplicationStatus[] = [
    'applied', 'ibm-course-required', 'interview',
    'approved', 'volunteering-required', 'certificate-ready', 'declined',
  ];

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3">
        <Link href={`/dashboard/students/${app.studentId}`} className="font-medium text-sm text-primary hover:underline">
          {app.studentName}
        </Link>
        <p className="text-xs text-muted-foreground">{app.studentEmail}</p>
      </td>
      <td className="px-4 py-3">
        <Select
          value={app.status}
          onValueChange={(v) => updateStatus({ id: app.id, status: v as ApplicationStatus })}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 text-xs w-44 border-0 bg-transparent p-0 hover:bg-muted rounded-lg px-2">
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
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
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(app.appliedAt)}</td>
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/applications/${app.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

export default function PositionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: position, isLoading: posLoading } = usePosition(Number(id));
  const { data: appsData, isLoading: appsLoading } = useApplications({ positionId: id });

  const apps: Application[] = (appsData?.data as Application[] | undefined) ?? [];

  if (posLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!position) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Briefcase className="w-16 h-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Position not found</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const isFull = position.usedCapacity >= position.capacity;
  const pct = position.capacity > 0 ? (position.usedCapacity / position.capacity) * 100 : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">{position.title}</h1>
            {isFull && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" /> Full
              </Badge>
            )}
          </div>
          <Link href={`/dashboard/companies/${position.companyId}`} className="text-sm text-primary hover:underline">
            {position.companyName}
          </Link>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm">Edit Position</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Applicants', value: position.applicantsCount, icon: Users },
          { label: 'Approved', value: position.approvedCount, icon: FileText },
          { label: 'Pending', value: position.pendingCount, icon: FileText },
          { label: 'Seats Left', value: position.remainingCapacity, icon: Briefcase },
        ].map((s) => (
          <Card key={s.label} className="border border-border shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Capacity + info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Capacity</span>
              <span className={capacityTextColor(position.usedCapacity, position.capacity)}>
                {position.usedCapacity}/{position.capacity} ({Math.round(pct)}%)
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${capacityColor(position.usedCapacity, position.capacity)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {isFull && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                This position has reached maximum capacity. New approvals are blocked.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardContent className="p-5 space-y-2 text-sm">
            {position.deadline && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Deadline: <strong className="text-foreground">{formatDate(position.deadline)}</strong></span>
              </div>
            )}
            {position.description && (
              <p className="text-muted-foreground text-xs">{position.description}</p>
            )}
            {position.requirements && position.requirements.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Requirements</p>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                  {position.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applicants */}
      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold">Applicants for this Position</CardTitle>
          <Badge variant="gray">{apps.length} total</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Student', 'Status', 'Applied', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appsLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td></tr>
                  ))
                  : apps.length === 0
                  ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground text-sm">
                        No applicants yet
                      </td>
                    </tr>
                  )
                  : apps.map((app) => <ApplicantRow key={app.id} app={app} />)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
