import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all analytics components
import AnalyticsFilters from './components/AnalyticsFilters';
import WeeklyProductivityChart from './components/WeeklyProductivityChart';
import ActivityHeatmap from './components/ActivityHeatmap';
import TimeDistributionChart from './components/TimeDistributionChart';
import SessionDurationChart from './components/SessionDurationChart';
import DetailedMetricsTable from './components/DetailedMetricsTable';

const Analytics = () => {
  const [activeFilters, setActiveFilters] = useState({
    dateRange: '7days',
    tags: [],
  });

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  const exportAllData = () => {
    alert("Exporting data...");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Insights into your productivity patterns and performance.
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={exportAllData}>
            <Icon name="Download" size={16} />
            <span className="ml-2">Export All</span>
          </Button>
        </div>
      </div>

      <AnalyticsFilters onFiltersChange={handleFiltersChange} />

      <div className="space-y-8">
        <WeeklyProductivityChart />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ActivityHeatmap />
          <TimeDistributionChart />
        </div>
        <SessionDurationChart />
        <DetailedMetricsTable />
      </div>
    </div>
  );
};

export default Analytics;
