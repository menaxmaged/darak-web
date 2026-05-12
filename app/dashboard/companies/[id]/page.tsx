'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Briefcase, Users, FileText,
  Globe, Mail, Phone, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompany } from '@/Modules/companies/companies';
import { capacityColor, capacityTextColor, formatDate } from '@/lib/status-helpers';
import { Position } from '@/lib/eyoot-types';

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value ?? '—'}</span>
    </div>
  );
}

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Capacity used</span>
        <span className={capacityTextColor(used, total)}>{used}/{total} ({Math.round(pct)}%)</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${capacityColor(used, total)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors
        ${active ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
    >
      {children}
    </button>
  );
}

function PositionRow({ pos }: { pos: Position }) {
  const isFull = pos.usedCapacity >= pos.capacity;
  const pct = pos.capacity > 0 ? (pos.usedCapacity / pos.capacity) * 100 : 0;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-foreground">{pos.title}</p>
          <Badge variant={isFull ? 'destructive' : pos.status === 'active' ? 'success' : 'gray'}>
            {isFull ? 'Full' : pos.status}
          </Badge>
          {isFull && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 max-w-48">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${capacityColor(pos.usedCapacity, pos.capacity)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <span className={`text-xs ${capacityTextColor(pos.usedCapacity, pos.capacity)}`}>
            {pos.usedCapacity}/{pos.capacity}
          </span>
          {pos.deadline && (
            <span className="text-xs text-muted-foreground">Deadline: {formatDate(pos.deadline)}</span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground">{pos.applicantsCount} applicants</p>
        <p className="text-xs text-muted-foreground">{pos.approvedCount} approved</p>
      </div>
      <Link
        href={`/dashboard/positions/${pos.id}`}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
      >
        View
      </Link>
    </div>
  );
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'positions' | 'requirements'>('overview');

  const { data: company, isLoading } = useCompany(Number(id));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Building2 className="w-16 h-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Company not found</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const positions: Position[] = company.positions ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            {company.logo
              ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-xl" /> // eslint-disable-line @next/next/no-img-element
              : <Building2 className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{company.name}</h1>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={company.status === 'active' ? 'success' : 'gray'}>{company.status}</Badge>
          <Button variant="outline" size="sm" className="gap-1.5">Edit</Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Positions', value: company.activePositions, icon: Briefcase },
          { label: 'Applications', value: company.applicationsCount, icon: FileText },
          { label: 'Used Capacity', value: company.usedCapacity, icon: Users },
          { label: 'Seats Left', value: company.remainingCapacity, icon: Users },
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

      {/* Capacity bar */}
      <Card className="border border-border shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <CapacityBar used={company.usedCapacity} total={company.totalCapacity} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-muted/40 rounded-2xl p-1.5 w-fit">
        <Tab active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</Tab>
        <Tab active={tab === 'positions'} onClick={() => setTab('positions')}>
          Positions ({positions.length})
        </Tab>
        <Tab active={tab === 'requirements'} onClick={() => setTab('requirements')}>Requirements</Tab>
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Company Info</CardTitle>
            </CardHeader>
            <CardContent>
              {company.description && (
                <p className="text-sm text-muted-foreground mb-4">{company.description}</p>
              )}
              <InfoRow label="Industry" value={company.industry} />
              {company.website && (
                <div className="flex items-center justify-between py-2.5 border-b border-border/50 text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs">{company.website}</a>
                </div>
              )}
              {company.email && <InfoRow label="Email" value={company.email} />}
              {company.phone && <InfoRow label="Phone" value={company.phone} />}
              <InfoRow label="Created" value={formatDate(company.createdAt)} />
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/dashboard/applications?companyId=${company.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm"
              >
                <FileText className="w-4 h-4 text-primary" />
                View All Applications
              </Link>
              <Link
                href={`/dashboard/positions?companyId=${company.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm"
              >
                <Briefcase className="w-4 h-4 text-primary" />
                Manage Positions
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Positions */}
      {tab === 'positions' && (
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Positions</CardTitle>
            <Button size="sm" className="gap-1.5 h-8 text-xs bg-[#FFAF00] text-white hover:bg-[#e09e00]">
              <Briefcase className="w-3.5 h-3.5" /> Add Position
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {positions.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-sm">No positions yet</p>
            ) : (
              positions.map((pos) => <PositionRow key={pos.id} pos={pos} />)
            )}
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {tab === 'requirements' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">General Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            {!company.requirements ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No requirements configured for this company.
              </p>
            ) : (
              <div className="space-y-0">
                <InfoRow label="Minimum Age" value={company.requirements.minAge} />
                <InfoRow label="Minimum GPA" value={company.requirements.minGpa} />
                <InfoRow label="Minimum Academic Year" value={company.requirements.minAcademicYear} />
                <InfoRow label="IBM Course Required" value={company.requirements.ibmRequired ? 'Yes' : 'No'} />
                <InfoRow label="Volunteering Required" value={company.requirements.volunteeringRequired ? 'Yes' : 'No'} />
                {company.requirements.languageRequirements && company.requirements.languageRequirements.length > 0 && (
                  <div className="flex items-start justify-between py-2.5 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Language Requirements</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {company.requirements.languageRequirements.map((l) => (
                        <Badge key={l} variant="info">{l}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
