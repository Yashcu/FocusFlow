'use client';

import { useState, FormEvent, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '../ui/skeleton';

interface DailyCodingTasksProps {
  className?: string;
}

export default function DailyCodingTasks({ className }: DailyCodingTasksProps) {
  const { user, tasks, loadingTasks, addTask, toggleTask, deleteTask } =
    useAuth();
  const [newTask, setNewTask] = useState('');

  // --- REFACTORED: Added explicit type for the form event ---
  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() === '' || !user) return;

    try {
      await addTask(newTask);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      // Optionally, show a toast notification on error
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    if (!user) return;
    try {
      await toggleTask(id, completed);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // --- REFACTORED: Wrapped in useCallback for performance ---
  // This prevents the function from being recreated on every render unless its dependencies change.
  const handleDeleteTask = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    [deleteTask, user] // Dependency array ensures the function is stable
  );

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Today's Coding Tasks</CardTitle>
        <CardDescription>
          Add and track your coding questions for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="e.g., Solve 'Two Sum' on LeetCode"
            disabled={!user || loadingTasks}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Add task"
            disabled={!user || loadingTasks || !newTask.trim()}
          >
            <Plus />
          </Button>
        </form>

        <ScrollArea className="flex-grow h-[200px] pr-4">
          {loadingTasks ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 group">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleToggleTask(task.id, !!checked)
                    }
                    aria-label={`Mark task "${task.text}" as ${
                      task.completed ? 'incomplete' : 'complete'
                    }`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      'flex-grow text-sm cursor-pointer',
                      task.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {task.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteTask(task.id)}
                    title={`Delete task: ${task.text}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No tasks yet. Add one to get started!
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
