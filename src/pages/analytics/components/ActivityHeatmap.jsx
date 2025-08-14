import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityHeatmap = () => {
  const [selectedMonth, setSelectedMonth] = useState('August 2025');

  // Generate heatmap data for the last 7 weeks
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate?.setDate(today?.getDate() - 48); // 7 weeks back

    for (let i = 0; i < 49; i++) {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() + i);
      
      // Generate random activity level (0-4)
      const activityLevel = Math.floor(Math.random() * 5);
      const hours = activityLevel * 2 + Math.random() * 2;
      
      data?.push({
        date: date?.toISOString()?.split('T')?.[0],
        day: date?.getDay(),
        week: Math.floor(i / 7),
        activityLevel,
        hours: Math.round(hours * 10) / 10,
        dayName: date?.toLocaleDateString('en-US', { weekday: 'short' }),
        dateString: date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const weeks = Array.from({ length: 7 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getActivityColor = (level) => {
    const colors = [
      'bg-muted', // 0 - no activity
      'bg-primary/20', // 1 - low
      'bg-primary/40', // 2 - medium-low
      'bg-primary/60', // 3 - medium-high
      'bg-primary' // 4 - high
    ];
    return colors?.[level] || colors?.[0];
  };

  const getTooltipText = (item) => {
    if (!item) return '';
    return `${item?.hours}h on ${item?.dateString}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Activity Heatmap</h3>
          <p className="text-sm text-muted-foreground">Your productivity patterns over time</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Icon name="Calendar" size={16} />
            <span className="ml-2">{selectedMonth}</span>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Days of week labels */}
          <div className="flex mb-2">
            <div className="w-8"></div>
            {days?.map((day) => (
              <div key={day} className="text-xs text-muted-foreground text-center w-4 mr-1">
                {day?.[0]}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {weeks?.map((week) => (
              <div key={week} className="flex flex-col mr-1">
                {days?.map((_, dayIndex) => {
                  const item = heatmapData?.find(d => d?.week === week && d?.day === dayIndex);
                  return (
                    <div
                      key={`${week}-${dayIndex}`}
                      className={`w-4 h-4 mb-1 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50 ${
                        item ? getActivityColor(item?.activityLevel) : 'bg-muted'
                      }`}
                      title={item ? getTooltipText(item) : ''}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4]?.map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Last 7 weeks
            </div>
          </div>
        </div>
      </div>
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">28</div>
          <div className="text-xs text-muted-foreground">Active Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">6.2h</div>
          <div className="text-xs text-muted-foreground">Daily Avg</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary">12h</div>
          <div className="text-xs text-muted-foreground">Best Day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-warning">4</div>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;