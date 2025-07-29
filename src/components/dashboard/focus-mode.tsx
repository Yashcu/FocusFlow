'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Zap } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/context/auth-context';
import { useTimer } from '@/context/timer-context';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/lib/firebase/firestore';
import { Separator } from '../ui/separator'; // --- NEW: Added Separator

interface FocusModeProps {
  className?: string;
}

export default function FocusMode({ className }: FocusModeProps) {
  const { tasks } = useAuth();
  const { isTimerActive, activeTask, isTimerSaving, startGlobalTimer } =
    useTimer();
  const { toast } = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const incompleteTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const selectedTask = useMemo(
    () => incompleteTasks.find((t) => t.id === selectedTaskId),
    [incompleteTasks, selectedTaskId]
  );

  useEffect(() => {
    if (activeTask?.id && activeTask.id !== 'general_focus') {
      setSelectedTaskId(activeTask.id);
    } else {
      setSelectedTaskId(null);
    }
  }, [activeTask]);

  const handleStartWithTask = () => {
    if (!selectedTask) {
      toast({
        title: 'No Task Selected',
        description: 'Please select a task from the dropdown to begin.',
        variant: 'destructive',
      });
      return;
    }
    startGlobalTimer(selectedTask);
  };

  // --- NEW: Handler for the Quick Start button ---
  const handleQuickStart = () => {
    startGlobalTimer(); // Call without a task
  };

  const canStartTimer = !isTimerActive && !isTimerSaving;

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Focus Mode</CardTitle>
        <CardDescription>
          Choose a task or start a general session.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-6 text-center">
        {isTimerActive ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-semibold text-primary">
              Timer is running!
            </p>
            <p className="text-sm text-muted-foreground">
              Check the header to manage it.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full max-w-xs space-y-2">
              <Select
                onValueChange={setSelectedTaskId}
                disabled={!canStartTimer || incompleteTasks.length === 0}
                value={selectedTaskId || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a task..." />
                </SelectTrigger>
                <SelectContent>
                  {incompleteTasks.length > 0 ? (
                    incompleteTasks.map((task: Task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.text}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-tasks" disabled>
                      No incomplete tasks today.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStartWithTask}
                className="w-full"
                disabled={!canStartTimer || !selectedTaskId}
              >
                <Play className="mr-2" />
                Start With Task
              </Button>
            </div>

            <div className="flex items-center w-full max-w-xs">
              <Separator className="flex-1" />
              <span className="px-4 text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="w-full max-w-xs">
              <Button
                onClick={handleQuickStart}
                variant="secondary"
                className="w-full"
                disabled={!canStartTimer}
              >
                <Zap className="mr-2" />
                Quick Start (General Focus)
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
