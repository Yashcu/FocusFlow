'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, startOfDay, subDays, isSameDay } from 'date-fns';
import {
  Clock,
  Code,
  CheckCircle,
  XIcon,
  Search,
  CalendarIcon,
  History,
  Flame,
  Award,
  CalendarDays,
  Moon,
  Sun,
  LucideIcon,
} from 'lucide-react';

import StatCard from '@/components/dashboard/stat-card';
import { TooltipProps } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '@/context/auth-context';
import { getActivity, Activity, UserProfile } from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarCard } from '@/components/ui/calendar-card';
import { formatDuration } from '@/utils/time-formatters';

// Types
type AnalyticsStats = {
  avgDailyCoding: string;
  totalCodingHours: string;
  weeklyCodingData: WeeklyCodingDataItem[];
  activityDayModifiers: { active: Date[] };
};

type TaskAnalyticsDataItem = {
  name: string;
  displayName: string;
  total: number;
};

type WeeklyCodingDataItem = {
  day: string;
  durationInSeconds: number;
};

// Custom hooks for analytics logic
const useAnalyticsData = (userId: string | undefined) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const activities = await getActivity(userId);

        // Process analytics data
        const totalSeconds = activities.reduce(
          (sum, activity) => sum + activity.durationInSeconds,
          0
        );
        const totalCodingHours = formatDuration(totalSeconds);

        const avgDailySeconds =
          activities.length > 0 ? totalSeconds / activities.length : 0;
        const avgDailyCoding = formatDuration(avgDailySeconds);

        // Get last 7 days data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), i);
          const dayActivities = activities.filter((activity) =>
            isSameDay(activity.createdAt.toDate(), date)
          );
          const dayTotal = dayActivities.reduce(
            (sum, activity) => sum + activity.durationInSeconds,
            0
          );

          return {
            day: format(date, 'EEE'),
            durationInSeconds: dayTotal,
          };
        }).reverse();

        // Get active days for calendar
        const activeDays = activities.map((activity) =>
          startOfDay(activity.createdAt.toDate())
        );
        const uniqueActiveDays = Array.from(
          new Set(activeDays.map((date) => date.getTime()))
        ).map((time) => new Date(time));

        setAnalyticsData({
          avgDailyCoding,
          totalCodingHours,
          weeklyCodingData: last7Days,
          activityDayModifiers: { active: uniqueActiveDays },
        });
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [userId]);

  return { analyticsData, loading, error };
};

// Stats Cards Component
const StatsSection = React.memo<{
  currentStreak: number;
  longestStreak: number;
  analyticsData: AnalyticsStats | null;
}>(({ currentStreak, longestStreak, analyticsData }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCard
      title="Current Streak"
      value={`${currentStreak || 0} days`}
      icon={Flame}
      description="You're on fire!"
      color="text-amber-500"
    />
    <StatCard
      title="Longest Streak"
      value={`${longestStreak || 0} days`}
      icon={Award}
      description="Keep pushing the limits"
    />
    <StatCard
      title="Total Coding Hours"
      value={analyticsData?.totalCodingHours || '0m'}
      icon={Code}
      description="All time tracked"
    />
    <StatCard
      title="Avg. Daily Coding"
      value={analyticsData?.avgDailyCoding || '0m'}
      icon={Clock}
      description="Avg over all time"
    />
  </div>
));

// Task Chart Component
const TaskChartCard = React.memo<{
  data: TaskAnalyticsDataItem[];
  selectedDate: Date | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>(({ data, selectedDate, searchQuery, setSearchQuery }) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>
        {selectedDate
          ? `Tasks on ${format(selectedDate, 'MMM dd, yyyy')}`
          : 'Task Overview'}
      </CardTitle>
      <CardDescription>
        {selectedDate
          ? 'Focus sessions for the selected day'
          : 'Search and filter tasks'}
      </CardDescription>
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <ChartContainer
          config={{
            total: {
              label: 'Duration',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="displayName"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Math.round(value / 60)}m`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: any) => [formatDuration(value), 'Duration']}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">
            {selectedDate ? 'No Activity Logged' : 'Select a Day'}
          </h3>
          <p className="text-muted-foreground">
            {selectedDate
              ? 'There were no focus sessions on this day.'
              : 'Click a date on the calendar to see details.'}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
));

export default function AnalyticsPage() {
  const { profile, currentStreak, longestStreak } = useAuth();
  const { analyticsData, loading, error } = useAnalyticsData(profile?.uid);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTaskAnalytics, setFilteredTaskAnalytics] = useState<
    TaskAnalyticsDataItem[]
  >([]);

  const creationDate = useMemo(
    () => (profile?.createdAt ? profile.createdAt.toDate() : undefined),
    [profile?.createdAt]
  );

  // Filter task analytics based on selected date and search query
  useEffect(() => {
    const processTaskAnalytics = async () => {
      if (!profile?.uid) return;

      try {
        const activities = await getActivity(profile.uid);
        let filteredActivities = activities;

        if (selectedDate) {
          filteredActivities = activities.filter((activity) =>
            isSameDay(activity.createdAt.toDate(), selectedDate)
          );
        }

        const taskMap = new Map<string, number>();
        filteredActivities.forEach((activity) => {
          const taskName = activity.taskName || 'General Focus';
          const current = taskMap.get(taskName) || 0;
          taskMap.set(taskName, current + activity.durationInSeconds);
        });

        let taskAnalytics = Array.from(taskMap.entries()).map(
          ([name, total]) => ({
            name,
            displayName:
              name.length > 20 ? `${name.substring(0, 20)}...` : name,
            total,
          })
        );

        if (searchQuery) {
          taskAnalytics = taskAnalytics.filter((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        taskAnalytics.sort((a, b) => b.total - a.total);
        setFilteredTaskAnalytics(taskAnalytics);
      } catch (err) {
        console.error('Error processing task analytics:', err);
        setFilteredTaskAnalytics([]);
      }
    };

    processTaskAnalytics();
  }, [profile?.uid, selectedDate, searchQuery]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <StatsSection
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        analyticsData={analyticsData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TaskChartCard
          data={filteredTaskAnalytics}
          selectedDate={selectedDate}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
        />
        <CalendarCard
          selectedDate={selectedDate}
          setSelectedDate={handleDateSelect}
          creationDate={creationDate}
          modifiers={analyticsData?.activityDayModifiers}
        />
      </div>
    </div>
  );
}
