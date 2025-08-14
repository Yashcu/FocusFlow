import React, { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import { useStopwatch } from "../../../contexts/StopwatchContext";

const LS_TASKS = "ff.tasks";
const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const TodaysTasks = ({ onTasksChange }) => {
  const [tasks, setTasks] = useState(() => readLS(LS_TASKS, []));
  const { start, activeTask, isRunning } = useStopwatch();

  useEffect(() => {
    writeLS(LS_TASKS, tasks);
    onTasksChange?.(tasks);
  }, [tasks, onTasksChange]);

  // Derived: today’s only
  const todays = useMemo(() => tasks.filter((t) => t.date === todayISO()), [tasks]);

  const setComplete = (id) => {
    // requirement: cannot complete unless task has been started (was active once)
    const found = tasks.find((t) => t.id === id);
    if (!found?.wasStarted) return; // guard
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
  };

  const startTask = (t) => {
    // Mark wasStarted=true so it can be completed later
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, wasStarted: true } : x)));
    start({ id: t.id, title: t.title, tag: t.tag, date: t.date });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-semibold">Today&apos;s Tasks</h2>
        <span className="text-xs text-muted-foreground">
          Select and start a task to run the navbar timer
        </span>
      </div>

      {todays.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks scheduled for today. Add tasks in Task Manager.
        </p>
      ) : (
        <ul className="space-y-2">
          {todays.map((t) => {
            const active = activeTask?.id === t.id;
            return (
              <li
                key={t.id}
                className="border border-border rounded-lg px-3 py-2 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {t.title}{" "}
                    {t.tag ? (
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground align-middle">
                        #{t.tag}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status:{" "}
                    <span className="font-medium">
                      {t.status === "completed"
                        ? "Completed"
                        : t.wasStarted
                        ? "In progress"
                        : "Todo"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={active ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => startTask(t)}
                  >
                    {active && isRunning ? "Running…" : "Start"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!t.wasStarted || t.status === "completed"}
                    onClick={() => setComplete(t.id)}
                  >
                    Complete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TodaysTasks;
