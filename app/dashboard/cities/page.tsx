'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Globe, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCitiesAdmin, useCreateCity, useUpdateCity, useDeleteCity } from '@/Modules/cities/hooks';
import { TablePagination } from '@/components/ui/table-pagination';
import type { City, CityInsert } from '@/Modules/cities/types';

const PAGE_SIZE = 20;

// ─── Form Dialog ──────────────────────────────────────────────────────────────

function CityDialog({ city, onClose }: { city: City | null | 'new'; onClose: () => void }) {
  const isNew = city === 'new';
  const initial: CityInsert = isNew ? { name: '' } : { name: (city as City)?.name ?? '' };

  const [form, setForm] = useState<CityInsert>(initial);
  const createCity = useCreateCity();
  const updateCity = useUpdateCity();
  const isPending = createCity.isPending || updateCity.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (isNew) {
      createCity.mutate(form, {
        onSuccess: () => { toast.success('City created'); onClose(); },
        onError: () => toast.error('Failed to create city'),
      });
    } else {
      updateCity.mutate(
        { id: (city as City).id, data: form },
        {
          onSuccess: () => { toast.success('City updated'); onClose(); },
          onError: () => toast.error('Failed to update city'),
        }
      );
    }
  };

  return (
    <Dialog open={!!city} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'New City' : 'Edit City'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="city-name">Name</Label>
            <Input
              id="city-name"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
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

export default function CitiesPage() {
  const [dialogCity, setDialogCity] = useState<City | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<City | null>(null);
  const [page, setPage] = useState(1);

  const { data: citiesRes, isLoading } = useCitiesAdmin({ page, limit: PAGE_SIZE });
  const deleteCity = useDeleteCity();

  const cities = citiesRes?.data ?? [];
  const meta = citiesRes?.meta;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCity.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('City deleted'); setDeleteTarget(null); },
      onError: () => toast.error('Failed to delete city'),
    });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? '…' : (meta?.totalItems ?? cities.length)} cit{(meta?.totalItems ?? cities.length) !== 1 ? 'ies' : 'y'}
        </p>
        <Button onClick={() => setDialogCity('new')} className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" /> New City
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : cities.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Created</th>
                  <th className="p-4 text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="p-4 font-medium text-sm">{city.name}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                      {new Date(city.created_at).toLocaleDateString()}
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
                            onClick={() => setDialogCity(city)}
                            className="rounded-xl cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(city)}
                            className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No cities found.</p>
          <Button className="mt-4 gradient-primary" onClick={() => setDialogCity('new')}>
            <Plus className="h-4 w-4 mr-2" /> Add first city
          </Button>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />

      <CityDialog city={dialogCity} onClose={() => setDialogCity(null)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete city?</AlertDialogTitle>
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
              {deleteCity.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
