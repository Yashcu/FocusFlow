import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditTaskModal = ({ task, isOpen, onClose, onUpdateTask, availableTags, onCreateTag }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    tags: []
  });
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);

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

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        name: task?.name,
        description: task?.description || '',
        priority: task?.priority,
        tags: task?.tags || []
      });
      setErrors({});
      firstFocusableElementRef.current?.focus();
    }
  }, [task, isOpen]);

  // Focus trapping logic
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      } else if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Task name is required';
    if (formData?.name?.length > 100) newErrors.name = 'Task name must be less than 100 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    const updatedTask = {
      ...task,
      name: formData?.name?.trim(),
      description: formData?.description?.trim(),
      priority: formData?.priority,
      tags: formData?.tags,
      updatedAt: new Date()
    };

    onUpdateTask(updatedTask);
    onClose();
  };

  const handleCreateNewTag = () => {
    if (!newTagName?.trim()) return;
    const newTag = {
      id: Date.now()?.toString(),
      name: newTagName?.trim(),
      color: `#${Math.floor(Math.random()*16777215)?.toString(16)}`
    };
    onCreateTag(newTag);
    setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.id] }));
    setNewTagName('');
    setShowNewTagInput(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="edit-task-title">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div ref={modalRef} className="relative bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="edit-task-title" className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Edit" size={20} className="text-primary" />
              <span>Edit Task</span>
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close dialog">
              <Icon name="X" size={20} />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={firstFocusableElementRef}
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
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Add task description (optional)..."
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1">{formData?.description?.length}/500 characters</div>
            </div>
            <Select label="Priority Level" options={priorityOptions} value={formData?.priority} onChange={(value) => handleInputChange('priority', value)} />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">Tags</label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewTagInput(!showNewTagInput)} iconName="Tag" iconPosition="left">New Tag</Button>
              </div>
              {showNewTagInput && (
                <div className="flex space-x-2 mb-3">
                  <Input type="text" placeholder="Tag name..." value={newTagName} onChange={(e) => setNewTagName(e.target.value)} className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={handleCreateNewTag} disabled={!newTagName.trim()} iconName="Check" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setShowNewTagInput(false); setNewTagName(''); }} iconName="X" />
                </div>
              )}
              <Select options={tagOptions} value={formData?.tags} onChange={(value) => handleInputChange('tags', value)} multiple searchable placeholder="Select tags..." description="Choose existing tags or create new ones" />
            </div>
            <div className="flex space-x-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
              <Button type="submit" variant="default" className="flex-1" iconName="Save" iconPosition="left" disabled={!formData?.name?.trim()}>Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
