/**
 * Formats duration in seconds to human-readable string
 */
export const formatDuration = (seconds: number, format: 'short' | 'long' = 'short'): string => {
  if (seconds < 60) {
    return format === 'long' ? `${Math.round(seconds)} seconds` : `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    if (format === 'long') {
      return remainingSeconds > 0
        ? `${minutes} minutes ${Math.round(remainingSeconds)} seconds`
        : `${minutes} minutes`;
    }
    return remainingSeconds > 0
      ? `${minutes}m ${Math.round(remainingSeconds)}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    if (format === 'long') {
      return remainingMinutes > 0
        ? `${hours} hours ${remainingMinutes} minutes`
        : `${hours} hours`;
    }
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (format === 'long') {
    return remainingHours > 0
      ? `${days} days ${remainingHours} hours`
      : `${days} days`;
  }
  return remainingHours > 0
    ? `${days}d ${remainingHours}h`
    : `${days}d`;
};

/**
 * Formats duration for display in charts and analytics
 */
export const formatDurationForChart = (seconds: number): string => {
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  }
  return `${(seconds / 3600).toFixed(1)}h`;
};

/**
 * Converts hours to seconds
 */
export const hoursToSeconds = (hours: number): number => hours * 3600;

/**
 * Converts minutes to seconds
 */
export const minutesToSeconds = (minutes: number): number => minutes * 60;

/**
 * Gets time remaining in a readable format
 */
export const getTimeRemaining = (endTime: number): string => {
  const now = Date.now();
  const timeLeft = Math.max(0, endTime - now);
  return formatDuration(Math.floor(timeLeft / 1000));
};
