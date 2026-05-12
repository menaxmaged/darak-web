'use client';

import { useState } from 'react';
import { Search, Plus, ShieldCheck, MoreHorizontal, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ADMIN_ROLE_CONFIG, formatDate, formatDateTime } from '@/lib/status-helpers';
import { AdminRole, AdminUser } from '@/lib/eyoot-types';

const ROLE_VARIANT: Record<AdminRole, 'default' | 'warning' | 'info' | 'success' | 'purple'> = {
  'super-admin': 'warning',
  'applications-manager': 'info',
  'student-manager': 'success',
  'content-manager': 'purple',
  'analytics-viewer': 'default',
};

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  'super-admin': 'Full platform access and settings',
  'applications-manager': 'Manage student applications and statuses',
  'student-manager': 'Manage students, bans, and profiles',
  'content-manager': 'Manage workshops, courses, and reels',
  'analytics-viewer': 'View-only access to analytics',
};

// Placeholder — connect to real admin users API
const MOCK_ADMINS: AdminUser[] = [];

function AdminRow({ admin }: { admin: AdminUser }) {
  const roleCfg = ADMIN_ROLE_CONFIG[admin.role];
  const variant = ROLE_VARIANT[admin.role];

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{admin.name}</p>
            <p className="text-xs text-muted-foreground">{admin.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={variant}>{roleCfg.label}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={admin.status === 'active' ? 'success' : 'gray'}>{admin.status}</Badge>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {admin.lastActive ? (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDateTime(admin.lastActive)}
          </span>
        ) : '—'}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(admin.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Role</DropdownMenuItem>
              <DropdownMenuItem>Reset Password</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_ADMINS.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Role descriptions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.entries(ADMIN_ROLE_CONFIG) as [AdminRole, { label: string }][]).map(([role, cfg]) => (
          <div key={role} className="flex items-start gap-3 p-4 bg-white border border-border rounded-2xl">
            <Badge variant={ROLE_VARIANT[role]} className="shrink-0 mt-0.5">{cfg.label}</Badge>
            <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
          </div>
        ))}
      </div>

      {/* Filters + add */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search admins…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Add Admin
        </Button>
      </div>

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Admin', 'Role', 'Status', 'Last Active', 'Created', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                      <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No admin users yet</p>
                      <p className="text-xs mt-1">Add your first admin to get started</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((admin) => <AdminRow key={admin.id} admin={admin} />)
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
