'use client';


import { useUsers, useBanUser, useEditRole, useEditStatus, useUser } from '@/Modules/users/users';
import { getErrorMessage } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceSkeleton } from '@/components/resource-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserCheck, UserX, Shield, ShieldOff, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function UsersPageContent() {
  const searchParams = useSearchParams();
  const registeredOnly = searchParams.get('registered') === 'true';
  const PAGE_SIZE = 20;
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
    ...(typeFilter ?  { type: typeFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(isBannedFilter !== '' ? { isBanned: isBannedFilter } : {}),
    ...(countryCodeFilter ? { countryCode: countryCodeFilter } : {}),
    ...(orderFilter ? { order: orderFilter } : {}),
  };

  const { data: usersData, isLoading, isFetching } = useUsers(params);
  const { data: selectedUser, isLoading: isUserLoading } = useUser({
    username: selectedUsername ?? undefined,
  });
  const banUserMutation = useBanUser();
  const editRoleMutation = useEditRole();
  const editStatusMutation = useEditStatus();

  const handleBanToggle = async (user: User) => {
    try {
      const result = await banUserMutation.mutateAsync({
        username: user.username,
        is_banned: !user.isBanned,
      });
      toast.success(result.message_en || `User ${user.isBanned ? 'unbanned' : 'banned'} successfully`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRoleToggle = async (user: User) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      const result = await editRoleMutation.mutateAsync({
        username: user.username,
        role: newRole,
      });
      toast.success(result.message_en || `User role updated to ${newRole}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const result = await editStatusMutation.mutateAsync({
        username: user.username,
        status: newStatus,
      });
      toast.success(result.message_en || `User status updated to ${newStatus}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUsername(user.username);
    setIsViewOpen(true);
  };

  if (isLoading) {
    return <ResourceSkeleton rows={8} />;
  }

  // Ensure users is always an array
  const users = Array.isArray(usersData)
    ? usersData
    : (usersData && Array.isArray(usersData.data))
      ? usersData.data
      : [];
  const visibleUsers = registeredOnly
    ? users.filter((user) => user.registrationFeePaid === true)
    : users;
  const pagination = usersData && !Array.isArray(usersData) ? usersData.meta : undefined;
  const totalPages = pagination?.totalPages ?? 1;

  const applySearchFilter = () => {
    setSearchFilter(searchInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchFilter('');
    setTypeFilter('users');
    setStatusFilter('');
    setIsBannedFilter('');
    setCountryCodeFilter('');
    setOrderFilter('ASC');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-sm rounded-2xl">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-brand-charcoal">Search:</span>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearchFilter()}
              placeholder="Name, email, or username"
              className="rounded-xl border-border w-64 h-9"
            />
            <Button size="sm" className="rounded-xl h-9" onClick={applySearchFilter}>
              Apply
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-brand-charcoal">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="rounded-xl border border-border h-9 px-3 text-sm bg-background"
              >
                <option value="users">Users</option>
                <option value="admins">Admins</option>
              </select>
            </div>
            {registeredOnly ? null : (
            <><div className="flex items-center gap-2">
                <span className="text-sm font-medium text-brand-charcoal">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); } }
                  className="rounded-xl border border-border h-9 px-3 text-sm bg-background"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div><div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-brand-charcoal">Banned:</span>
                  <select
                    value={isBannedFilter}
                    onChange={(e) => { setIsBannedFilter(e.target.value); setPage(1); } }
                    className="rounded-xl border border-border h-9 px-3 text-sm bg-background"
                  >
                    <option value="">All</option>
                    <option value="true">Banned</option>
                    <option value="null">Not banned</option>
                  </select>
                </div></>
)}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-brand-charcoal">Country:</span>
              <Input
                value={countryCodeFilter}
                onChange={(e) => { setCountryCodeFilter(e.target.value.toUpperCase()); setPage(1); }}
                placeholder="EG"
                className="rounded-xl border-border w-20 h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-brand-charcoal">Order:</span>
              <select
                value={orderFilter}
                onChange={(e) => { setOrderFilter(e.target.value); setPage(1); }}
                className="rounded-xl border border-border h-9 px-3 text-sm bg-background"
              >
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>
            </div>
            {(searchFilter || statusFilter || isBannedFilter || countryCodeFilter || orderFilter !== 'ASC' || typeFilter !== 'users') && (
              <Button size="sm" variant="outline" className="rounded-xl h-9" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            All Users ({visibleUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-brand-cream/50">
                <TableRow className="hover:bg-brand-cream/50">
                  <TableHead className="font-semibol  text-center">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Banned</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-brand-gray py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-brand-cream/30">
                      <TableCell className="font-medium text-brand-charcoal">
                        {user.firstName} {user.lastName} 
                      </TableCell>
                      <TableCell className="text-brand-gray">{user.email}</TableCell>
                      <TableCell className="text-brand-gray">{user.phone || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-brand-rust/10 text-brand-rust'
                              : 'bg-brand-cream text-brand-charcoal'
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isBanned
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.isBanned ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 rounded-xl hover:bg-brand-cream"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewUser(user)}
                              className="rounded-xl cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleBanToggle(user)}
                              className="rounded-xl cursor-pointer"
                            >
                              {user.isBanned ? (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Unban User
                                </>
                              ) : (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Ban User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleToggle(user)}
                              className="rounded-xl cursor-pointer"
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Make Admin
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(user)}
                              className="rounded-xl cursor-pointer"
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-brand-gray">
            Page {pagination?.currentPage ?? page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                className="rounded-xl"
                onClick={() => setPage(p)}
                disabled={isFetching}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          setIsViewOpen(open);
          if (!open) {
            setSelectedUsername(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `${selectedUser.firstName} ${selectedUser.lastName}`
                : 'Loading user details'}
            </DialogDescription>
          </DialogHeader>
          {isUserLoading ? (
            <div className="text-sm text-brand-gray">Loading...</div>
          ) : selectedUser ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-brand-gray">Username</div>
                <div className="text-brand-charcoal font-medium">{selectedUser.username}</div>
              </div>
              <div>
                <div className="text-brand-gray">Email</div>
                <div className="text-brand-charcoal font-medium">{selectedUser.email}</div>
              </div>
              <div>
                <div className="text-brand-gray">Phone</div>
                <div className="text-brand-charcoal font-medium">
                  {selectedUser.phone || '-'}
                </div>
              </div>
              <div>
                <div className="text-brand-gray">Country</div>
                <div className="text-brand-charcoal font-medium">
                  {selectedUser.countryCode || '-'}
                </div>
              </div>
              <div>
                <div className="text-brand-gray">Role</div>
                <div className="text-brand-charcoal font-medium">{selectedUser.role}</div>
              </div>
              <div>
                <div className="text-brand-gray">Status</div>
                <div className="text-brand-charcoal font-medium">{selectedUser.status}</div>
              </div>
              <div>
                <div className="text-brand-gray">Banned</div>
                <div className="text-brand-charcoal font-medium">
                  {selectedUser.isBanned ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-brand-gray">Registration Fee Paid</div>
                <div className="text-brand-charcoal font-medium">
                  {selectedUser.registrationFeePaid ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-brand-gray">Date of Birth</div>
                <div className="text-brand-charcoal font-medium">
                  {selectedUser.dateOfBirth || '-'}
                </div>
              </div>
              <div>
                <div className="text-brand-gray">Created At</div>
                <div className="text-brand-charcoal font-medium">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : '-'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-brand-gray">No user data found.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  );
}
