import React, { useCallback, useMemo, useState } from "react";
import MetricCard from "./components/MetricCard";
import ProductivityTrendChart from "./components/ProductivityTrendChart";
import TagTimeBreakdown from "./components/TagTimeBreakdown";
import TaskManager from "./components/TaskManager";
import TodaysTasks from "./components/TodaysTasks";
import { useAuth } from "../../contexts/AuthContext";
import useTypingEffect from "../../hooks/useTypingEffect";

const Dashboard = () => {
  const { user } = useAuth?.() || { user: { name: "User" } };
  const hour = new Date().getHours();
  const bucket = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const greeting = useTypingEffect(`${bucket}, ${user?.name || "there"} 👋`, 25);

  // These are placeholders (keep your existing source of truth if you had)
  const metrics = useMemo(
    () => [
      { label: "Total Tasks", value: 12, icon: "ListTodo", color: "from-blue-500 to-indigo-500" },
      { label: "Completed", value: 8, icon: "CheckCircle2", color: "from-emerald-500 to-teal-500" },
      { label: "Pending", value: 4, icon: "BarChart3", color: "from-yellow-500 to-amber-500" },
      { label: "Focus Hours", value: "5h 30m", icon: "Timer", color: "from-violet-500 to-fuchsia-500" },
    ],
    []
  );

  // lift updates from Task components if you want metrics to react later
  const [allTasks, setAllTasks] = useState([]);
  const handleTasksChange = useCallback((tasks) => setAllTasks(tasks), []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top greeting section – less white space */}
      <section className="flex items-end justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{greeting}</h1>
          <p className="text-sm text-muted-foreground">
            Your productivity overview. Plan tasks and track focus time.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </section>

      {/* Task planner + today's tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskManager onTasksChange={handleTasksChange} />
        <TodaysTasks onTasksChange={handleTasksChange} />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Focus Time Trend</h2>
          <ProductivityTrendChart />
        </div>
        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Tag Time Breakdown</h2>
          <TagTimeBreakdown />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
