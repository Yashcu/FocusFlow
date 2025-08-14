import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeeklyProductivityChart = () => {
  const [chartType, setChartType] = useState('bar');

  const weeklyData = [
    {
      week: 'Week 1',
      totalHours: 32.5,
      completedTasks: 18,
      focusScore: 85,
      date: '2025-07-14'
    },
    {
      week: 'Week 2',
      totalHours: 28.2,
      completedTasks: 15,
      focusScore: 78,
      date: '2025-07-21'
    },
    {
      week: 'Week 3',
      totalHours: 35.8,
      completedTasks: 22,
      focusScore: 92,
      date: '2025-07-28'
    },
    {
      week: 'Week 4',
      totalHours: 41.3,
      completedTasks: 26,
      focusScore: 88,
      date: '2025-08-04'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-bold text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between" style={{ color: entry?.color }}>
              <span>{entry?.name}:</span>
              <span className="font-semibold ml-4">{entry?.name === 'Hours Tracked' ? `${entry?.value}h` : entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Weekly Productivity Trends</h3>
          <p className="text-sm text-muted-foreground">Compare your productivity across recent weeks</p>
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-8 px-3"
            >
              <Icon name="BarChart3" size={16} />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8 px-3"
            >
              <Icon name="TrendingUp" size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="week"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
              <Bar
                dataKey="totalHours"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Hours Tracked"
              />
              <Bar
                dataKey="completedTasks"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
                name="Tasks Completed"
              />
            </BarChart>
          ) : (
            <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="week"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="totalHours"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Hours Tracked"
              />
              <Line
                type="monotone"
                dataKey="focusScore"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Focus Score"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyProductivityChart;
