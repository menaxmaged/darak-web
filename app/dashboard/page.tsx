'use client';

import Link from 'next/link';
import {
  GraduationCap, FileText, Building2, Briefcase, BadgeCheck,
  BookOpen, Award, Bell, AlertTriangle, Info, CheckCircle2,
  ChevronRight, Users, TrendingUp, Clock, XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/Modules/Analytics/analytics';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, sub, subColor = 'text-muted-foreground', accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  subColor?: string;
  accent?: boolean;
}) {
  return (
    <Card className="border border-border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${accent ? 'text-[#FFAF00]' : 'text-foreground'}`}>
              {value}
            </p>
            {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
          </div>
          <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Stat Skeleton ────────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <Card className="border border-border shadow-sm rounded-2xl">
      <CardContent className="p-5 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

// ─── Alert Row ────────────────────────────────────────────────────────────────
function AlertRow({ type, message, href }: { type: 'warning' | 'info' | 'error' | 'success'; message: string; href?: string }) {
  const cfg = {
    warning: { icon: AlertTriangle, cls: 'border-amber-200 bg-amber-50 text-amber-800', iconCls: 'text-amber-500' },
    info: { icon: Info, cls: 'border-blue-200 bg-blue-50 text-blue-800', iconCls: 'text-blue-500' },
    error: { icon: XCircle, cls: 'border-red-200 bg-red-50 text-red-800', iconCls: 'text-red-500' },
    success: { icon: CheckCircle2, cls: 'border-emerald-200 bg-emerald-50 text-emerald-800', iconCls: 'text-emerald-500' },
  }[type];
  const Icon = cfg.icon;

  const inner = (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.cls} text-sm`}>
      <Icon className={`w-4 h-4 shrink-0 ${cfg.iconCls}`} />
      <span className="flex-1">{message}</span>
      {href && <ChevronRight className="w-4 h-4 opacity-50" />}
    </div>
  );

  return href ? (
    <Link href={href} className="block hover:opacity-90 transition-opacity">{inner}</Link>
  ) : (
    <div>{inner}</div>
  );
}

// ─── Quick Nav Card ───────────────────────────────────────────────────────────
function QuickNavCard({
  href, icon: Icon, label, description, badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  badge?: { text: string; variant?: 'warning' | 'destructive' | 'success' | 'info' };
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white border border-border rounded-2xl hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {badge && <Badge variant={badge.variant ?? 'warning'}>{badge.text}</Badge>}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: GraduationCap, sub: 'registered accounts' },
    { label: 'Signed-Up Only', value: stats?.signedUpStudents ?? 0, icon: Users, sub: 'never applied' },
    { label: 'Applied Students', value: stats?.appliedStudents ?? 0, icon: TrendingUp, sub: 'with applications', subColor: 'text-blue-600' },
    { label: 'Total Applications', value: stats?.totalApplications ?? 0, icon: FileText, sub: 'all time' },
    { label: 'Pending Review', value: stats?.pendingApplications ?? 0, icon: Clock, sub: 'awaiting action', subColor: 'text-amber-600', accent: true },
    { label: 'Approved', value: stats?.approvedApplications ?? 0, icon: CheckCircle2, sub: 'internships confirmed', subColor: 'text-emerald-600' },
    { label: 'Declined', value: stats?.declinedApplications ?? 0, icon: XCircle, sub: 'not selected', subColor: 'text-red-500' },
    { label: 'IBM Proofs Pending', value: stats?.ibmProofsPending ?? 0, icon: BadgeCheck, sub: 'need review', subColor: 'text-amber-600', accent: true },
    { label: 'Active Companies', value: stats?.activeCompanies ?? 0, icon: Building2, sub: 'partner companies' },
    { label: 'Active Positions', value: stats?.activePositions ?? 0, icon: Briefcase, sub: 'open roles' },
    { label: 'Capacity Filled', value: stats ? `${stats.capacityFilledPercent ?? 0}%` : '0%', icon: TrendingUp, sub: 'of total seats', subColor: (stats?.capacityFilledPercent ?? 0) >= 80 ? 'text-red-500' : 'text-emerald-600' },
    { label: 'Volunteering Apps', value: stats?.volunteeringApplications ?? 0, icon: Award, sub: 'submissions' },
    { label: 'Certificates Uploaded', value: stats?.certificatesUploaded ?? 0, icon: Award, sub: 'completion certs' },
    { label: 'Workshop Registrations', value: stats?.workshopRegistrations ?? 0, icon: BookOpen, sub: 'total sign-ups' },
    { label: 'Course Views', value: stats?.courseViews ?? 0, icon: BookOpen, sub: 'total views' },
    { label: 'Reel Engagement', value: stats?.reelEngagement ?? 0, icon: Bell, sub: 'interactions' },
  ];

  const alerts = [
    ...(stats?.ibmProofsPending ? [{
      type: 'warning' as const,
      message: `${stats.ibmProofsPending} IBM proofs waiting for review`,
      href: '/dashboard/ibm-proofs',
    }] : []),
    ...(stats && stats.capacityFilledPercent >= 90 ? [{
      type: 'error' as const,
      message: 'Some positions are at or near full capacity',
      href: '/dashboard/positions',
    }] : []),
    ...(stats?.pendingApplications ? [{
      type: 'info' as const,
      message: `${stats.pendingApplications} applications awaiting status update`,
      href: '/dashboard/applications',
    }] : []),
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Platform Overview
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 16 }).map((_, i) => <StatSkeleton key={i} />)
            : statCards.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Quick Alerts
          </h2>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <AlertRow type="success" message="No urgent actions required — platform is running smoothly." />
            ) : (
              alerts.map((a, i) => <AlertRow key={i} {...a} />)
            )}
            {!isLoading && !stats && (
              <AlertRow type="info" message="Connect to the API to see live alerts." />
            )}
          </div>
        </section>

        {/* Quick Navigation */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <QuickNavCard
              href="/dashboard/ibm-proofs?status=pending"
              icon={BadgeCheck}
              label="Review IBM Proofs"
              description="Students awaiting proof approval"
              badge={stats?.ibmProofsPending ? { text: `${stats.ibmProofsPending} pending`, variant: 'warning' } : undefined}
            />
            <QuickNavCard
              href="/dashboard/applications?status=applied"
              icon={FileText}
              label="Pending Applications"
              description="Applications not yet actioned"
              badge={stats?.pendingApplications ? { text: `${stats.pendingApplications}`, variant: 'info' } : undefined}
            />
            <QuickNavCard
              href="/dashboard/students?type=signed-up"
              icon={GraduationCap}
              label="Students Without Applications"
              description="Signed-up students who haven't applied"
              badge={stats?.signedUpStudents ? { text: `${stats.signedUpStudents}`, variant: 'info' } : undefined}
            />
            <QuickNavCard
              href="/dashboard/positions?status=full"
              icon={Briefcase}
              label="Full Positions"
              description="Positions at maximum capacity"
            />
            <QuickNavCard
              href="/dashboard/notifications/new"
              icon={Bell}
              label="Send Notification"
              description="Target students by status or company"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
