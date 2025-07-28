"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { getActivity } from "@/lib/firebase/firestore";
import { startOfWeek, startOfDay, format, subDays, getWeek } from "date-fns";
import { formatDuration } from "@/lib/time-formatters";

function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const diff = dateLeft.getTime() - dateRight.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function CodingActivityChart({
  className,
}: {
  className?: string;
}) {
  const { user } = useAuth();
  const [dailyData, setDailyData] = useState<any[] | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) return;
      const activities = await getActivity(user.uid, 30);

      // Process daily data for the last 7 days
      const dailyMap = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const day = startOfDay(subDays(new Date(), i));
        dailyMap.set(format(day, "EEE"), 0);
      }
      activities.forEach((act) => {
        const day = startOfDay(act.date.toDate());
        if (differenceInDays(new Date(), day) <= 6) {
          const dayKey = format(day, "EEE");
          dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + act.duration);
        }
      });
      const dailyChartData = Array.from(dailyMap.entries()).map(
        ([date, duration]) => ({
          date,
          total: duration,
        })
      );
      setDailyData(dailyChartData);

      // Process weekly data for the last 4 weeks
      const weeklyMap = new Map<string, number>();
      for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek(subDays(new Date(), i * 7));
        const weekKey = `W${getWeek(weekStart)}`;
        weeklyMap.set(weekKey, 0);
      }
      activities.forEach((act) => {
        const day = act.date.toDate();
        if (differenceInDays(new Date(), day) < 28) {
          const weekKey = `W${getWeek(day)}`;
          weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + act.duration);
        }
      });
      const weeklyChartData = Array.from(weeklyMap.entries())
        .map(([date, duration]) => ({
          date,
          total: duration,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setWeeklyData(weeklyChartData);
    };

    fetchChartData();
  }, [user]);

  const customTooltipFormatter = (value: number) => {
    return formatDuration(value);
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Coding Activity</CardTitle>
        <CardDescription>Your coding hours over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="p-0">
            {!dailyData ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ChartContainer className="h-[280px] w-full" config={{}}>
                <BarChart data={dailyData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickFormatter={customTooltipFormatter} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={customTooltipFormatter}
                      />
                    }
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
          <TabsContent value="weekly" className="p-0">
            {!weeklyData ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ChartContainer className="h-[280px] w-full" config={{}}>
                <BarChart data={weeklyData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickFormatter={customTooltipFormatter} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={customTooltipFormatter}
                      />
                    }
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
