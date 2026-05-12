'use client';

import { useState } from 'react';
import {
  Search, Plus, Heart, MapPin, Clock, Users, CheckCircle2, MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useVolunteering } from '@/Modules/volunteering/volunteering';
import { formatDate } from '@/lib/status-helpers';
import { VolunteeringOpportunity } from '@/lib/eyoot-types';

function OpportunityCard({ opp }: { opp: VolunteeringOpportunity }) {
  const completionRate = opp.approvedCount > 0
    ? Math.round((opp.completedCount / opp.approvedCount) * 100)
    : 0;

  return (
    <Card className="border border-border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{opp.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opp.organization}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>View Applicants</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Close</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={
            opp.status === 'active' ? 'success'
              : opp.status === 'completed' ? 'gray' : 'warning'
          }>
            {opp.status}
          </Badge>
          {opp.skillsNeeded && opp.skillsNeeded.length > 0 && (
            <Badge variant="secondary">{opp.skillsNeeded[0]}{opp.skillsNeeded.length > 1 ? ` +${opp.skillsNeeded.length - 1}` : ''}</Badge>
          )}
        </div>

        {opp.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          {opp.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{opp.location}</span>
          )}
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{opp.requiredHours}h required</span>
          {opp.date && (
            <span className="flex items-center gap-1">{formatDate(opp.date)}</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
              <Users className="w-3.5 h-3.5" />
            </div>
            <p className="font-semibold text-sm">{opp.applicantsCount}</p>
            <p className="text-[10px] text-muted-foreground">Applied</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="font-semibold text-sm text-emerald-600">{opp.approvedCount}</p>
            <p className="text-[10px] text-muted-foreground">Approved</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm text-primary">{completionRate}%</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VolunteeringPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useVolunteering();
  const opps: VolunteeringOpportunity[] = data?.data ?? [];

  const filtered = opps.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search opportunities…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Add Opportunity
        </Button>
      </div>

      {!isLoading && <Badge variant="gray">{filtered.length} opportunities</Badge>}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Heart className="w-12 h-12 opacity-20" />
          <p className="font-medium">No volunteering opportunities found</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border border-border shadow-sm rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                </div>
                <div className="flex gap-2"><Skeleton className="h-5 w-16 rounded-full" /></div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                  {[0, 1, 2].map((j) => <Skeleton key={j} className="h-12 rounded-xl" />)}
                </div>
              </CardContent>
            </Card>
          ))
          : filtered.map((o) => <OpportunityCard key={o.id} opp={o} />)}
      </div>
    </div>
  );
}
