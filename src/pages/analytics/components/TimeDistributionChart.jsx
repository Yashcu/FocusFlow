import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import Button from '../../../components/ui/Button';

const TimeDistributionChart = () => {
  const [timeRange, setTimeRange] = useState('week');

  const distributionData = [
    {
      name: 'Frontend Development',
      value: 45.2,
      hours: 18.1,
      color: 'var(--color-primary)',
      sessions: 12
    },
    {
      name: 'Backend Development',
      value: 28.5,
      hours: 11.4,
      color: 'var(--color-accent)',
      sessions: 8
    },
    {
      name: 'Code Review',
      value: 12.3,
      hours: 4.9,
      color: 'var(--color-secondary)',
      sessions: 6
    },
    {
      name: 'Testing & QA',
      value: 8.7,
      hours: 3.5,
      color: 'var(--color-warning)',
      sessions: 5
    },
    {
      name: 'Documentation',
      value: 5.3,
      hours: 2.1,
      color: 'var(--color-destructive)',
      sessions: 3
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data?.hours}h ({data?.value}%) • {data?.sessions} sessions
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Time Distribution by Tags</h3>
          <p className="text-sm text-muted-foreground">How you spend your tracked time</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('week')}
              className="h-8 px-3"
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('month')}
              className="h-8 px-3"
            >
              Month
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="var(--color-background)"
              >
                {distributionData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend and Details */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-foreground mb-4">
            Total: 40.0 hours this {timeRange}
          </div>
          
          {distributionData?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item?.color }}
                />
                <div>
                  <div className="font-medium text-foreground text-sm">{item?.name}</div>
                  <div className="text-xs text-muted-foreground">{item?.sessions} sessions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground text-sm">{item?.hours}h</div>
                <div className="text-xs text-muted-foreground">{item?.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">5</div>
          <div className="text-xs text-muted-foreground">Active Tags</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">34</div>
          <div className="text-xs text-muted-foreground">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary">1.2h</div>
          <div className="text-xs text-muted-foreground">Avg Session</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-warning">Frontend</div>
          <div className="text-xs text-muted-foreground">Top Category</div>
        </div>
      </div>
    </div>
  );
};

export default TimeDistributionChart;