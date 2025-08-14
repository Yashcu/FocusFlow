import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import ProfileSettings from './components/ProfileSettings';
import ProductivitySettings from './components/ProductivitySettings';
import TagManagement from './components/TagManagement';
import DataSettings from './components/DataSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User', description: 'Personal information and account settings' },
    { id: 'productivity', label: 'Productivity', icon: 'Target', description: 'Goals, timers, and work preferences' },
    { id: 'tags', label: 'Tags', icon: 'Tag', description: 'Manage task categories and labels' },
    { id: 'data', label: 'Data', icon: 'Database', description: 'Export, backup, and privacy settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'productivity': return <ProductivitySettings />;
      case 'tags': return <TagManagement />;
      case 'data': return <DataSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Customize your FocusFlow experience and manage your data
            </p>
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <aside className="lg:col-span-1">
          <nav className="space-y-2 sticky top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={20} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{tab.label}</div>
                  <p className={`text-xs ${activeTab === tab.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {tab.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
