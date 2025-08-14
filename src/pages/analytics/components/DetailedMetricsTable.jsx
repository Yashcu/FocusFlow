import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DetailedMetricsTable = () => {
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sessionsData = [
    {
      id: 1,
      taskName: 'User Authentication API',
      tag: 'Backend Development',
      startTime: '2025-08-10 09:15:00',
      endTime: '2025-08-10 11:30:00',
      duration: 135,
      date: '2025-08-10',
      productivity: 92
    },
    {
      id: 2,
      taskName: 'Dashboard UI Components',
      tag: 'Frontend Development',
      startTime: '2025-08-10 14:00:00',
      endTime: '2025-08-10 15:45:00',
      duration: 105,
      date: '2025-08-10',
      productivity: 88
    },
    {
      id: 3,
      taskName: 'Code Review - Payment Module',
      tag: 'Code Review',
      startTime: '2025-08-09 16:20:00',
      endTime: '2025-08-09 17:15:00',
      duration: 55,
      date: '2025-08-09',
      productivity: 95
    },
    {
      id: 4,
      taskName: 'Unit Tests for User Service',
      tag: 'Testing & QA',
      startTime: '2025-08-09 10:30:00',
      endTime: '2025-08-09 12:00:00',
      duration: 90,
      date: '2025-08-09',
      productivity: 85
    },
    {
      id: 5,
      taskName: 'API Documentation Update',
      tag: 'Documentation',
      startTime: '2025-08-08 15:45:00',
      endTime: '2025-08-08 16:30:00',
      duration: 45,
      date: '2025-08-08',
      productivity: 78
    },
    {
      id: 6,
      taskName: 'Database Schema Optimization',
      tag: 'Backend Development',
      startTime: '2025-08-08 09:00:00',
      endTime: '2025-08-08 11:15:00',
      duration: 135,
      date: '2025-08-08',
      productivity: 91
    },
    {
      id: 7,
      taskName: 'Mobile Responsive Design',
      tag: 'Frontend Development',
      startTime: '2025-08-07 13:30:00',
      endTime: '2025-08-07 15:45:00',
      duration: 135,
      date: '2025-08-07',
      productivity: 89
    },
    {
      id: 8,
      taskName: 'Security Audit Review',
      tag: 'Code Review',
      startTime: '2025-08-07 11:00:00',
      endTime: '2025-08-07 12:30:00',
      duration: 90,
      date: '2025-08-07',
      productivity: 94
    }
  ];

  const tags = [...new Set(sessionsData.map(session => session.tag))];

  const filteredData = sessionsData?.filter(session => 
    filterTag === '' || session?.tag === filterTag
  );

  const sortedData = [...filteredData]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];
    
    if (sortBy === 'duration') {
      aValue = parseInt(aValue);
      bValue = parseInt(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (timeString) => {
    return new Date(timeString)?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getProductivityColor = (score) => {
    if (score >= 90) return 'text-accent';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Task Name', 'Tag', 'Date', 'Start Time', 'End Time', 'Duration (min)', 'Productivity Score'];
    const csvContent = [
      headers?.join(','),
      ...sortedData?.map(session => [
        `"${session?.taskName}"`,
        `"${session?.tag}"`,
        session?.date,
        formatTime(session?.startTime),
        formatTime(session?.endTime),
        session?.duration,
        session?.productivity
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity-sessions-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Detailed Session Metrics</h3>
          <p className="text-sm text-muted-foreground">Complete history of your tracked sessions</p>
        </div>
        
        <Button variant="outline" onClick={exportToCSV} className="mt-4 sm:mt-0">
          <Icon name="Download" size={16} />
          <span className="ml-2">Export CSV</span>
        </Button>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search tasks..."
            className="w-full"
          />
        </div>
        
        <select 
          value={filterTag}
          onChange={(e) => setFilterTag(e?.target?.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Tags</option>
          {tags?.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('taskName')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Task</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('tag')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Tag</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time Range</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('duration')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Duration</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('productivity')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Score</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((session) => (
              <tr key={session?.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="font-medium text-foreground">{session?.taskName}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {session?.tag}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {new Date(session.date)?.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="py-3 px-4 text-muted-foreground text-sm">
                  {formatTime(session?.startTime)} - {formatTime(session?.endTime)}
                </td>
                <td className="py-3 px-4 font-medium text-foreground">
                  {formatDuration(session?.duration)}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${getProductivityColor(session?.productivity)}`}>
                    {session?.productivity}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} sessions
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          <span className="text-sm text-foreground px-3">
            {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailedMetricsTable;