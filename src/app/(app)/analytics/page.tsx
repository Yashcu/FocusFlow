'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  format,
  startOfDay,
  subDays,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import {
  Clock,
  Code,
  Search,
  CalendarIcon,
  Flame,
  Award,
  TrendingUp,
  Activity,
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import StatCard from '@/components/dashboard/stat-card';
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/auth-context';
import {
  getActivity,
  Activity as ActivityType,
} from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDuration } from '@/utils/time-formatters';
import { cn } from '@/utils/utils';

// Types
type AnalyticsStats = {
  avgDailyCoding: string;
  totalCodingHours: string;
  weeklyCodingData: WeeklyCodingDataItem[];
  monthlyCodingData: MonthlyCodingDataItem[];
  activityDays: Date[];
  totalSessions: number;
  longestSession: string;
};

type TaskAnalyticsDataItem = {
  name: string;
  displayName: string;
  total: number;
  sessions: number;
};

type WeeklyCodingDataItem = {
  day: string;
  durationInSeconds: number;
  sessions: number;
};

type MonthlyCodingDataItem = {
  date: string;
  durationInSeconds: number;
  sessions: number;
};

// Helper function to safely get date from activity
const getActivityDate = (activity: ActivityType): Date => {
  if (activity.createdAt && typeof activity.createdAt.toDate === 'function') {
    return activity.createdAt.toDate();
  }
  if (activity.date && typeof activity.date.toDate === 'function') {
    return activity.date.toDate();
  }
  console.warn('Activity missing proper timestamp:', activity);
  return new Date();
};

// Custom Calendar Component
const CustomCalendar: React.FC<{
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  activityDays: Date[];
  activityData: { [key: string]: { duration: number; sessions: number } };
  userCreationDate?: Date;
  currentStreak: number;
}> = ({
  selectedDate,
  setSelectedDate,
  activityDays,
  activityData,
  userCreationDate,
  currentStreak,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add days from previous month to fill the grid
  const startDate = new Date(monthStart);
  const startDay = startDate.getDay();
  for (let i = 0; i < startDay; i++) {
    startDate.setDate(startDate.getDate() - 1);
    monthDays.unshift(new Date(startDate));
  }

  // Add days from next month to fill the grid
  const endDate = new Date(monthEnd);
  const endDay = endDate.getDay();
  for (let i = endDay; i < 6; i++) {
    endDate.setDate(endDate.getDate() + 1);
    monthDays.push(new Date(endDate));
  }

  const hasActivity = (date: Date) => {
    return activityDays.some((activityDay) => isSameDay(activityDay, date));
  };

  const getActivityLevel = (date: Date): 'none' | 'low' | 'medium' | 'high' => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = activityData[dateKey];
    if (!dayData) return 'none';

    const hours = dayData.duration / 3600;
    if (hours >= 4) return 'high';
    if (hours >= 2) return 'medium';
    if (hours > 0) return 'low';
    return 'none';
  };

  const isDateDisabled = (date: Date) => {
    // If user has a creation date, disable dates BEFORE registration
    if (userCreationDate) {
      return startOfDay(date) < startOfDay(userCreationDate);
    }
    // If no creation date, don't disable any dates
    return false;
  };

  const shouldShowFireEmoji = (date: Date) => {
    // Only show fire emoji if the date has activity and is not disabled
    return hasActivity(date) && !isDateDisabled(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((date) => {
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isCurrentDay = isToday(date);
            const activityLevel = getActivityLevel(date);
            const dateKey = format(date, 'yyyy-MM-dd');
            const dayData = activityData[dateKey];
            const isDisabled = isDateDisabled(date);
            const showFire = shouldShowFireEmoji(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() =>
                  !isDisabled && setSelectedDate(isSelected ? undefined : date)
                }
                disabled={isDisabled}
                className={cn(
                  'h-10 w-10 p-0 text-sm font-medium rounded-md transition-all duration-200',
                  'flex items-center justify-center relative',
                  // Base styles
                  isCurrentMonth
                    ? 'text-foreground'
                    : 'text-muted-foreground/50',
                  // Disabled styling (before registration)
                  isDisabled &&
                    'opacity-30 cursor-not-allowed bg-muted/30 text-muted-foreground/30',
                  // Enabled hover effects
                  !isDisabled &&
                    'hover:scale-105 hover:bg-accent hover:text-accent-foreground',
                  // Today styling
                  isCurrentDay &&
                    !isDisabled &&
                    'ring-2 ring-blue-500 ring-offset-1 font-bold',
                  // Selected styling
                  isSelected &&
                    !isDisabled &&
                    'bg-primary text-primary-foreground shadow-md',
                  // Activity levels (only for enabled dates)
                  !isSelected &&
                    !isDisabled &&
                    activityLevel === 'low' &&
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
                  !isSelected &&
                    !isDisabled &&
                    activityLevel === 'medium' &&
                    'bg-green-200 dark:bg-green-800/50 text-green-900 dark:text-green-100',
                  !isSelected &&
                    !isDisabled &&
                    activityLevel === 'high' &&
                    'bg-green-300 dark:bg-green-700/70 text-green-900 dark:text-white',
                  // Non-current month styling
                  !isCurrentMonth && 'opacity-50'
                )}
              >
                <span className="relative z-10">{format(date, 'd')}</span>

                {/* Fire Emoji at bottom-right corner, positioned outside the date number */}
                {showFire && (
                  <span
                    className="absolute bottom-0 right-0 text-xs animate-pulse z-20"
                    style={{
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: '2s',
                      transform: 'translate(2px, 2px)', // Move it slightly outside
                    }}
                  >
                    🔥
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="text-sm">🔥</span>
          <span>Activity Day</span>
        </div>
      </div>
    </div>
  );
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
        const validActivities = activities.filter((activity) => {
          return (
            (activity.createdAt &&
              typeof activity.createdAt.toDate === 'function') ||
            (activity.date && typeof activity.date.toDate === 'function')
          );
        });

        // Calculate totals
        const totalSeconds = validActivities.reduce(
          (sum, activity) =>
            sum + (activity.durationInSeconds || activity.duration || 0),
          0
        );
        const totalCodingHours = formatDuration(totalSeconds);
        const totalSessions = validActivities.length;

        // Find longest session
        const longestSessionSeconds = Math.max(
          ...validActivities.map((a) => a.durationInSeconds || a.duration || 0),
          0
        );
        const longestSession = formatDuration(longestSessionSeconds);

        const avgDailySeconds =
          validActivities.length > 0
            ? totalSeconds / validActivities.length
            : 0;
        const avgDailyCoding = formatDuration(avgDailySeconds);

        // Get last 7 days data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), i);
          const dayActivities = validActivities.filter((activity) =>
            isSameDay(getActivityDate(activity), date)
          );
          const dayTotal = dayActivities.reduce(
            (sum, activity) =>
              sum + (activity.durationInSeconds || activity.duration || 0),
            0
          );

          return {
            day: format(date, 'EEE'),
            durationInSeconds: dayTotal,
            sessions: dayActivities.length,
          };
        }).reverse();

        // Get last 30 days data for monthly chart
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), i);
          const dayActivities = validActivities.filter((activity) =>
            isSameDay(getActivityDate(activity), date)
          );
          const dayTotal = dayActivities.reduce(
            (sum, activity) =>
              sum + (activity.durationInSeconds || activity.duration || 0),
            0
          );

          return {
            date: format(date, 'MMM dd'),
            durationInSeconds: dayTotal,
            sessions: dayActivities.length,
          };
        }).reverse();

        // Get active days for calendar
        const activeDays = validActivities.map((activity) =>
          startOfDay(getActivityDate(activity))
        );
        const uniqueActiveDays = Array.from(
          new Set(activeDays.map((date) => date.getTime()))
        ).map((time) => new Date(time));

        setAnalyticsData({
          avgDailyCoding,
          totalCodingHours,
          weeklyCodingData: last7Days,
          monthlyCodingData: last30Days,
          activityDays: uniqueActiveDays,
          totalSessions,
          longestSession,
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

// Enhanced Stats Section
const StatsSection = React.memo<{
  currentStreak: number;
  longestStreak: number;
  analyticsData: AnalyticsStats | null;
}>(({ currentStreak, longestStreak, analyticsData }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
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
      description="Personal best"
      color="text-purple-500"
    />
    <StatCard
      title="Total Hours"
      value={analyticsData?.totalCodingHours || '0m'}
      icon={Clock}
      description="All time tracked"
      color="text-blue-500"
    />
    <StatCard
      title="Avg. Daily"
      value={analyticsData?.avgDailyCoding || '0m'}
      icon={Target}
      description="Average per day"
      color="text-green-500"
    />
    <StatCard
      title="Total Sessions"
      value={`${analyticsData?.totalSessions || 0}`}
      icon={Activity}
      description="Focus sessions"
      color="text-indigo-500"
    />
    <StatCard
      title="Longest Session"
      value={analyticsData?.longestSession || '0m'}
      icon={TrendingUp}
      description="Single session"
      color="text-red-500"
    />
  </div>
));

export default function AnalyticsPage() {
  const { profile, currentStreak, longestStreak } = useAuth();
  const { analyticsData, loading, error } = useAnalyticsData(profile?.uid);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTaskAnalytics, setFilteredTaskAnalytics] = useState<
    TaskAnalyticsDataItem[]
  >([]);
  const [activityData, setActivityData] = useState<{
    [key: string]: { duration: number; sessions: number };
  }>({});

  const creationDate = useMemo(
    () => (profile?.createdAt ? profile.createdAt.toDate() : undefined),
    [profile?.createdAt]
  );

  // Process activity data for calendar
  useEffect(() => {
    const processActivityData = async () => {
      if (!profile?.uid) return;

      try {
        const activities = await getActivity(profile.uid);
        const validActivities = activities.filter((activity) => {
          return (
            (activity.createdAt &&
              typeof activity.createdAt.toDate === 'function') ||
            (activity.date && typeof activity.date.toDate === 'function')
          );
        });

        const dayData: {
          [key: string]: { duration: number; sessions: number };
        } = {};
        validActivities.forEach((activity) => {
          const date = getActivityDate(activity);
          const dateKey = format(date, 'yyyy-MM-dd');
          const duration = activity.durationInSeconds || activity.duration || 0;

          if (!dayData[dateKey]) {
            dayData[dateKey] = { duration: 0, sessions: 0 };
          }
          dayData[dateKey].duration += duration;
          dayData[dateKey].sessions += 1;
        });

        setActivityData(dayData);
      } catch (err) {
        console.error('Error processing activity data:', err);
      }
    };

    processActivityData();
  }, [profile?.uid]);

  // Filter task analytics based on selected date and search query
  useEffect(() => {
    const processTaskAnalytics = async () => {
      if (!profile?.uid) return;

      try {
        const activities = await getActivity(profile.uid);
        const validActivities = activities.filter((activity) => {
          return (
            (activity.createdAt &&
              typeof activity.createdAt.toDate === 'function') ||
            (activity.date && typeof activity.date.toDate === 'function')
          );
        });

        let filteredActivities = validActivities;
        if (selectedDate) {
          filteredActivities = validActivities.filter((activity) =>
            isSameDay(getActivityDate(activity), selectedDate)
          );
        }

        const taskMap = new Map<string, { total: number; sessions: number }>();
        filteredActivities.forEach((activity) => {
          const taskName =
            activity.taskName || activity.taskText || 'General Focus';
          const current = taskMap.get(taskName) || { total: 0, sessions: 0 };
          const duration = activity.durationInSeconds || activity.duration || 0;
          taskMap.set(taskName, {
            total: current.total + duration,
            sessions: current.sessions + 1,
          });
        });

        let taskAnalytics = Array.from(taskMap.entries()).map(
          ([name, data]) => ({
            name,
            displayName:
              name.length > 20 ? `${name.substring(0, 20)}...` : name,
            total: data.total,
            sessions: data.sessions,
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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
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
    <div className="flex flex-col gap-6">
      {/* Stats Section */}
      <StatsSection
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        analyticsData={analyticsData}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {selectedDate
                ? `Tasks on ${format(selectedDate, 'MMM dd, yyyy')}`
                : 'Task Overview'}
            </CardTitle>
            <CardDescription>
              {selectedDate
                ? 'Focus sessions for the selected day'
                : 'Your coding activities breakdown'}
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
            {filteredTaskAnalytics.length > 0 ? (
              <ChartContainer
                config={{
                  total: {
                    label: 'Duration',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={filteredTaskAnalytics}>
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
                    formatter={(value: any, name, props) => [
                      formatDuration(value),
                      'Duration',
                      `${props.payload.sessions} sessions`,
                    ]}
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

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Calendar
              {analyticsData?.activityDays &&
                analyticsData.activityDays.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({analyticsData.activityDays.length} active days)
                  </span>
                )}
            </CardTitle>
            <CardDescription>
              Select a day to see your activity details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              activityDays={analyticsData?.activityDays || []}
              activityData={activityData}
              userCreationDate={creationDate}
              currentStreak={currentStreak}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>
              Your coding activity over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                durationInSeconds: {
                  label: 'Duration',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[200px]"
            >
              <LineChart data={analyticsData?.weeklyCodingData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(value) => `${Math.round(value / 60)}m`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [
                    formatDuration(value),
                    'Duration',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="durationInSeconds"
                  stroke="var(--color-durationInSeconds)"
                  strokeWidth={2}
                  dot={{
                    fill: 'var(--color-durationInSeconds)',
                    strokeWidth: 2,
                    r: 4,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Your coding activity over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                durationInSeconds: {
                  label: 'Duration',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className="h-[200px]"
            >
              <BarChart
                data={analyticsData?.monthlyCodingData?.slice(-14) || []}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(value) => `${Math.round(value / 60)}m`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [
                    formatDuration(value),
                    'Duration',
                  ]}
                />
                <Bar
                  dataKey="durationInSeconds"
                  fill="var(--color-durationInSeconds)"
                  radius={2}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
