import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AnalyticsFilters = ({ onFiltersChange }) => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);

  const availableTags = [
    'Frontend Development',
    'Backend Development', 
    'Code Review',
    'Testing & QA',
    'Documentation',
    'Bug Fixes',
    'Research',
    'Meetings'
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setShowCustomDate(value === 'custom');
    
    if (onFiltersChange) {
      onFiltersChange({
        dateRange: value,
        tags: selectedTags,
        customDateStart: value === 'custom' ? customDateStart : null,
        customDateEnd: value === 'custom' ? customDateEnd : null
      });
    }
  };

  const handleTagToggle = (tag) => {
    const updatedTags = selectedTags?.includes(tag)
      ? selectedTags?.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(updatedTags);
    
    if (onFiltersChange) {
      onFiltersChange({
        dateRange,
        tags: updatedTags,
        customDateStart,
        customDateEnd
      });
    }
  };

  const clearAllFilters = () => {
    setDateRange('7days');
    setSelectedTags([]);
    setCustomDateStart('');
    setCustomDateEnd('');
    setShowCustomDate(false);
    
    if (onFiltersChange) {
      onFiltersChange({
        dateRange: '7days',
        tags: [],
        customDateStart: null,
        customDateEnd: null
      });
    }
  };

  const hasActiveFilters = selectedTags?.length > 0 || dateRange !== '7days';

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 sm:mb-0">Analytics Filters</h3>
        
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <Icon name="X" size={16} />
            <span className="ml-2">Clear All</span>
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Time Period</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dateRangeOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={dateRange === option?.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeChange(option?.value)}
                className="justify-center"
              >
                {option?.label}
              </Button>
            ))}
          </div>
          
          {showCustomDate && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input
                type="date"
                label="Start Date"
                value={customDateStart}
                onChange={(e) => setCustomDateStart(e?.target?.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={customDateEnd}
                onChange={(e) => setCustomDateEnd(e?.target?.value)}
              />
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Filter by Tags ({selectedTags?.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags?.map((tag) => {
              const isSelected = selectedTags?.includes(tag);
              return (
                <Button
                  key={tag}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className="text-xs"
                >
                  {isSelected && <Icon name="Check" size={14} className="mr-1" />}
                  {tag}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">156.2h</div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">89</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">1.8h</div>
            <div className="text-xs text-muted-foreground">Avg Session</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">87%</div>
            <div className="text-xs text-muted-foreground">Productivity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;