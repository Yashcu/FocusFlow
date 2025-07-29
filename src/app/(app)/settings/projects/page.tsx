'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/auth-context';
import {
  addProject,
  getProjects,
  Project,
  updateProject,
  deleteProject,
} from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // For description
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Tag, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const colorPalette = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
];

export default function ProjectSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for the new project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: colorPalette[0],
  });
  // State for the project being edited
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getProjects(user.uid)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newProject.name.trim()) return;
    setIsSubmitting(true);
    try {
      const added = await addProject(
        user.uid,
        newProject.name,
        newProject.color,
        newProject.description
      );
      setProjects((prev) => [...prev, added]);
      setNewProject({ name: '', description: '', color: colorPalette[0] });
      toast({
        title: 'Project Added!',
        description: `"${added.name}" has been created.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add project.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!user || !editingProject) return;
    setIsSubmitting(true);
    try {
      await updateProject(user.uid, editingProject.id, {
        name: editingProject.name,
        description: editingProject.description,
        color: editingProject.color,
      });
      setProjects(
        projects.map((p) => (p.id === editingProject.id ? editingProject : p))
      );
      toast({ title: 'Project Updated!' });
      setEditingProject(null); // Close modal on success
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not update project.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!user) return;
    try {
      await deleteProject(user.uid, projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
      toast({ title: 'Project Deleted.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not delete project.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid gap-6">
      {/* --- Add Project Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., LeetCode Grind"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-desc">Description (Optional)</Label>
                <Input
                  id="project-desc"
                  placeholder="e.g., Daily practice problems"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker
                selectedColor={newProject.color}
                onSelectColor={(color) =>
                  setNewProject((p) => ({ ...p, color }))
                }
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Project
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- Project List Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ProjectListSkeleton />
          ) : projects.length > 0 ? (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center gap-3 p-2 border rounded-md"
                >
                  <div
                    className="p-2 rounded-md"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <Tag className="h-5 w-5" style={{ color: project.color }} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* --- Edit and Delete Buttons --- */}
                  <Dialog
                    onOpenChange={(open) => !open && setEditingProject(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{project.name}"
                          project. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              You haven't added any projects yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* --- Edit Project Modal --- */}
      <Dialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-project-name">Project Name</Label>
                <Input
                  id="edit-project-name"
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-project-desc">
                  Description (Optional)
                </Label>
                <Textarea
                  id="edit-project-desc"
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <ColorPicker
                  selectedColor={editingProject.color}
                  onSelectColor={(color) =>
                    setEditingProject({ ...editingProject, color })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateProject} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Reusable Sub-components ---

const ColorPicker = ({
  selectedColor,
  onSelectColor,
}: {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 p-1 border rounded-md">
    {colorPalette.map((color) => (
      <button
        type="button"
        key={color}
        className="h-8 w-8 rounded-full transition-transform hover:scale-110"
        style={{ backgroundColor: color }}
        onClick={() => onSelectColor(color)}
        aria-label={`Select color ${color}`}
      >
        {selectedColor === color && (
          <div className="h-full w-full rounded-full border-2 border-background ring-2 ring-offset-2 ring-ring" />
        )}
      </button>
    ))}
  </div>
);

const ProjectListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);
