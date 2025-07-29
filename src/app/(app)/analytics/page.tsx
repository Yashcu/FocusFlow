'use client';

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
import { useAuth } from '@/context/auth-context';
import { getActivity, Activity } from '@/lib/firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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
} from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { format, startOfDay, subDays, isSameDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { formatDuration } from '@/utils/time-formatters';

const allAchievements = [
  {
    id: '1-day',
    title: 'First Step',
    description: 'Completed your first day.',
    icon: Sun,
  },
  {
    id: '7-day',
    title: 'Week of Fire',
    description: 'Maintained a 7-day streak.',
    icon: Flame,
  },
  {
    id: '14-day',
    title: 'Two-Week Tenacity',
    description: 'Kept the flame alive for 14 days.',
    icon: Award,
  },
  {
    id: '30-day',
    title: 'Month of Consistency',
    description: 'Completed a 30-day streak.',
    icon: CalendarDays,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Coded past midnight.',
    icon: Moon,
    isLocked: true,
  },
];

const SimpleTooltipContent = (props: TooltipProps<number, string>) => {
  // Recharts provides the 'active' prop to determine if the tooltip should be visible
  if (props.active && props.payload && props.payload.length) {
    return (
      <ChartTooltipContent
        {...props}
        formatter={(value) => {
          if (typeof value === 'number') {
            return formatDuration(value);
          }
          return value;
        }}
      />
    );
  }
  return null;
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

type ChartDataItem = TaskAnalyticsDataItem | WeeklyCodingDataItem;

export default function AnalyticsPage() {
  const { user, currentStreak, longestStreak } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<{
    avgDailyCoding: string;
    totalCodingHours: string;
  }>({
    avgDailyCoding: '',
    totalCodingHours: '',
  });
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const creationDate = useMemo(() => {
    if (user?.metadata.creationTime) {
      return new Date(user.metadata.creationTime);
    }
    return undefined;
  }, [user]);

  const setSearchQuery = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.replace(`/analytics?${params.toString()}`);
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const activities = await getActivity(user.uid, 365);
      setAllActivities(activities);

      const dayMap = new Map<string, number>();
      activities.forEach((act) => {
        const dayKey = format(startOfDay(act.date.toDate()), 'yyyy-MM-dd');
        dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + act.duration);
      });

      // Stats
      const totalSeconds = activities.reduce(
        (sum, act) => sum + act.duration,
        0
      );
      const avgDailySeconds = dayMap.size > 0 ? totalSeconds / dayMap.size : 0;

      setStats({
        avgDailyCoding: formatDuration(avgDailySeconds),
        totalCodingHours: formatDuration(totalSeconds),
      });

      setLoading(false);
    };
    fetchAnalyticsData();
  }, [user]);

  const taskAnalytics = useMemo(() => {
    if (!selectedDate) return [];

    const dailyActivities = allActivities.filter((act) =>
      isSameDay(act.date.toDate(), selectedDate)
    );

    const taskMap = new Map<string, number>();
    dailyActivities
      .filter((act) => act.taskText)
      .forEach((act) => {
        taskMap.set(
          act.taskText!,
          (taskMap.get(act.taskText!) || 0) + act.duration
        );
      });

    return Array.from(taskMap.entries())
      .map(([name, duration]) => ({
        name: name,
        displayName: name.length > 20 ? `${name.substring(0, 20)}...` : name,
        total: duration,
      }))
      .sort((a, b) => b.total - a.total);
  }, [allActivities, selectedDate]);

  const filteredTaskAnalytics = useMemo(() => {
    if (!taskAnalytics) return [];
    if (!searchQuery) return taskAnalytics;

    return taskAnalytics.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [taskAnalytics, searchQuery]);

  const weeklyCodingData = useMemo(() => {
    const today = startOfDay(new Date());
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(today, 6 - i)
    );

    const weeklyMap = new Map<string, number>();
    last7Days.forEach((day) => {
      weeklyMap.set(format(day, 'EEE'), 0);
    });

    allActivities.forEach((act) => {
      const activityDay = startOfDay(act.date.toDate());
      const isWithinLast7Days = last7Days.some((d) =>
        isSameDay(d, activityDay)
      );

      if (isWithinLast7Days) {
        const dayKey = format(activityDay, 'EEE');
        weeklyMap.set(dayKey, (weeklyMap.get(dayKey) || 0) + act.duration);
      }
    });

    return Array.from(weeklyMap.entries()).map(([day, duration]) => ({
      day,
      durationInSeconds: duration,
    }));
  }, [allActivities]);

  const selectedDayActivities = useMemo(() => {
    if (!selectedDate) return [];
    return allActivities
      .filter((act) => isSameDay(act.date.toDate(), selectedDate))
      .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
  }, [allActivities, selectedDate]);

  const activityDayModifiers = useMemo(() => {
    const activeDays = allActivities.map((act) =>
      startOfDay(act.date.toDate())
    );
    return {
      active: activeDays,
    };
  }, [allActivities]);

  const unlockedAchievements = useMemo(() => {
    return allAchievements.filter((ach) => {
      if (ach.isLocked) return false;
      if (loading) return false;
      switch (ach.id) {
        case '1-day':
          return longestStreak >= 1;
        case '7-day':
          return longestStreak >= 7;
        case '14-day':
          return longestStreak >= 14;
        case '30-day':
          return longestStreak >= 30;
        default:
          return false;
      }
    });
  }, [longestStreak, loading]);

  const lockedAchievements = useMemo(() => {
    return allAchievements.filter(
      (ach) => !unlockedAchievements.some((unlocked) => unlocked.id === ach.id)
    );
  }, [unlockedAchievements]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[126px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Skeleton className="h-[520px]" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  const customTooltipFormatter = (value: number) => {
    return formatDuration(value);
  };

  const chartTooltipContent = (props: TooltipProps<number, string>) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    const data = payload[0]?.payload as ChartDataItem | undefined;

    if (!data) return null;

    const tooltipLabel =
      (data as TaskAnalyticsDataItem).name ||
      (data as WeeklyCodingDataItem).day;

    return (
      <ChartTooltipContent
        {...props}
        label={tooltipLabel}
        formatter={(value) => {
          if (typeof value === 'number') {
            return formatDuration(value);
          }
          return value;
        }}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
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
          value={stats.totalCodingHours || '0m'}
          icon={Code}
          description="All time tracked"
        />
        <StatCard
          title="Avg. Daily Coding"
          value={stats.avgDailyCoding || '0m'}
          icon={Clock}
          description="Avg over all time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-grow">
                <CardTitle>Time Spent Per Task</CardTitle>
                <CardDescription>
                  {selectedDate
                    ? `Your coding hours for tasks on ${format(
                        selectedDate,
                        'PPP'
                      )}.`
                    : 'Select a day to see tasks.'}
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-8 sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery('')}
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            {filteredTaskAnalytics && filteredTaskAnalytics.length > 0 ? (
              <ChartContainer className="h-full w-full" config={{}}>
                <BarChart
                  data={filteredTaskAnalytics}
                  layout="vertical"
                  margin={{ top: 5, right: 30, bottom: 5, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    dataKey="total"
                    tickFormatter={customTooltipFormatter}
                  />
                  <YAxis
                    dataKey="displayName"
                    type="category"
                    width={100}
                    interval={0}
                  />
                  <ChartTooltip
                    content={chartTooltipContent}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={15}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  {searchQuery
                    ? 'No Matching Tasks Found'
                    : 'No Task Data For This Day'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Your search for "${searchQuery}" did not return any results.`
                    : 'Either no tasks were logged on this day, or you were in a general focus session.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>
                Select a day to see your activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={creationDate ? { before: creationDate } : undefined}
                modifiers={activityDayModifiers}
                modifiersClassNames={{
                  active: 'bg-primary/20 rounded-full',
                  selected: 'bg-primary text-primary-foreground rounded-full',
                  today: 'border-2 border-primary rounded-full',
                }}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Log</CardTitle>
            <CardDescription>
              {selectedDate
                ? `Focus sessions for ${format(selectedDate, 'PPP')}`
                : 'Select a day to see activity'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-y-auto">
            {selectedDayActivities.length > 0 ? (
              <ul className="space-y-4">
                {selectedDayActivities.map((activity) => (
                  <li key={activity.id} className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p
                        className="font-semibold text-sm truncate"
                        title={activity.taskText}
                      >
                        {activity.taskText || 'General Focus'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(activity.date.toDate(), 'p')}
                      </p>
                    </div>
                    <div className="font-semibold text-sm tabular-nums">
                      {formatDuration(activity.duration, 'long')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  {selectedDate ? 'No Activity Logged' : 'Select a Day'}
                </h3>
                <p className="text-muted-foreground">
                  {selectedDate
                    ? `There were no focus sessions on this day.`
                    : 'Click a date on the calendar to see details.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coding Time This Week</CardTitle>
            <CardDescription>
              Your coding hours for the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px] w-full" config={{}}>
              <BarChart
                data={weeklyCodingData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="durationInSeconds"
                  tickFormatter={customTooltipFormatter}
                  allowDecimals={false}
                />
                <ChartTooltip
                  content={<SimpleTooltipContent />}
                  cursor={{ fill: 'hsl(var(--muted))' }}
                />

                <Bar
                  dataKey="durationInSeconds"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Milestones based on your journey.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-y-auto">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                {unlockedAchievements.map((ach) => (
                  <li key={ach.id} className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <ach.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{ach.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {ach.description}
                      </p>
                    </div>
                  </li>
                ))}
                {lockedAchievements.map((ach) => (
                  <li
                    key={ach.id}
                    className="flex items-center gap-4 opacity-50"
                  >
                    <div className="p-2 bg-muted rounded-md">
                      <ach.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{ach.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {ach.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
