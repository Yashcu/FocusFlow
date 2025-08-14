import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({
  task,
  availableTags,
  isActiveStopwatch,
  onStartStopwatch,
  onEditTask,
  onDeleteTask,
  onCompleteTask
}) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return `0m`;
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'urgent': return { icon: 'AlertTriangle', color: 'text-red-600 bg-red-100 border-red-200' };
      case 'high': return { icon: 'ChevronsUp', color: 'text-orange-600 bg-orange-100 border-orange-200' };
      case 'medium': return { icon: 'Equal', color: 'text-blue-600 bg-blue-100 border-blue-200' };
      case 'low': return { icon: 'ChevronsDown', color: 'text-gray-600 bg-gray-100 border-gray-200' };
      default: return { icon: 'Minus', color: 'text-gray-600 bg-gray-100 border-gray-200' };
    }
  };

  const priorityInfo = getPriorityInfo(task?.priority);

  const getTaskTags = () => {
    return task?.tags?.map(tagId =>
      availableTags?.find(tag => tag?.id === tagId)
    )?.filter(Boolean) || [];
  };

  return (
    <div className={`bg-card rounded-lg border p-4 transition-all duration-300 ${
      isActiveStopwatch
        ? 'border-primary shadow-elevation-2 ring-2 ring-primary/20'
        : 'border-border hover:shadow-elevation-1 hover:-translate-y-1'
    } ${task?.completed ? 'bg-muted/50 opacity-70' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-4">
          <h3 className={`font-semibold text-foreground ${
            task?.completed ? 'line-through text-muted-foreground' : ''
          }`}>
            {task?.name}
          </h3>
        </div>
        <div className={`flex-shrink-0 px-2.5 py-1 rounded-full border text-xs font-medium ${priorityInfo.color}`}>
          <div className="flex items-center space-x-1">
            <Icon name={priorityInfo.icon} size={12} />
            <span className="capitalize">{task?.priority}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {task?.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task?.description}
        </p>
      )}

      {/* Tags */}
      {getTaskTags().length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {getTaskTags().map(tag => (
            <span
              key={tag?.id}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
              style={{ backgroundColor: `${tag?.color}20`, color: tag?.color }}
            >
              {tag?.name}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
          <Icon name="Clock" size={16} className="text-primary"/>
          <div>
            <div className="text-sm font-semibold text-foreground">{formatTime(task?.totalTime)}</div>
            <div className="text-xs text-muted-foreground">Time Tracked</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
          <Icon name="Repeat" size={16} className="text-secondary"/>
          <div>
            <div className="text-sm font-semibold text-foreground">{task?.sessionCount}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditTask(task)}
            disabled={task?.completed}
            iconName="Edit"
            className="h-8 w-8"
            aria-label={`Edit task ${task.name}`}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteTask(task?.id)}
            iconName="Trash2"
            className="text-destructive hover:text-destructive h-8 w-8"
            aria-label={`Delete task ${task.name}`}
          />
        </div>

        <div className="flex items-center space-x-2">
          {!task?.completed ? (
             <Button
                variant="success"
                size="sm"
                onClick={() => onCompleteTask(task?.id)}
                iconName="Check"
                aria-label={`Complete task ${task.name}`}
              >
                Complete
              </Button>
          ) : (
            <div className="flex items-center space-x-2 text-sm font-medium text-success">
                <Icon name="CheckCircle" size={16} />
                <span>Completed</span>
            </div>
          )}
          <Button
            variant={isActiveStopwatch ? "default" : "outline"}
            size="sm"
            onClick={() => onStartStopwatch(task)}
            disabled={task?.completed}
            iconName={isActiveStopwatch ? "Pause" : "Play"}
            iconPosition="left"
            className={`w-28 ${isActiveStopwatch ? 'animate-pulse-soft' : ''}`}
            aria-label={isActiveStopwatch ? `Pause tracking for ${task.name}` : `Start tracking for ${task.name}`}
          >
            {isActiveStopwatch ? 'Tracking' : 'Start'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
