'use client';

import Link from 'next/link';
import {
  Building2, FileText, MapPin, TrendingUp, Clock,
  CheckCircle2, XCircle, ChevronRight, Phone,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useListings } from '@/Modules/listings/hooks';
import { useLeads } from '@/Modules/leads/hooks';
import { useProjects } from '@/Modules/projects/hooks';
import { useAreas } from '@/Modules/areas/hooks';

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

function QuickNavCard({
  href, icon: Icon, label, description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
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
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

export default function DashboardPage() {
  const { data: listingsRes, isLoading: listingsLoading } = useListings();
  const { data: leadsRes, isLoading: leadsLoading } = useLeads();
  const { data: projectsRes, isLoading: projectsLoading } = useProjects();
  const { data: areasRes, isLoading: areasLoading } = useAreas();

  const isLoading = listingsLoading || leadsLoading || projectsLoading || areasLoading;

  const listings = listingsRes?.data ?? [];

  const leads = leadsRes?.meta?.totalItems ?? 0;
  const projects = projectsRes?.meta?.totalItems ?? 0;
  const areas = areasRes?.meta?.totalItems ?? 0;
  const pending = listings.filter((l) => l.listing_status === 'pending').length;
  const approved = listings.filter((l) => l.listing_status === 'approved').length;
  const rejected = listings.filter((l) => l.listing_status === 'rejected').length;
  const statCards = [
    { label: 'Total Listings', value: listingsRes?.meta?.totalItems ?? 0, icon: FileText, sub: 'all time' },
    { label: 'Pending Review', value: pending, icon: Clock, sub: 'awaiting action', subColor: 'text-amber-600', accent: true },
    { label: 'Approved', value: approved, icon: CheckCircle2, sub: 'live listings', subColor: 'text-emerald-600' },
    { label: 'Rejected', value: rejected, icon: XCircle, sub: 'not approved', subColor: 'text-red-500' },
    { label: 'Total Leads', value: leads, icon: Phone, sub: 'contact requests' },
    { label: 'Projects', value: projects, icon: Building2, sub: 'active developments' },
    { label: 'Areas', value: areas, icon: MapPin, sub: 'covered locations' },
    { label: 'Featured', value: listings.filter((l) => l.is_featured).length, icon: TrendingUp, sub: 'highlighted listings', subColor: 'text-blue-600' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Platform Overview
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <StatSkeleton key={i} />)
            : statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickNavCard href="/dashboard/listings?status=pending" icon={Clock} label="Review Pending Listings" description="Listings awaiting approval" />
          <QuickNavCard href="/dashboard/listings" icon={FileText} label="All Listings" description="Browse and manage listings" />
          <QuickNavCard href="/dashboard/leads" icon={Phone} label="View Leads" description="Contact requests from users" />
          <QuickNavCard href="/dashboard/projects" icon={Building2} label="Projects" description="Manage real estate projects" />
          <QuickNavCard href="/dashboard/areas" icon={MapPin} label="Areas" description="Manage cities and areas" />
        </div>
      </section>
    </div>
  );
}
