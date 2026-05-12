'use client';

import { useState } from 'react';
import {
  Search, Filter, Plus, BookOpen, Eye, MousePointer,
  Users, MoreHorizontal, MapPin, Video, Globe, Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkshops } from '@/Modules/workshops/workshops';
import { formatDate } from '@/lib/status-helpers';
import { Workshop } from '@/lib/eyoot-types';

const TYPE_ICONS = {
  physical: MapPin,
  online: Globe,
  video: Video,
  external: Globe,
};

const TYPE_CONFIG: Record<string, { label: string; variant: 'info' | 'success' | 'purple' | 'warning' }> = {
  physical: { label: 'Physical', variant: 'info' },
  online: { label: 'Online', variant: 'success' },
  video: { label: 'Video', variant: 'purple' },
  external: { label: 'External', variant: 'warning' },
};

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const TypeIcon = TYPE_ICONS[workshop.type] ?? BookOpen;
  const typeCfg = TYPE_CONFIG[workshop.type] ?? { label: workshop.type, variant: 'gray' as const };

  return (
    <Card className="border border-border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{workshop.title}</p>
              {workshop.speaker && <p className="text-xs text-muted-foreground mt-0.5">by {workshop.speaker}</p>}
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
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={typeCfg.variant}>{typeCfg.label}</Badge>
          <Badge variant={
            workshop.status === 'published' ? 'success'
              : workshop.status === 'completed' ? 'gray'
              : 'warning'
          }>
            {workshop.status}
          </Badge>
          {workshop.category && <Badge variant="secondary">{workshop.category}</Badge>}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {workshop.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(workshop.date)} {workshop.time ?? ''}
            </span>
          )}
          {workshop.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {workshop.location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-xs">Views</span>
            </div>
            <p className="font-semibold text-sm">{workshop.views.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
              <MousePointer className="w-3.5 h-3.5" />
              <span className="text-xs">Clicks</span>
            </div>
            <p className="font-semibold text-sm">{workshop.clicks.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">Registered</span>
            </div>
            <p className="font-semibold text-sm text-primary">{workshop.registrations.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card className="border border-border shadow-sm rounded-2xl">
      <CardContent className="p-5 space-y-3">
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
        </div>
        <div className="flex gap-2"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-5 w-20 rounded-full" /></div>
        <Skeleton className="h-3 w-2/3" />
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkshopsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const params: Record<string, unknown> = {};
  if (typeFilter !== 'all') params.type = typeFilter;
  if (statusFilter !== 'all') params.status = statusFilter;

  const { data, isLoading } = useWorkshops(params);
  const workshops: Workshop[] = data?.data ?? [];

  const filtered = workshops.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return w.title.toLowerCase().includes(q) || (w.speaker ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search workshops…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="external">External</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Add Workshop
        </Button>
      </div>

      {!isLoading && <Badge variant="gray">{filtered.length} workshops</Badge>}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <BookOpen className="w-12 h-12 opacity-20" />
          <p className="font-medium">No workshops found</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((w) => <WorkshopCard key={w.id} workshop={w} />)}
      </div>
    </div>
  );
}
