"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useTimer } from "@/context/timer-context";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FocusModeProps {
  className?: string;
}

export default function FocusMode({ className }: FocusModeProps) {
  const { user, tasks } = useAuth();

  const { isTimerActive, activeTask, isTimerSaving, startGlobalTimer } =
    useTimer();

  const { toast } = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const incompleteTasks = tasks.filter((task) => !task.completed);

  // Sync local selection with global state if it exists
  useMemo(() => {
    if (activeTask) {
      setSelectedTaskId(activeTask.id);
    }
  }, [activeTask]);

  const selectedTask = useMemo(
    () => incompleteTasks.find((t) => t.id === selectedTaskId),
    [incompleteTasks, selectedTaskId]
  );

  const handleStart = () => {
    if (!selectedTask) {
      toast({
        title: "No Task Selected",
        description: "Please select a task to focus on.",
        variant: "destructive",
      });
      return;
    }
    startGlobalTimer(selectedTask);
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Focus Mode</CardTitle>
        <CardDescription>
          Select a task and start the global timer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-xs">
          <Select
            onValueChange={(value) => {
              if (!isTimerActive) setSelectedTaskId(value);
            }}
            disabled={isTimerActive || !incompleteTasks.length}
            value={selectedTaskId || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a task to begin..." />
            </SelectTrigger>
            <SelectContent>
              {incompleteTasks.length > 0 ? (
                incompleteTasks.map((task) => (
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
        </div>

        <div className="relative flex items-center justify-center w-[240px] h-[100px]">
          {isTimerActive ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-primary">
                Timer is running!
              </p>
              <p className="text-sm text-muted-foreground">
                Check the header to manage it.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold">Ready to Focus?</p>
              <p className="text-sm text-muted-foreground">
                Select a task and hit start.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleStart}
            size="lg"
            className="w-48"
            disabled={
              isTimerActive || isTimerSaving || !user || !selectedTaskId
            }
          >
            {isTimerSaving ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Play className="mr-2" />
            )}
            {isTimerActive ? "Session in Progress" : "Start Focus Session"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
