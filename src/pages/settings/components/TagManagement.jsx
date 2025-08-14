import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TagManagement = () => {
  const [tags, setTags] = useState([
    {
      id: 1,
      name: "Frontend",
      color: "#3B82F6",
      description: "React, Vue, Angular development",
      sessionCount: 45,
      totalTime: 28800, // seconds
      createdAt: "2024-11-15"
    },
    {
      id: 2,
      name: "Backend",
      color: "#10B981",
      description: "Node.js, Python, API development",
      sessionCount: 32,
      totalTime: 21600,
      createdAt: "2024-11-20"
    },
    {
      id: 3,
      name: "Database",
      color: "#F59E0B",
      description: "SQL, MongoDB, database design",
      sessionCount: 18,
      totalTime: 14400,
      createdAt: "2024-12-01"
    },
    {
      id: 4,
      name: "Testing",
      color: "#EF4444",
      description: "Unit tests, integration tests",
      sessionCount: 12,
      totalTime: 7200,
      createdAt: "2024-12-05"
    },
    {
      id: 5,
      name: "DevOps",
      color: "#8B5CF6",
      description: "CI/CD, Docker, deployment",
      sessionCount: 8,
      totalTime: 5400,
      createdAt: "2024-12-08"
    },
    {
      id: 6,
      name: "Learning",
      color: "#06B6D4",
      description: "Research, tutorials, documentation",
      sessionCount: 25,
      totalTime: 18000,
      createdAt: "2024-11-10"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [newTag, setNewTag] = useState({
    name: "",
    color: "#3B82F6",
    description: ""
  });

  const colorOptions = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16",
    "#F97316", "#6366F1", "#14B8A6", "#F43F5E"
  ];

  const filteredTags = tags?.filter(tag =>
    tag?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    tag?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleCreateTag = () => {
    if (!newTag?.name?.trim()) return;

    const tag = {
      id: Date.now(),
      name: newTag?.name?.trim(),
      color: newTag?.color,
      description: newTag?.description?.trim(),
      sessionCount: 0,
      totalTime: 0,
      createdAt: new Date()?.toISOString()?.split('T')?.[0]
    };

    setTags(prev => [...prev, tag]);
    setNewTag({ name: "", color: "#3B82F6", description: "" });
    setIsCreating(false);
  };

  const handleEditTag = (tag) => {
    setEditingTag({ ...tag });
  };

  const handleSaveEdit = () => {
    setTags(prev => prev?.map(tag => 
      tag?.id === editingTag?.id ? editingTag : tag
    ));
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId) => {
    if (window.confirm("Are you sure you want to delete this tag? This action cannot be undone.")) {
      setTags(prev => prev?.filter(tag => tag?.id !== tagId));
      setSelectedTags(prev => prev?.filter(id => id !== tagId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedTags?.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedTags?.length} tag(s)? This action cannot be undone.`)) {
      setTags(prev => prev?.filter(tag => !selectedTags?.includes(tag?.id)));
      setSelectedTags([]);
    }
  };

  const handleSelectTag = (tagId) => {
    setSelectedTags(prev => 
      prev?.includes(tagId) 
        ? prev?.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTags?.length === filteredTags?.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags?.map(tag => tag?.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tag Management</h3>
          <p className="text-sm text-muted-foreground">
            Organize your tasks with custom tags and track time by category
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsCreating(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Create Tag
        </Button>
      </div>
      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        
        {selectedTags?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedTags?.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Selected
            </Button>
          </div>
        )}
      </div>
      {/* Create Tag Form */}
      {isCreating && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-md font-medium text-foreground mb-4">Create New Tag</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tag Name"
                type="text"
                value={newTag?.name}
                onChange={(e) => setNewTag(prev => ({ ...prev, name: e?.target?.value }))}
                placeholder="Enter tag name"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions?.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewTag(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newTag?.color === color ? 'border-foreground scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Input
              label="Description (Optional)"
              type="text"
              value={newTag?.description}
              onChange={(e) => setNewTag(prev => ({ ...prev, description: e?.target?.value }))}
              placeholder="Brief description of this tag"
            />

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewTag({ name: "", color: "#3B82F6", description: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleCreateTag}
                disabled={!newTag?.name?.trim()}
                iconName="Plus"
                iconPosition="left"
              >
                Create Tag
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Tags List */}
      <div className="bg-card rounded-lg border border-border">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedTags?.length === filteredTags?.length && filteredTags?.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
            />
            <div className="grid grid-cols-12 gap-4 flex-1 text-sm font-medium text-muted-foreground">
              <div className="col-span-4">Tag</div>
              <div className="col-span-3 hidden md:block">Description</div>
              <div className="col-span-2">Sessions</div>
              <div className="col-span-2">Total Time</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="divide-y divide-border">
          {filteredTags?.map(tag => (
            <div key={tag?.id} className="px-6 py-4">
              {editingTag && editingTag?.id === tag?.id ? (
                // Edit Mode
                (<div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tag Name"
                      type="text"
                      value={editingTag?.name}
                      onChange={(e) => setEditingTag(prev => ({ ...prev, name: e?.target?.value }))}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions?.map(color => (
                          <button
                            key={color}
                            onClick={() => setEditingTag(prev => ({ ...prev, color }))}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              editingTag?.color === color ? 'border-foreground scale-110' : 'border-border'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Input
                    label="Description"
                    type="text"
                    value={editingTag?.description}
                    onChange={(e) => setEditingTag(prev => ({ ...prev, description: e?.target?.value }))}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTag(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveEdit}
                      iconName="Save"
                      iconPosition="left"
                    >
                      Save
                    </Button>
                  </div>
                </div>)
              ) : (
                // View Mode
                (<div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedTags?.includes(tag?.id)}
                    onChange={() => handleSelectTag(tag?.id)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                  />
                  <div className="grid grid-cols-12 gap-4 flex-1">
                    <div className="col-span-4 flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag?.color }}
                      />
                      <div>
                        <div className="font-medium text-foreground">{tag?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(tag.createdAt)?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-3 hidden md:block">
                      <div className="text-sm text-muted-foreground">
                        {tag?.description || "No description"}
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-foreground">
                        {tag?.sessionCount}
                      </div>
                      <div className="text-xs text-muted-foreground">sessions</div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-foreground">
                        {formatTime(tag?.totalTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">tracked</div>
                    </div>
                    
                    <div className="col-span-1 flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTag(tag)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTag(tag?.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>)
              )}
            </div>
          ))}
        </div>

        {filteredTags?.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Icon name="Tag" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? "No tags found" : "No tags yet"}
            </h4>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" :"Create your first tag to start organizing your tasks"
              }
            </p>
            {!searchTerm && (
              <Button
                variant="default"
                onClick={() => setIsCreating(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Your First Tag
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Tag" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{tags?.length}</div>
              <div className="text-sm text-muted-foreground">Total Tags</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {formatTime(tags?.reduce((sum, tag) => sum + tag?.totalTime, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Tracked</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {tags?.reduce((sum, tag) => sum + tag?.sessionCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManagement;