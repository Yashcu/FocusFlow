'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from '@/context/auth-context';
import {
  addActivity,
  toggleTask as toggleTaskFS,
  Task,
} from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { formatDuration } from '@/utils/time-formatters';

const MIN_SESSION_DURATION_SECONDS = 10;
const TIMER_INTERVAL_MS = 50;

interface TimerContextType {
  isTimerActive: boolean;
  timerElapsedTime: number;
  activeTask: Partial<Task> | null;
  isTimerSaving: boolean;
  startGlobalTimer: (task?: Partial<Task>) => void;
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
  const [timerElapsedTime, setTimerElapsedTime] = useState(0);
  const [activeTask, setActiveTask] = useState<Partial<Task> | null>(null);
  const [isTimerSaving, setIsTimerSaving] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      const startTime = Date.now() - timerElapsedTime;
      interval = setInterval(() => {
        setTimerElapsedTime(Date.now() - startTime);
      }, TIMER_INTERVAL_MS);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerActive]);

  const startGlobalTimer = useCallback((task?: Partial<Task>) => {
    if (task) {
      setActiveTask(task);
    } else {
      setActiveTask({ id: 'general_focus', text: 'General Focus' });
    }
    setIsTimerActive(true);
  }, []);

  const stopGlobalTimer = useCallback(async () => {
    if (!user || !activeTask) return;

    setIsTimerActive(false);
    setIsTimerSaving(true);

    const durationInSeconds = Math.floor(timerElapsedTime / 1000);
    const isGeneralFocus = activeTask.id === 'general_focus';

    try {
      if (durationInSeconds > MIN_SESSION_DURATION_SECONDS) {
        if (!isGeneralFocus && activeTask.id) {
          setTasks((prevTasks: Task[]) =>
            prevTasks.map((task) =>
              task.id === activeTask.id ? { ...task, completed: true } : task
            )
          );
          await toggleTaskFS(user.uid, activeTask.id, true);
        }

        await addActivity(
          user.uid,
          durationInSeconds,
          isGeneralFocus ? undefined : activeTask.id,
          activeTask.text
        );

        await fetchCodingTimeToday();
        await calculateStreaks(user.uid);

        toast({
          title: 'Session Saved!',
          description: `You've logged ${formatDuration(
            durationInSeconds,
            'long'
          )} for "${activeTask.text}".`,
        });
      } else {
        toast({
          title: 'Session Too Short',
          description: `Focus sessions under ${MIN_SESSION_DURATION_SECONDS} seconds are not saved.`,
        });
      }
    } catch (err) {
      console.error('Error saving session:', err);

      if (!isGeneralFocus && activeTask.id) {
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((task) =>
            task.id === activeTask.id ? { ...task, completed: false } : task
          )
        );
      }
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
        title: 'Timer Reset',
        description: 'The session was not saved.',
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
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
