'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Building2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/Modules/projects/hooks';
import { useCitiesAdmin } from '@/Modules/cities/hooks';
import { TablePagination } from '@/components/ui/table-pagination';
import type { City } from '@/Modules/cities/types';
import type { Project, ProjectInsert } from '@/Modules/projects/types';

const PAGE_SIZE = 20;

// ─── Form Dialog ──────────────────────────────────────────────────────────────

function ProjectDialog({
  project, cities, onClose,
}: { project: Project | null | 'new'; cities: City[]; onClose: () => void }) {
  const isNew = project === 'new';
  const initial: ProjectInsert = !isNew && project
    ? { name: (project as Project).name, city_id: (project as Project).city_id, developer: (project as Project).developer, description: (project as Project).description }
    : { name: '', city_id: '', developer: '', description: '' };

  const [form, setForm] = useState<ProjectInsert>(initial);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isPending = createProject.isPending || updateProject.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city_id) return;
    if (isNew) {
      createProject.mutate(form, {
        onSuccess: () => { toast.success('Project created'); onClose(); },
        onError: () => toast.error('Failed to create project'),
      });
    } else {
      updateProject.mutate(
        { id: (project as Project).id, data: form },
        {
          onSuccess: () => { toast.success('Project updated'); onClose(); },
          onError: () => toast.error('Failed to update project'),
        }
      );
    }
  };

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'New Project' : 'Edit Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="proj-name">Name</Label>
            <Input
              id="proj-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Swan Lake"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>City</Label>
            <Select
              value={form.city_id}
              onValueChange={(v) => setForm((f) => ({ ...f, city_id: v }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="proj-dev">Developer</Label>
            <Input
              id="proj-dev"
              value={form.developer ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, developer: e.target.value }))}
              placeholder="e.g. Hassan Allam"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="proj-desc">Description</Label>
            <Textarea
              id="proj-desc"
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description…"
              rows={3}
              className="mt-1"
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

export default function ProjectsPage() {
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [dialogProject, setDialogProject] = useState<Project | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [page, setPage] = useState(1);

  const setCity = (v: string) => { setCityFilter(v); setPage(1); };

  const { data: projectsRes, isLoading } = useProjects(
    cityFilter !== 'all' ? { city_id: cityFilter, page, limit: PAGE_SIZE } : { page, limit: PAGE_SIZE }
  );
  const { data: citiesRes } = useCitiesAdmin({ limit: 100 });
  const deleteProject = useDeleteProject();

  const projects = projectsRes?.data ?? [];
  const meta = projectsRes?.meta;
  const cities: City[] = citiesRes?.data ?? [];

  const cityName = (city_id: string) => cities.find((c) => c.id === city_id)?.name ?? city_id;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProject.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('Project deleted'); setDeleteTarget(null); },
      onError: () => toast.error('Failed to delete project'),
    });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? '…' : (meta?.totalItems ?? projects.length)} project{(meta?.totalItems ?? projects.length) !== 1 ? 's' : ''}
          </p>
          <Select value={cityFilter} onValueChange={setCity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogProject('new')} className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium">City</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Developer</th>
                  <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">Description</th>
                  <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Created</th>
                  <th className="p-4 text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="p-4 font-medium text-sm">{project.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {project.city ?? cityName(project.city_id)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                      {project.developer ?? '—'}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell max-w-xs">
                      <span className="line-clamp-1">{project.description ?? '—'}</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                      {new Date(project.created_at).toLocaleDateString()}
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
                            onClick={() => setDialogProject(project)}
                            className="rounded-xl cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(project)}
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
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No projects found.</p>
          <Button className="mt-4 gradient-primary" onClick={() => setDialogProject('new')}>
            <Plus className="h-4 w-4 mr-2" /> Add first project
          </Button>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />

      <ProjectDialog project={dialogProject} cities={cities} onClose={() => setDialogProject(null)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
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
              {deleteProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
