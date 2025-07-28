"use client";

import CodingActivityChart from "@/components/dashboard/coding-activity-chart";
import DailyCodingTasks from "@/components/dashboard/daily-coding-tasks";
import DailyGoal from "@/components/dashboard/daily-goal";
import FocusMode from "@/components/dashboard/focus-mode";
import MotivationalQuoteCard from "@/components/dashboard/motivational-quote-card";
import StatCard from "@/components/dashboard/stat-card";
import { useAuth } from "@/context/auth-context";
import { Flame, Target, Zap } from "lucide-react";

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function DashboardPage() {
  const { profile, codingTimeToday, currentStreak } = useAuth();

  const dailyGoalInSeconds = (profile?.dailyGoal || 5) * 3600;
  const dailyGoalProgress =
    dailyGoalInSeconds > 0
      ? Math.round((codingTimeToday / dailyGoalInSeconds) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Coding Time Today"
          value={formatDuration(codingTimeToday)}
          icon={Zap}
          description="From focus sessions"
        />
        <StatCard
          title="Current Streak"
          value={`${currentStreak} days`}
          icon={Flame}
          description="Keep it up!"
          color="text-amber-500"
        />
        <StatCard
          title="Daily Goal"
          value={`${dailyGoalProgress}% Reached`}
          icon={Target}
          description={`${profile?.dailyGoal || 5}h goal`}
        />
      </div>

      <MotivationalQuoteCard />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <FocusMode />
        <DailyCodingTasks />
        <CodingActivityChart />
        <DailyGoal />
      </div>
    </div>
  );
}
