'use client';

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CalendarCardProps {
  title?: string;
  description?: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  creationDate?: Date;
  modifiers?: { active: Date[] };
  className?: string;
  disabled?: (date: Date) => boolean;
  onSelect?: (date: Date | undefined) => void;
}

export const CalendarCard = React.memo<CalendarCardProps>(
  ({
    title = 'Activity Calendar',
    description = 'Select a day to see your activity.',
    selectedDate,
    setSelectedDate,
    creationDate,
    modifiers,
    className,
    disabled,
    onSelect,
  }) => {
    const defaultDisabled = React.useMemo(() => {
      if (disabled) return disabled;
      return creationDate ? { before: creationDate } : undefined;
    }, [disabled, creationDate]);

    const modifiersClassNames = React.useMemo(
      () => ({
        // Active days - days with coding activity
        active:
          'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-semibold relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-green-500 after:rounded-full',
        // Selected day
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        // Today
        today:
          'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 font-bold text-blue-800 dark:text-blue-200',
        // Selected + Active (when an active day is selected)
        'selected active':
          'bg-primary text-primary-foreground relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary-foreground after:rounded-full',
      }),
      []
    );

    const handleDateSelect = React.useCallback(
      (date: Date | undefined) => {
        setSelectedDate(date);
        if (onSelect) {
          onSelect(date);
        }
      },
      [setSelectedDate, onSelect]
    );

    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
            {modifiers?.active && modifiers.active.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({modifiers.active.length} active days)
              </span>
            )}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={defaultDisabled}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border"
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-300 rounded"></div>
                <span>Activity</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

CalendarCard.displayName = 'CalendarCard';
