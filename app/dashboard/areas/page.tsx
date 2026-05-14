'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAreas, useCities, useCreateArea, useUpdateArea, useDeleteArea } from '@/Modules/areas/hooks';
import { TablePagination } from '@/components/ui/table-pagination';
import type { Area, AreaInsert } from '@/Modules/areas/types';

const PAGE_SIZE = 20;

// ─── Form Dialog ──────────────────────────────────────────────────────────────

function AreaDialog({
  area,
  onClose,
}: {
  area: Area | null | 'new';
  onClose: () => void;
}) {
  const isNew = area === 'new';
  const initial = isNew ? { name: '', city: '' } : { name: area?.name ?? '', city: area?.city ?? '' };

  const [form, setForm] = useState<AreaInsert>(initial);
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();

  const isPending = createArea.isPending || updateArea.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;

    if (isNew) {
      createArea.mutate(form, {
        onSuccess: () => { toast.success('Area created'); onClose(); },
        onError: () => toast.error('Failed to create area'),
      });
    } else {
      updateArea.mutate(
        { id: (area as Area).id, data: form },
        {
          onSuccess: () => { toast.success('Area updated'); onClose(); },
          onError: () => toast.error('Failed to update area'),
        }
      );
    }
  };

  return (
    <Dialog open={!!area} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'New Area' : 'Edit Area'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="area-name">Name</Label>
            <Input
              id="area-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. New Cairo"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="area-city">City</Label>
            <Input
              id="area-city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Cairo"
              className="mt-1"
              required
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="gradient-primary">
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isNew ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AreasPage() {
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [dialogArea, setDialogArea] = useState<Area | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<Area | null>(null);
  const [page, setPage] = useState(1);

  const setCity = (v: string) => { setCityFilter(v); setPage(1); };

  const { data: areasRes, isLoading } = useAreas(
    cityFilter !== 'all' ? { city: cityFilter, page, limit: PAGE_SIZE } : { page, limit: PAGE_SIZE }
  );
  const { data: citiesRes } = useCities();
  const deleteArea = useDeleteArea();

  const areas = areasRes?.data ?? [];
  const meta = areasRes?.meta;
  const cities: string[] = (citiesRes as { data?: string[] } | undefined)?.data ?? [];

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteArea.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('Area deleted'); setDeleteTarget(null); },
      onError: () => toast.error('Failed to delete area'),
    });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? '…' : (meta?.totalItems ?? areas.length)} area{(meta?.totalItems ?? areas.length) !== 1 ? 's' : ''}
          </p>
          <Select value={cityFilter} onValueChange={setCity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogArea('new')} className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" /> New Area
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : areas.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-sm font-medium">Name</th>
                <th className="text-left p-4 text-sm font-medium">City</th>
                <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Created</th>
                <th className="p-4 text-sm font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                  <td className="p-4 font-medium text-sm">{area.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{area.city}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {new Date(area.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDialogArea(area)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(area)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-xl">
          <p className="text-muted-foreground">No areas found.</p>
          <Button className="mt-4 gradient-primary" onClick={() => setDialogArea('new')}>
            <Plus className="h-4 w-4 mr-2" /> Add first area
          </Button>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />

      <AreaDialog area={dialogArea} onClose={() => setDialogArea(null)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete area?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteArea.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
