import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskCreationForm = ({ onCreateTask, availableTags, onCreateTag }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    tags: []
  });
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [errors, setErrors] = useState({});

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const tagOptions = availableTags?.map(tag => ({
    value: tag?.id,
    label: tag?.name,
    description: tag?.color
  }));

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Task name is required';
    }
    
    if (formData?.name?.length > 100) {
      newErrors.name = 'Task name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newTask = {
      id: Date.now()?.toString(),
      name: formData?.name?.trim(),
      description: formData?.description?.trim(),
      priority: formData?.priority,
      tags: formData?.tags,
      createdAt: new Date(),
      completed: false,
      totalTime: 0,
      sessionCount: 0
    };

    onCreateTask(newTask);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      tags: []
    });
    setErrors({});
  };

  const handleCreateNewTag = () => {
    if (!newTagName?.trim()) return;

    const newTag = {
      id: Date.now()?.toString(),
      name: newTagName?.trim(),
      color: `#${Math.floor(Math.random()*16777215)?.toString(16)}`
    };

    onCreateTag(newTag);
    setFormData(prev => ({
      ...prev,
      tags: [...prev?.tags, newTag?.id]
    }));
    
    setNewTagName('');
    setShowNewTagInput(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Plus" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Create New Task</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Name"
          type="text"
          placeholder="Enter task name..."
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
          maxLength={100}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={3}
            placeholder="Add task description (optional)..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {formData?.description?.length}/500 characters
          </div>
        </div>

        <Select
          label="Priority Level"
          options={priorityOptions}
          value={formData?.priority}
          onChange={(value) => handleInputChange('priority', value)}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Tags
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewTagInput(!showNewTagInput)}
              iconName="Tag"
              iconPosition="left"
            >
              New Tag
            </Button>
          </div>

          {showNewTagInput && (
            <div className="flex space-x-2 mb-3">
              <Input
                type="text"
                placeholder="Tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e?.target?.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateNewTag}
                disabled={!newTagName?.trim()}
                iconName="Check"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNewTagInput(false);
                  setNewTagName('');
                }}
                iconName="X"
              />
            </div>
          )}

          <Select
            options={tagOptions}
            value={formData?.tags}
            onChange={(value) => handleInputChange('tags', value)}
            multiple
            searchable
            placeholder="Select tags..."
            description="Choose existing tags or create new ones"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <Button
            type="submit"
            variant="default"
            fullWidth
            iconName="Plus"
            iconPosition="left"
            disabled={!formData?.name?.trim()}
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreationForm;