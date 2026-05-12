'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Building2, ChevronRight, MoreHorizontal, Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompanies } from '@/Modules/companies/companies';
import { capacityColor, capacityTextColor } from '@/lib/status-helpers';
import { Company } from '@/lib/eyoot-types';

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${capacityColor(used, total)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-medium shrink-0 ${capacityTextColor(used, total)}`}>
        {used}/{total}
      </span>
    </div>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="border border-border shadow-sm rounded-2xl hover:shadow-md transition-shadow group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Building2 className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">{company.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>
              </div>
              <Badge variant={company.status === 'active' ? 'success' : 'gray'}>
                {company.status}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted/50 rounded-xl p-2">
                <p className="text-lg font-bold text-foreground">{company.activePositions}</p>
                <p className="text-xs text-muted-foreground">Positions</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-2">
                <p className="text-lg font-bold text-foreground">{company.applicationsCount}</p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-2">
                <p className={`text-lg font-bold ${capacityTextColor(company.usedCapacity, company.totalCapacity)}`}>
                  {company.remainingCapacity}
                </p>
                <p className="text-xs text-muted-foreground">Seats Left</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Capacity</span>
                <span>{company.usedCapacity}/{company.totalCapacity}</span>
              </div>
              <CapacityBar used={company.usedCapacity} total={company.totalCapacity} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href={`/dashboard/companies/${company.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/dashboard/applications?companyId=${company.id}`}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" /> Apps
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/positions?companyId=${company.id}`}>View Positions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Company</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyCardSkeleton() {
  return (
    <Card className="border border-border shadow-sm rounded-2xl">
      <CardContent className="p-5 space-y-3">
        <div className="flex gap-4">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useCompanies();
  const companies: Company[] = data?.data ?? [];

  const filtered = companies.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {!isLoading && (
        <Badge variant="gray">{filtered.length} companies</Badge>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Building2 className="w-12 h-12 opacity-20" />
          <p className="font-medium">No companies found</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)
          : filtered.map((c) => <CompanyCard key={c.id} company={c} />)}
      </div>
    </div>
  );
}
