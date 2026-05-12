'use client';

import { Download, TrendingUp, Users, FileText, Building2, BookOpen, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/Modules/Analytics/analytics';

// ─── Mini bar chart using CSS ─────────────────────────────────────────────────
function BarChart({
  bars,
}: {
  bars: { label: string; value: number; max: number; color?: string }[];
}) {
  return (
    <div className="space-y-2">
      {bars.map((bar) => {
        const pct = bar.max > 0 ? Math.min((bar.value / bar.max) * 100, 100) : 0;
        return (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{bar.label}</span>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${bar.color ?? 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground w-12 text-right shrink-0">
              {bar.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ label, value, sub, loading }: {
  label: string; value: string | number; sub?: string; loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      {loading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        <span className="font-bold text-foreground">{value}</span>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const applicationBars = [
    { label: 'Applied', value: stats?.totalApplications ?? 0, max: stats?.totalApplications ?? 1, color: 'bg-blue-400' },
    { label: 'Approved', value: stats?.approvedApplications ?? 0, max: stats?.totalApplications ?? 1, color: 'bg-emerald-500' },
    { label: 'Declined', value: stats?.declinedApplications ?? 0, max: stats?.totalApplications ?? 1, color: 'bg-red-400' },
    { label: 'Pending', value: stats?.pendingApplications ?? 0, max: stats?.totalApplications ?? 1, color: 'bg-amber-400' },
  ];

  const approvalRate = stats?.totalApplications
    ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
    : 0;

  const conversionRate = stats?.totalStudents
    ? Math.round((stats.appliedStudents / stats.totalStudents) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Platform analytics overview</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> Export Students CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> Export Applications CSV
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Application Rate', value: `${conversionRate}%`, sub: 'of students applied', icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Approval Rate', value: `${approvalRate}%`, sub: 'of applications approved', icon: FileText, color: 'text-emerald-600' },
          { label: 'IBM Pending', value: stats?.ibmProofsPending ?? 0, sub: 'proofs to review', icon: Users, color: 'text-amber-600' },
          { label: 'Capacity Used', value: `${stats?.capacityFilledPercent ?? 0}%`, sub: 'of total positions', icon: Building2, color: (stats?.capacityFilledPercent ?? 0) >= 80 ? 'text-red-600' : 'text-emerald-600' },
        ].map((m) => (
          <Card key={m.label} className="border border-border shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  {isLoading
                    ? <Skeleton className="h-7 w-16 mt-1" />
                    : <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <m.icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Students */}
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatRow label="Total Students" value={stats?.totalStudents ?? 0} loading={isLoading} />
            <StatRow label="Signed-Up Only" value={stats?.signedUpStudents ?? 0} sub="never applied" loading={isLoading} />
            <StatRow label="Applied Students" value={stats?.appliedStudents ?? 0} sub="with applications" loading={isLoading} />
            <StatRow label="Application Conversion" value={`${conversionRate}%`} loading={isLoading} />
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <BarChart bars={applicationBars} />
            </div>
            <StatRow label="Approval Rate" value={`${approvalRate}%`} loading={isLoading} />
            <StatRow label="IBM Proofs Pending" value={stats?.ibmProofsPending ?? 0} loading={isLoading} />
          </CardContent>
        </Card>

        {/* Companies */}
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Companies & Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatRow label="Active Companies" value={stats?.activeCompanies ?? 0} loading={isLoading} />
            <StatRow label="Active Positions" value={stats?.activePositions ?? 0} loading={isLoading} />
            <StatRow label="Capacity Fill Rate" value={`${stats?.capacityFilledPercent ?? 0}%`} loading={isLoading} />
            <StatRow label="Volunteering Applications" value={stats?.volunteeringApplications ?? 0} loading={isLoading} />
            <StatRow label="Certificates Uploaded" value={stats?.certificatesUploaded ?? 0} loading={isLoading} />
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Content Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatRow label="Workshop Registrations" value={stats?.workshopRegistrations ?? 0} loading={isLoading} />
            <StatRow label="Course Views" value={stats?.courseViews ?? 0} loading={isLoading} />
            <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">Reel Engagement</span>
              </div>
              {isLoading
                ? <Skeleton className="h-5 w-12" />
                : <span className="font-bold text-foreground">{stats?.reelEngagement ?? 0}</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export section */}
      <Card className="border border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Data Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Students Export', description: 'All student records', icon: Users },
              { label: 'Applications Export', description: 'All application data', icon: FileText },
              { label: 'Company Applicants', description: 'Applications per company', icon: Building2 },
              { label: 'IBM Proofs', description: 'IBM proof review records', icon: FileText },
              { label: 'Volunteering Apps', description: 'Volunteering applications', icon: Users },
              { label: 'Certificates', description: 'Certificate records', icon: FileText },
            ].map((exp) => (
              <Button
                key={exp.label}
                variant="outline"
                className="h-auto p-4 flex items-start gap-3 justify-start text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <exp.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{exp.label}</p>
                  <p className="text-xs text-muted-foreground">{exp.description}</p>
                </div>
                <Download className="w-4 h-4 text-muted-foreground ml-auto shrink-0 mt-0.5" />
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary">CSV</Badge>
            <Badge variant="secondary">XLSX</Badge>
            <p className="text-xs text-muted-foreground ml-1">Export formats supported</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
