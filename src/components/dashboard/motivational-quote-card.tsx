'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { fetchProductivityTip } from '@/server/actions/actions';
import type { DailyDevotionOutput } from '@/server/ai/flows/productivity-tips';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/utils/utils';

export default function MotivationalQuoteCard({
  className,
}: {
  className?: string;
}) {
  const [data, setData] = useState<DailyDevotionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTip = async () => {
      setLoading(true);
      try {
        const result = await fetchProductivityTip();
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getTip();
  }, []);

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Daily Motivation</CardTitle>
            <CardDescription>A dose of wisdom for your day.</CardDescription>
          </div>
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Separator />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        {!loading && !error && data && (
          <div className="space-y-3 text-center">
            <div>
              <p className="text-lg font-bold font-headline">
                {data.sanskritShlok}
              </p>
              <p className="text-sm text-muted-foreground italic">
                {data.transliteratedShlok}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {data.meaning}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold">Your Focus for Today:</p>
              <p className="text-sm text-muted-foreground">{data.motivation}</p>
            </div>
          </div>
        )}
        {!loading && !error && !data && (
          <p className="text-sm text-muted-foreground text-center">
            Could not load motivation for today.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
