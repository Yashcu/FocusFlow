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
import { DayPicker } from 'react-day-picker';

interface CalendarCardProps {
  title?: string;
  description?: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  creationDate?: Date;
  modifiers?: { active: Date[] };
  className?: string;
  disabled?: (date: Date) => boolean;
  onSelect?: (date: Date | undefined) => void; // Add onSelect prop
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
    onSelect, // Include onSelect in the destructured props
  }) => {
    const defaultDisabled = React.useMemo(() => {
      if (disabled) return disabled;
      return creationDate ? { before: creationDate } : undefined;
    }, [disabled, creationDate]);

    const modifiersClassNames = React.useMemo(
      () => ({
        active: 'bg-primary/20',
        selected: 'bg-primary text-primary-foreground',
        today: 'border-primary',
      }),
      []
    );

    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={defaultDisabled}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md"
          />
        </CardContent>
      </Card>
    );
  }
);

CalendarCard.displayName = 'CalendarCard';
