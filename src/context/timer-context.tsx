"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/auth-context";
import {
  addActivity,
  toggleTask as toggleTaskFS,
  Task,
} from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { formatDuration } from "@/lib/time-formatters";

interface TimerContextType {
  isTimerActive: boolean;
  timerElapsedTime: number;
  activeTask: Task | null;
  isTimerSaving: boolean;
  startGlobalTimer: (task: Task) => void;
  stopGlobalTimer: () => Promise<void>;
  resetGlobalTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, fetchCodingTimeToday, calculateStreaks, setTasks } = useAuth();
  const { toast } = useToast();

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerElapsedTime, setTimerElapsedTime] = useState(0); // in milliseconds
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTimerSaving, setIsTimerSaving] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      const startTime = Date.now() - timerElapsedTime;
      interval = setInterval(() => {
        setTimerElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerElapsedTime]);

  const startGlobalTimer = useCallback((task: Task) => {
    setActiveTask(task);
    setIsTimerActive(true);
  }, []);

  const stopGlobalTimer = useCallback(async () => {
    if (!user || !activeTask) return;

    setIsTimerActive(false);
    setIsTimerSaving(true);

    const durationInSeconds = Math.floor(timerElapsedTime / 1000);

    try {
      if (durationInSeconds > 10) {
        // Optimistic UI Update for task completion
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((task) =>
            task.id === activeTask.id ? { ...task, completed: true } : task
          )
        );

        // Save activity and mark task as complete in Firestore
        await addActivity(
          user.uid,
          durationInSeconds,
          activeTask.id,
          activeTask.text
        );
        await toggleTaskFS(user.uid, activeTask.id, true);

        // Refresh today's coding time and streak
        await fetchCodingTimeToday();
        await calculateStreaks(user.uid);

        toast({
          title: "Session Saved!",
          description: `You've logged ${formatDuration(
            durationInSeconds,
            "long"
          )} for "${activeTask.text}". Task marked as complete.`,
        });
      } else {
        toast({
          title: "Session Too Short",
          description: "Focus sessions under 10 seconds are not saved.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your focus session.",
        variant: "destructive",
      });
      console.error("Error saving focus session: ", error);
      // Revert optimistic update if firestore fails
      setTasks((prevTasks: Task[]) =>
        prevTasks.map((task) =>
          task.id === activeTask.id ? { ...task, completed: false } : task
        )
      );
    } finally {
      setTimerElapsedTime(0);
      setActiveTask(null);
      setIsTimerSaving(false);
    }
  }, [
    user,
    activeTask,
    timerElapsedTime,
    fetchCodingTimeToday,
    calculateStreaks,
    setTasks,
    toast,
  ]);

  const resetGlobalTimer = useCallback(() => {
    if (isTimerActive) {
      toast({
        title: "Timer Reset",
        description: "The session was not saved.",
      });
    }
    setIsTimerActive(false);
    setTimerElapsedTime(0);
    setActiveTask(null);
  }, [isTimerActive, toast]);

  const value = {
    isTimerActive,
    timerElapsedTime,
    activeTask,
    isTimerSaving,
    startGlobalTimer,
    stopGlobalTimer,
    resetGlobalTimer,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
