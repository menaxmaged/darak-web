'use client';

import { useState } from 'react';
import {
  Search, Plus, BookMarked, Eye, MousePointer,
  Bookmark, Users, MoreHorizontal, ExternalLink,
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
import { useCourses } from '@/Modules/courses/courses';
import { Course } from '@/lib/eyoot-types';

const TYPE_CONFIG: Record<string, { label: string; variant: 'info' | 'success' | 'purple' }> = {
  external: { label: 'External', variant: 'info' },
  'internal-video': { label: 'Internal Video', variant: 'success' },
  informational: { label: 'Informational', variant: 'purple' },
};

function CourseCard({ course }: { course: Course }) {
  const typeCfg = TYPE_CONFIG[course.type] ?? { label: course.type, variant: 'gray' as const };

  return (
    <Card className="border border-border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookMarked className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-snug">{course.title}</p>
              {course.provider && <p className="text-xs text-muted-foreground mt-0.5">{course.provider}</p>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              {course.link && (
                <DropdownMenuItem asChild>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" /> Open Link
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={typeCfg.variant}>{typeCfg.label}</Badge>
          <Badge variant={course.status === 'published' ? 'success' : 'warning'}>{course.status}</Badge>
          {course.category && <Badge variant="secondary">{course.category}</Badge>}
        </div>

        {course.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
        )}

        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
          {[
            { icon: Eye, label: 'Views', value: course.views },
            { icon: MousePointer, label: 'Clicks', value: course.clicks },
            { icon: Bookmark, label: 'Saves', value: course.saves },
            { icon: Users, label: 'Registered', value: course.registrations },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-0.5 text-muted-foreground mb-0.5">
                <s.icon className="w-3 h-3" />
              </div>
              <p className="font-semibold text-xs">{s.value.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const params: Record<string, unknown> = {};
  if (typeFilter !== 'all') params.type = typeFilter;

  const { data, isLoading } = useCourses(params);
  const courses: Course[] = data?.data ?? [];

  const filtered = courses.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || (c.provider ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Course type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="external">External</SelectItem>
            <SelectItem value="internal-video">Internal Video</SelectItem>
            <SelectItem value="informational">Informational</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      {!isLoading && <Badge variant="gray">{filtered.length} courses</Badge>}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <BookMarked className="w-12 h-12 opacity-20" />
          <p className="font-medium">No courses found</p>
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
                <div className="flex gap-2"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-5 w-20 rounded-full" /></div>
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
                  {[0, 1, 2, 3].map((j) => <Skeleton key={j} className="h-10 rounded" />)}
                </div>
              </CardContent>
            </Card>
          ))
          : filtered.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}
