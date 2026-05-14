'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MoreHorizontal, UserCheck, UserX, Shield, ShieldOff, Eye, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUsers, useBanUser, useEditRole, useEditStatus, useUser } from '@/Modules/users/users';
import { getErrorMessage } from '@/lib/api-client';
import { TablePagination } from '@/components/ui/table-pagination';
import type { User } from '@/lib/types';

const PAGE_SIZE = 20;

// ─── Inner content (needs useSearchParams) ─────────────────────────────────────

function UsersPageContent() {
  const searchParams = useSearchParams();
  const registeredOnly = searchParams.get('registered') === 'true';

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('users');
  const [statusFilter, setStatusFilter] = useState('');
  const [isBannedFilter, setIsBannedFilter] = useState('');
  const [countryCodeFilter, setCountryCodeFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('ASC');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(registeredOnly ? { registrationFeePaid: 'true' } : {}),
    ...(searchFilter ? { search: searchFilter } : {}),
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(isBannedFilter !== '' ? { isBanned: isBannedFilter } : {}),
    ...(countryCodeFilter ? { countryCode: countryCodeFilter } : {}),
    ...(orderFilter ? { order: orderFilter } : {}),
  };

  const { data: usersData, isLoading } = useUsers(params);
  const { data: selectedUser, isLoading: isUserLoading } = useUser({
    username: selectedUsername ?? undefined,
  });
  const banUserMutation    = useBanUser();
  const editRoleMutation   = useEditRole();
  const editStatusMutation = useEditStatus();

  const handleBanToggle = async (user: User) => {
    try {
      const result = await banUserMutation.mutateAsync({ username: user.username, is_banned: !user.isBanned });
      toast.success(result.message_en || `User ${user.isBanned ? 'unbanned' : 'banned'} successfully`);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const handleRoleToggle = async (user: User) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      const result = await editRoleMutation.mutateAsync({ username: user.username, role: newRole });
      toast.success(result.message_en || `User role updated to ${newRole}`);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const result = await editStatusMutation.mutateAsync({ username: user.username, status: newStatus });
      toast.success(result.message_en || `User status updated to ${newStatus}`);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const applySearch = () => { setSearchFilter(searchInput.trim()); setPage(1); };

  const clearFilters = () => {
    setSearchInput(''); setSearchFilter(''); setTypeFilter('users');
    setStatusFilter(''); setIsBannedFilter(''); setCountryCodeFilter('');
    setOrderFilter('ASC'); setPage(1);
  };

  const rawData    = usersData;
  const users      = Array.isArray(rawData) ? rawData : (rawData?.data ?? []);
  const meta       = Array.isArray(rawData) ? undefined : rawData?.meta;
  const visibleUsers = registeredOnly
    ? users.filter((u) => u.registrationFeePaid === true)
    : users;

  const hasActiveFilters = searchFilter || statusFilter || isBannedFilter || countryCodeFilter
    || orderFilter !== 'ASC' || typeFilter !== 'users';

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Search row */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            placeholder="Search name, email, or username…"
            className="w-64 rounded-xl"
          />
          <Button size="sm" className="rounded-xl gradient-primary" onClick={applySearch}>
            Search
          </Button>
          {hasActiveFilters && (
            <Button size="sm" variant="outline" className="rounded-xl" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-32 rounded-xl h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="admins">Admins</SelectItem>
            </SelectContent>
          </Select>

          {!registeredOnly && (
            <>
              <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
                <SelectTrigger className="w-32 rounded-xl h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={isBannedFilter || 'all'} onValueChange={(v) => { setIsBannedFilter(v === 'all' ? '' : v); setPage(1); }}>
                <SelectTrigger className="w-32 rounded-xl h-9">
                  <SelectValue placeholder="Banned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Banned</SelectItem>
                  <SelectItem value="null">Not banned</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <Input
            value={countryCodeFilter}
            onChange={(e) => { setCountryCodeFilter(e.target.value.toUpperCase()); setPage(1); }}
            placeholder="Country (EG)"
            className="w-28 rounded-xl h-9"
          />

          <Select value={orderFilter} onValueChange={(v) => { setOrderFilter(v); setPage(1); }}>
            <SelectTrigger className="w-28 rounded-xl h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">Oldest first</SelectItem>
              <SelectItem value="DESC">Newest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : visibleUsers.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Phone</th>
                  <th className="text-left p-4 text-sm font-medium">Role</th>
                  <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Status</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Banned</th>
                  <th className="p-4 text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user) => (
                  <tr key={user.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">@{user.username}</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{user.email}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{user.phone || '—'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isBanned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-secondary">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => { setSelectedUsername(user.username); setIsViewOpen(true); }}
                            className="rounded-xl cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleBanToggle(user)}
                            className="rounded-xl cursor-pointer"
                          >
                            {user.isBanned
                              ? <><UserCheck className="mr-2 h-4 w-4" /> Unban User</>
                              : <><UserX    className="mr-2 h-4 w-4" /> Ban User</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleToggle(user)}
                            className="rounded-xl cursor-pointer"
                          >
                            {user.role === 'admin'
                              ? <><ShieldOff className="mr-2 h-4 w-4" /> Remove Admin</>
                              : <><Shield    className="mr-2 h-4 w-4" /> Make Admin</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(user)}
                            className="rounded-xl cursor-pointer"
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-xl">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />

      {/* ── View User Dialog ── */}
      <Dialog open={isViewOpen} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedUsername(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Loading…'}
            </DialogDescription>
          </DialogHeader>
          {isUserLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
            </div>
          ) : selectedUser ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {([
                ['Username',              selectedUser.username],
                ['Email',                 selectedUser.email],
                ['Phone',                 selectedUser.phone || '—'],
                ['Country',               selectedUser.countryCode || '—'],
                ['Role',                  selectedUser.role],
                ['Status',                selectedUser.status],
                ['Banned',                selectedUser.isBanned ? 'Yes' : 'No'],
                ['Registration fee paid', selectedUser.registrationFeePaid ? 'Yes' : 'No'],
                ['Date of birth',         selectedUser.dateOfBirth || '—'],
                ['Joined',                selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '—'],
              ] as [string, string][]).map(([label, val]) => (
                <div key={label} className="p-3 bg-secondary rounded-xl">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No user data found.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  );
}
