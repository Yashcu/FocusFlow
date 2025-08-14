import React from 'react';
import Icon from '../../../components/AppIcon';
import TaskCard from './TaskCard';

const TaskList = ({
  tasks,
  availableTags,
  activeStopwatchTaskId,
  onStartStopwatch,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  loading
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
              <div className="h-6 bg-muted rounded w-16" />
            </div>
            <div className="flex space-x-2 mb-3">
              <div className="h-5 bg-muted rounded w-12" />
              <div className="h-5 bg-muted rounded w-16" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted rounded-md">
              <div className="text-center">
                <div className="h-6 bg-card rounded mb-1" />
                <div className="h-3 bg-card rounded" />
              </div>
              <div className="text-center">
                <div className="h-6 bg-card rounded mb-1" />
                <div className="h-3 bg-card rounded" />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <div className="h-8 bg-muted rounded w-16" />
                <div className="h-8 bg-muted rounded w-8" />
                <div className="h-8 bg-muted rounded w-8" />
              </div>
              <div className="h-8 bg-muted rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks?.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="ClipboardList" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">No Tasks Found</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          It looks like there are no tasks matching your filters. Try creating one!
        </p>
      </div>
    );
  }

  const activeTasks = tasks?.filter(task => !task?.completed);
  const completedTasks = tasks?.filter(task => task?.completed);

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTasks?.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Clock" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Active Tasks ({activeTasks?.length})
            </h3>
          </div>
          <div className="space-y-4">
            {activeTasks?.map((task, index) => (
              <div key={task.id} className="animate-list-item-in" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
                <TaskCard
                  task={task}
                  availableTags={availableTags}
                  isActiveStopwatch={activeStopwatchTaskId === task?.id}
                  onStartStopwatch={onStartStopwatch}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  onCompleteTask={onCompleteTask}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Completed Tasks */}
      {completedTasks?.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <h3 className="text-lg font-semibold text-foreground">
              Completed Tasks ({completedTasks?.length})
            </h3>
          </div>
          <div className="space-y-4">
            {completedTasks?.map((task, index) => (
              <div key={task.id} className="animate-list-item-in" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
                <TaskCard
                  task={task}
                  availableTags={availableTags}
                  isActiveStopwatch={false}
                  onStartStopwatch={onStartStopwatch}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  onCompleteTask={onCompleteTask}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
