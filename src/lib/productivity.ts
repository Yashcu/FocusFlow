
import type { Activity } from "./firebase/firestore";

// A simple function to calculate a productivity score based on today's activities.
// This can be expanded with more complex logic later.
export function calculateProductivityScore(activities: Activity[]): {
  score: number;
  totalDuration: number; // in seconds
  sessionCount: number;
} {
  const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);
  const sessionCount = activities.length;

  // Score based on duration. Max score at 4 hours (14400 seconds).
  const durationScore = Math.min(100, (totalDuration / 14400) * 100);

  // Score based on number of sessions. Max score at 5 sessions.
  const sessionScore = Math.min(100, (sessionCount / 5) * 100);

  // Weighted average. More weight on total duration.
  const score = Math.round(durationScore * 0.7 + sessionScore * 0.3);

  return {
    score,
    totalDuration,
    sessionCount,
  };
}
