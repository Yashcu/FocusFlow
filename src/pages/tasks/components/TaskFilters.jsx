import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskFilters = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  tagFilter,
  onTagFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  availableTags,
  onClearFilters,
  taskCounts
}) => {
  const statusOptions = [
    { value: 'all', label: `All Tasks (${taskCounts?.all})` },
    { value: 'active', label: `Active (${taskCounts?.active})` },
    { value: 'completed', label: `Completed (${taskCounts?.completed})` }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const tagOptions = [
    { value: 'all', label: 'All Tags' },
    ...availableTags?.map(tag => ({
      value: tag?.id,
      label: tag?.name
    }))
  ];

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || tagFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={16} />
          <span>Filter Tasks</span>
        </h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search tasks by name or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="Filter by status"
        />

        {/* Priority Filter */}
        <Select
          options={priorityOptions}
          value={priorityFilter}
          onChange={onPriorityFilterChange}
          placeholder="Filter by priority"
        />
      </div>
      {/* Tag Filter - Full width on second row */}
      <div className="mt-4">
        <Select
          options={tagOptions}
          value={tagFilter}
          onChange={onTagFilterChange}
          placeholder="Filter by tag"
          searchable
        />
      </div>
      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                <Icon name="Search" size={12} className="mr-1" />
                Search: "{searchQuery}"
              </span>
            )}
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                <Icon name="CheckSquare" size={12} className="mr-1" />
                Status: {statusFilter}
              </span>
            )}
            
            {priorityFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs">
                <Icon name="AlertTriangle" size={12} className="mr-1" />
                Priority: {priorityFilter}
              </span>
            )}
            
            {tagFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs">
                <Icon name="Tag" size={12} className="mr-1" />
                Tag: {availableTags?.find(tag => tag?.id === tagFilter)?.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;