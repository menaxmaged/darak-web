'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Filter, ChevronRight, GraduationCap, Award,
  FileText, ArrowUpDown, UserX, MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useStudents } from '@/Modules/students/students';
import { formatDate } from '@/lib/status-helpers';
import { Student } from '@/lib/eyoot-types';

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({
  search, setSearch, type, setType,
}: {
  search: string; setSearch: (v: string) => void;
  type: string; setType: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-52">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-44">
          <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Student type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Students</SelectItem>
          <SelectItem value="signed-up">Signed-Up Only</SelectItem>
          <SelectItem value="applied">Applied to Internships</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Row skeleton ─────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr>
      {[180, 100, 80, 60, 80, 100, 80, 100].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Student row ─────────────────────────────────────────────────────────────
function StudentRow({ student }: { student: Student }) {
  return (
    <tr className="hover:bg-muted/40 transition-colors border-b border-border last:border-0 group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{student.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{student.email}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{student.phone ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-center">{student.age ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-center font-medium">{student.applicationsCount}</td>
      <td className="px-4 py-3">
        <Badge variant={student.studentType === 'applied' ? 'info' : 'gray'}>
          {student.studentType === 'applied' ? 'Applied' : 'Signed-Up'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-center">
        <span className="flex items-center justify-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#FFAF00]" />
          {student.ibmBadgesCount}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(student.signupDate)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          <Link
            href={`/dashboard/students/${student.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            View <ChevronRight className="w-3 h-3" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/students/${student.id}`}>View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/applications?studentId=${student.id}`}>
                  <FileText className="w-4 h-4 mr-2" /> View Applications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <UserX className="w-4 h-4 mr-2" /> Ban Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('signupDate');

  const params: Record<string, unknown> = {};
  if (type !== 'all') params.studentType = type;
  if (search) params.search = search;
  params.sort = sort;

  const { data, isLoading } = useStudents(params);
  const students: Student[] = (data?.data as Student[] | undefined) ?? [];

  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <FilterBar search={search} setSearch={setSearch} type={type} setType={setType} />

      {/* Summary badges */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="gray">{filtered.length} total</Badge>
          <Badge variant="info">{filtered.filter((s) => s.studentType === 'applied').length} applied</Badge>
          <Badge variant="gray">{filtered.filter((s) => s.studentType === 'signed-up').length} signed-up only</Badge>
        </div>
      )}

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {[
                    { key: 'name', label: 'Student' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'age', label: 'Age' },
                    { key: 'applicationsCount', label: 'Apps' },
                    { key: 'studentType', label: 'Type' },
                    { key: 'ibmBadgesCount', label: 'IBM' },
                    { key: 'signupDate', label: 'Signed Up' },
                    { key: '', label: '' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {col.key && col.label ? (
                        <button
                          onClick={() => setSort(col.key)}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          {col.label}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground">
                        <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No students found</p>
                        <p className="text-xs mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  )
                  : filtered.map((s) => <StudentRow key={s.id} student={s} />)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
