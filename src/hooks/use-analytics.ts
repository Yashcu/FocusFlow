
import { useState, useEffect } from 'react';
import { getActivity } from '@/lib/firebase/firestore';
import { formatDuration } from '@/utils/time-formatters';
import { subDays, isSameDay, startOfDay, format } from 'date-fns';

export type AnalyticsData = {
  avgDailyCoding: string;
  totalCodingHours: string;
  weeklyCodingData: { day: string; durationInSeconds: number }[];
  activityDayModifiers: { active: Date[] };
};

export const useAnalytics = (userId: string | undefined) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const activities = await getActivity(userId);

        const totalSeconds = activities.reduce((sum, activity) => sum + activity.durationInSeconds, 0);
        const totalCodingHours = formatDuration(totalSeconds);

        const avgDailySeconds = activities.length > 0 ? totalSeconds / activities.length : 0;
        const avgDailyCoding = formatDuration(avgDailySeconds);

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), i);
          const dayActivities = activities.filter(activity =>
            isSameDay(activity.createdAt.toDate(), date)
          );
          const dayTotal = dayActivities.reduce((sum, activity) => sum + activity.durationInSeconds, 0);

          return {
            day: format(date, 'EEE'),
            durationInSeconds: dayTotal,
          };
        }).reverse();

        const activeDays = activities.map(activity => startOfDay(activity.createdAt.toDate()));
        const uniqueActiveDays = Array.from(new Set(activeDays.map(date => date.getTime())))
          .map(time => new Date(time));

        setData({
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

    fetchData();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const activities = await getActivity(userId);

      const totalSeconds = activities.reduce((sum, activity) => sum + activity.durationInSeconds, 0);
      const totalCodingHours = formatDuration(totalSeconds);

      const avgDailySeconds = activities.length > 0 ? totalSeconds / activities.length : 0;
      const avgDailyCoding = formatDuration(avgDailySeconds);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        const dayActivities = activities.filter(activity =>
          isSameDay(activity.createdAt.toDate(), date)
        );
        const dayTotal = dayActivities.reduce((sum, activity) => sum + activity.durationInSeconds, 0);

        return {
          day: format(date, 'EEE'),
          durationInSeconds: dayTotal,
        };
      }).reverse();

      const activeDays = activities.map(activity => startOfDay(activity.createdAt.toDate()));
      const uniqueActiveDays = Array.from(new Set(activeDays.map(date => date.getTime())))
        .map(time => new Date(time));

      setData({
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

  return { data, loading, error, refetch };
};
