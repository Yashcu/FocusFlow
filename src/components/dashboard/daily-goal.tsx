"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function DailyGoal({ className }: { className?: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { profile, codingTimeToday, loading } = useAuth();

  const dailyGoalInSeconds = (profile?.dailyGoal || 5) * 3600;

  const handleEditGoal = () => {
    router.push("/settings");
  };

  const progress = Math.min(
    100,
    dailyGoalInSeconds > 0
      ? Math.round((codingTimeToday / dailyGoalInSeconds) * 100)
      : 0
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Daily Coding Goal</CardTitle>
        <CardDescription>
          Stay on track to meet your daily objective.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-baseline">
              <p className="text-2xl font-bold font-headline">
                {formatDuration(codingTimeToday)}
              </p>
              <p className="text-sm text-muted-foreground">
                / {formatDuration(dailyGoalInSeconds)} goal
              </p>
            </div>
            <Progress
              value={progress}
              aria-label="Daily coding goal progress"
            />
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleEditGoal}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Goal in Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
