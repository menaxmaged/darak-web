'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/Modules/projects/hooks';
import { useCities } from '@/Modules/areas/hooks';
import { TablePagination } from '@/components/ui/table-pagination';
import type { Project, ProjectInsert } from '@/Modules/projects/types';

const PAGE_SIZE = 20;

// ─── Form Dialog ──────────────────────────────────────────────────────────────

const EMPTY: ProjectInsert = { name: '', city: '', developer: '', description: '' };

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null | 'new';
  onClose: () => void;
}) {
  const isNew = project === 'new';
  const initial: ProjectInsert = isNew
    ? EMPTY
    : { name: project?.name ?? '', city: project?.city ?? '', developer: project?.developer ?? '', description: project?.description ?? '' };

  const [form, setForm] = useState<ProjectInsert>(initial);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isPending = createProject.isPending || updateProject.isPending;

  const set = (key: keyof ProjectInsert) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;

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
            <Input id="proj-name" value={form.name} onChange={set('name')} placeholder="e.g. Swan Lake" className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="proj-city">City</Label>
            <Input id="proj-city" value={form.city} onChange={set('city')} placeholder="e.g. Cairo" className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="proj-dev">Developer</Label>
            <Input id="proj-dev" value={form.developer ?? ''} onChange={set('developer')} placeholder="e.g. Hassan Allam" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="proj-desc">Description</Label>
            <Textarea id="proj-desc" value={form.description ?? ''} onChange={set('description')} placeholder="Short description…" rows={3} className="mt-1" />
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
    cityFilter !== 'all' ? { city: cityFilter, page, limit: PAGE_SIZE } : { page, limit: PAGE_SIZE }
  );
  const { data: citiesRes } = useCities();
  const deleteProject = useDeleteProject();

  const projects = projectsRes?.data ?? [];
  const meta = projectsRes?.meta;
  const cities: string[] = (citiesRes as { data?: string[] } | undefined)?.data ?? [];

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
                <SelectItem key={c} value={c}>{c}</SelectItem>
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
                    <td className="p-4 text-sm text-muted-foreground">{project.city}</td>
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
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setDialogProject(project)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(project)}
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
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-xl">
          <p className="text-muted-foreground">No projects found.</p>
          <Button className="mt-4 gradient-primary" onClick={() => setDialogProject('new')}>
            <Plus className="h-4 w-4 mr-2" /> Add first project
          </Button>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />

      <ProjectDialog project={dialogProject} onClose={() => setDialogProject(null)} />

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
