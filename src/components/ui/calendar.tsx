'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, DayPickerProps } from 'react-day-picker';

import { cn } from '@/utils/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = DayPickerProps;

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <div ref={ref} className="w-full">
        <DayPicker
          className={cn('p-4 w-full', className)}
          showOutsideDays={showOutsideDays}
          classNames={{
            months:
              'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
            month: 'space-y-4 w-full',
            caption: 'flex justify-center pt-1 relative items-center mb-4',
            caption_label: 'text-lg font-semibold',
            caption_dropdowns: 'flex justify-center gap-1',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              buttonVariants({ variant: 'outline' }),
              'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity'
            ),
            nav_button_previous: 'absolute left-2',
            nav_button_next: 'absolute right-2',
            table: 'w-full border-collapse',
            head_row: 'flex w-full mb-2',
            head_cell:
              'text-muted-foreground rounded-md font-semibold text-sm flex-1 flex items-center justify-center h-10',
            row: 'flex w-full mb-1',
            cell: cn(
              'flex-1 text-center text-sm p-0 relative h-12',
              'focus-within:relative focus-within:z-20',
              'first:rounded-l-md last:rounded-r-md'
            ),
            day: cn(
              'h-12 w-full p-0 font-medium text-sm rounded-md transition-all duration-200',
              'hover:bg-accent hover:text-accent-foreground hover:scale-105',
              'focus:bg-accent focus:text-accent-foreground focus:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
              'flex items-center justify-center relative'
            ),
            day_range_end: 'day-range-end',
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md',
            day_today:
              'bg-accent text-accent-foreground font-bold ring-2 ring-primary ring-offset-2',
            day_outside:
              'day-outside text-muted-foreground/50 opacity-50 hover:opacity-70',
            day_disabled:
              'text-muted-foreground/30 opacity-30 cursor-not-allowed hover:bg-transparent',
            day_range_middle:
              'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
            ...classNames,
          }}
          components={{
            Chevron: ({ orientation, ...iconProps }) =>
              orientation === 'left' ? (
                <ChevronLeft className="h-4 w-4" {...iconProps} />
              ) : (
                <ChevronRight className="h-4 w-4" {...iconProps} />
              ),
          }}
          {...props}
        />
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export { Calendar };
