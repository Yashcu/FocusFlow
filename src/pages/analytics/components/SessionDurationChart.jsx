import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionDurationChart = () => {
  const [viewType, setViewType] = useState('daily');

  const sessionData = [
    { time: '9:00', avgDuration: 45, sessions: 3, date: '2025-08-06' },
    { time: '10:00', avgDuration: 62, sessions: 4, date: '2025-08-06' },
    { time: '11:00', avgDuration: 78, sessions: 5, date: '2025-08-06' },
    { time: '12:00', avgDuration: 35, sessions: 2, date: '2025-08-06' },
    { time: '13:00', avgDuration: 25, sessions: 1, date: '2025-08-06' },
    { time: '14:00', avgDuration: 85, sessions: 6, date: '2025-08-06' },
    { time: '15:00', avgDuration: 92, sessions: 7, date: '2025-08-06' },
    { time: '16:00', avgDuration: 68, sessions: 4, date: '2025-08-06' },
    { time: '17:00', avgDuration: 55, sessions: 3, date: '2025-08-06' },
    { time: '18:00', avgDuration: 40, sessions: 2, date: '2025-08-06' }
  ];

  const weeklyData = [
    { day: 'Mon', avgDuration: 65, sessions: 12, totalHours: 8.2 },
    { day: 'Tue', avgDuration: 72, sessions: 14, totalHours: 9.1 },
    { day: 'Wed', avgDuration: 58, sessions: 11, totalHours: 7.8 },
    { day: 'Thu', avgDuration: 81, sessions: 15, totalHours: 10.3 },
    { day: 'Fri', avgDuration: 69, sessions: 13, totalHours: 8.7 },
    { day: 'Sat', avgDuration: 45, sessions: 6, totalHours: 4.2 },
    { day: 'Sun', avgDuration: 38, sessions: 4, totalHours: 3.1 }
  ];

  const currentData = viewType === 'daily' ? sessionData : weeklyData;
  const xAxisKey = viewType === 'daily' ? 'time' : 'day';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">
            {viewType === 'daily' ? `${label}` : `${label}`}
          </p>
          <p className="text-sm text-muted-foreground">
            Avg Duration: {data?.avgDuration} min
          </p>
          <p className="text-sm text-muted-foreground">
            Sessions: {data?.sessions}
          </p>
          {viewType === 'weekly' && (
            <p className="text-sm text-muted-foreground">
              Total: {data?.totalHours}h
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => `${value}m`;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Session Duration Patterns</h3>
          <p className="text-sm text-muted-foreground">
            Average session length {viewType === 'daily' ? 'throughout the day' : 'by day of week'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewType === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('daily')}
              className="h-8 px-3"
            >
              <Icon name="Clock" size={16} />
              <span className="ml-1">Daily</span>
            </Button>
            <Button
              variant={viewType === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('weekly')}
              className="h-8 px-3"
            >
              <Icon name="Calendar" size={16} />
              <span className="ml-1">Weekly</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey={xAxisKey}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="avgDuration"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#durationGradient)"
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="TrendingUp" size={20} className="text-accent" />
          </div>
          <div className="text-lg font-bold text-foreground">
            {viewType === 'daily' ? '92min' : '81min'}
          </div>
          <div className="text-xs text-muted-foreground">Peak Duration</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Target" size={20} className="text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground">
            {viewType === 'daily' ? '62min' : '65min'}
          </div>
          <div className="text-xs text-muted-foreground">Average Duration</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Activity" size={20} className="text-secondary" />
          </div>
          <div className="text-lg font-bold text-foreground">
            {viewType === 'daily' ? '40' : '75'}
          </div>
          <div className="text-xs text-muted-foreground">Total Sessions</div>
        </div>
      </div>
    </div>
  );
};

export default SessionDurationChart;