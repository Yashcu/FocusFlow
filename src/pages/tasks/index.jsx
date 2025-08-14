import React, { useReducer, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { useStopwatch } from '../../contexts/StopwatchContext';
import { tasksReducer, initialState } from './taskReducer';
import TaskCreationForm from './components/TaskCreationForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import EditTaskModal from './components/EditTaskModal';

const TasksPage = () => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  const { startStopwatch, stopStopwatch, activeTask } = useStopwatch();
  const activeStopwatchTaskId = activeTask ? activeTask.id : null;

  useEffect(() => {
    const initializeMockData = () => {
      const mockTags = [
        { id: '1', name: 'Frontend', color: '#3B82F6' },
        { id: '2', name: 'Backend', color: '#10B981' },
        { id: '3', name: 'Bug Fix', color: '#EF4444' },
      ];
      const mockTasks = [
        { id: '1', name: 'Implement user authentication', priority: 'high', tags: ['1', '2'], completed: false, totalTime: 7200, sessionCount: 3 },
        { id: '2', name: 'Fix responsive layout', priority: 'urgent', tags: ['1', '3'], completed: false, totalTime: 3600, sessionCount: 2 },
        { id: '3', name: 'Write API documentation', priority: 'medium', tags: ['2'], completed: true, totalTime: 5400, sessionCount: 2 },
        { id: '4', name: 'Optimize database queries', priority: 'high', tags: ['2'], completed: false, totalTime: 0, sessionCount: 0 },
      ];
      dispatch({ type: 'INITIALIZE_DATA', payload: { tasks: mockTasks, tags: mockTags } });
    };
    setTimeout(initializeMockData, 800);
  }, []);

  const filteredTasks = state.tasks.filter(task => {
    const { searchQuery, statusFilter, tagFilter, priorityFilter } = state.filters;
    if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter === 'active' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;
    if (tagFilter !== 'all' && !task.tags.includes(tagFilter)) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const taskCounts = {
    all: state.tasks.length,
    active: state.tasks.filter(t => !t.completed).length,
    completed: state.tasks.filter(t => t.completed).length,
  };

  const handleStartStopwatch = (task) => {
    if (activeStopwatchTaskId === task.id) {
      stopStopwatch();
    } else {
      startStopwatch(task);
    }
  };

    const handleCompleteTask = (taskId) => {
        dispatch({ type: 'COMPLETE_TASK', payload: taskId });
        if (activeStopwatchTaskId === taskId) stopStopwatch();
    };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks with integrated time tracking.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1"><Icon name="Clock" size={16} /><span>{taskCounts.active} active</span></div>
            <div className="flex items-center space-x-1"><Icon name="CheckCircle" size={16} /><span>{taskCounts.completed} completed</span></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4"><div className="sticky top-24"><TaskCreationForm onCreateTask={(task) => dispatch({ type: 'CREATE_TASK', payload: task })} availableTags={state.availableTags} onCreateTag={(tag) => dispatch({ type: 'CREATE_TAG', payload: tag })} /></div></div>
        <div className="lg:col-span-8"><div className="space-y-6"><TaskFilters
            searchQuery={state.filters.searchQuery}
            onSearchChange={(value) => dispatch({ type: 'SET_FILTER', payload: { filterName: 'searchQuery', value } })}
            statusFilter={state.filters.statusFilter}
            onStatusFilterChange={(value) => dispatch({ type: 'SET_FILTER', payload: { filterName: 'statusFilter', value } })}
            tagFilter={state.filters.tagFilter}
            onTagFilterChange={(value) => dispatch({ type: 'SET_FILTER', payload: { filterName: 'tagFilter', value } })}
            priorityFilter={state.filters.priorityFilter}
            onPriorityFilterChange={(value) => dispatch({ type: 'SET_FILTER', payload: { filterName: 'priorityFilter', value } })}
            availableTags={state.availableTags}
            onClearFilters={() => dispatch({ type: 'CLEAR_FILTERS' })}
            taskCounts={taskCounts}
            /><TaskList tasks={filteredTasks} availableTags={state.availableTags} activeStopwatchTaskId={activeStopwatchTaskId} onStartStopwatch={handleStartStopwatch} onEditTask={(task) => dispatch({ type: 'OPEN_EDIT_MODAL', payload: task })} onDeleteTask={(taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId })} onCompleteTask={handleCompleteTask} loading={state.loading} /></div></div>
      </div>

      <EditTaskModal task={state.editingTask} isOpen={state.isEditModalOpen} onClose={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })} onUpdateTask={(task) => dispatch({ type: 'UPDATE_TASK', payload: task })} availableTags={state.availableTags} onCreateTag={(tag) => dispatch({ type: 'CREATE_TAG', payload: tag })} />
    </>
  );
};

export default TasksPage;
