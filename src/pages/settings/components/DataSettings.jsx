import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataSettings = () => {
  const [exportSettings, setExportSettings] = useState({
    includePersonalInfo: true,
    includeTasks: true,
    includeSessions: true,
    includeTags: true,
    includeAnalytics: false,
    dateRange: 'all', // all, last30, last90, custom
    format: 'csv' // csv, json, excel
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'weekly', // daily, weekly, monthly
    cloudSync: false,
    localBackup: true,
    retentionDays: 90
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: false,
    allowCookies: true,
    trackUsage: true,
    dataRetention: 365 // days
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    
    // Mock export functionality
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock data based on settings
    const exportData = {
      exportDate: new Date()?.toISOString(),
      settings: exportSettings,
      ...(exportSettings?.includePersonalInfo && {
        profile: {
          name: "Alex Johnson",
          email: "alex.johnson@example.com",
          timezone: "America/New_York"
        }
      }),
      ...(exportSettings?.includeTasks && {
        tasks: [
          { id: 1, title: "Implement user authentication", status: "completed" },
          { id: 2, title: "Design dashboard layout", status: "in-progress" }
        ]
      }),
      ...(exportSettings?.includeSessions && {
        sessions: [
          { id: 1, taskId: 1, duration: 3600, date: "2025-01-10" },
          { id: 2, taskId: 2, duration: 2400, date: "2025-01-10" }
        ]
      }),
      ...(exportSettings?.includeTags && {
        tags: [
          { id: 1, name: "Frontend", color: "#3B82F6" },
          { id: 2, name: "Backend", color: "#10B981" }
        ]
      })
    };

    // Create and download file
    const dataStr = exportSettings?.format === 'json' 
      ? JSON.stringify(exportData, null, 2)
      : convertToCSV(exportData);
    
    const dataBlob = new Blob([dataStr], { 
      type: exportSettings.format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusflow-export-${new Date()?.toISOString()?.split('T')?.[0]}.${exportSettings?.format}`;
    link?.click();
    
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const convertToCSV = (data) => {
    // Simple CSV conversion for demo
    let csv = "Type,Data\n";
    if (data?.profile) {
      csv += `Profile,"${JSON.stringify(data?.profile)?.replace(/"/g, '""')}"\n`;
    }
    if (data?.tasks) {
      data?.tasks?.forEach(task => {
        csv += `Task,"${task?.title}","${task?.status}"\n`;
      });
    }
    return csv;
  };

  const handleBackupData = async () => {
    setIsBackingUp(true);
    
    // Mock backup functionality
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert("Data backup completed successfully!");
    setIsBackingUp(false);
  };

  const handleDeleteAllData = () => {
    const confirmation = window.prompt(
      'This will permanently delete all your data. Type "DELETE" to confirm:'
    );
    
    if (confirmation === "DELETE") {
      alert("All data has been deleted. You will be redirected to the login page.");
      // In a real app, this would clear all data and redirect
    }
  };

  const dataSize = "24.7 MB"; // Mock data size
  const lastBackup = "January 8, 2025 at 3:42 PM";

  return (
    <div className="space-y-8">
      {/* Data Export */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
            <p className="text-sm text-muted-foreground">Download your productivity data</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Export Options */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">What to include</h4>
            <div className="space-y-3">
              <Checkbox
                label="Personal information"
                description="Profile details, preferences, and settings"
                checked={exportSettings?.includePersonalInfo}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  includePersonalInfo: e?.target?.checked
                }))}
              />
              
              <Checkbox
                label="Tasks and projects"
                description="All tasks, descriptions, and completion status"
                checked={exportSettings?.includeTasks}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  includeTasks: e?.target?.checked
                }))}
              />
              
              <Checkbox
                label="Time tracking sessions"
                description="Detailed session logs with timestamps and durations"
                checked={exportSettings?.includeSessions}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  includeSessions: e?.target?.checked
                }))}
              />
              
              <Checkbox
                label="Tags and categories"
                description="Custom tags and their configurations"
                checked={exportSettings?.includeTags}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  includeTags: e?.target?.checked
                }))}
              />
              
              <Checkbox
                label="Analytics and insights"
                description="Productivity metrics and generated reports"
                checked={exportSettings?.includeAnalytics}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  includeAnalytics: e?.target?.checked
                }))}
              />
            </div>
          </div>

          {/* Export Format */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Export format</h4>
            <div className="flex space-x-4">
              {[
                { value: 'csv', label: 'CSV', description: 'Spreadsheet compatible' },
                { value: 'json', label: 'JSON', description: 'Developer friendly' },
                { value: 'excel', label: 'Excel', description: 'Microsoft Excel format' }
              ]?.map(format => (
                <label key={format?.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format?.value}
                    checked={exportSettings?.format === format?.value}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      format: e?.target?.value
                    }))}
                    className="w-4 h-4 text-primary bg-input border-border focus:ring-ring"
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{format?.label}</div>
                    <div className="text-xs text-muted-foreground">{format?.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Date range</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'all', label: 'All time' },
                { value: 'last30', label: 'Last 30 days' },
                { value: 'last90', label: 'Last 90 days' },
                { value: 'custom', label: 'Custom range' }
              ]?.map(range => (
                <label key={range?.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateRange"
                    value={range?.value}
                    checked={exportSettings?.dateRange === range?.value}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      dateRange: e?.target?.value
                    }))}
                    className="w-4 h-4 text-primary bg-input border-border focus:ring-ring"
                  />
                  <span className="text-sm text-foreground">{range?.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleExportData}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
            >
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </div>
      {/* Backup Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Backup & Sync</h3>
            <p className="text-sm text-muted-foreground">Keep your data safe and synchronized</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">Current data size</div>
              <div className="text-xs text-muted-foreground">Last backup: {lastBackup}</div>
            </div>
            <div className="text-lg font-semibold text-foreground">{dataSize}</div>
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Automatic backups"
              description="Regularly backup your data to prevent loss"
              checked={backupSettings?.autoBackup}
              onChange={(e) => setBackupSettings(prev => ({
                ...prev,
                autoBackup: e?.target?.checked
              }))}
            />

            {backupSettings?.autoBackup && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Backup frequency
                  </label>
                  <select
                    value={backupSettings?.backupFrequency}
                    onChange={(e) => setBackupSettings(prev => ({
                      ...prev,
                      backupFrequency: e?.target?.value
                    }))}
                    className="w-full max-w-xs px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            )}

            <Checkbox
              label="Cloud synchronization"
              description="Sync data across devices (requires account)"
              checked={backupSettings?.cloudSync}
              onChange={(e) => setBackupSettings(prev => ({
                ...prev,
                cloudSync: e?.target?.checked
              }))}
            />

            <Checkbox
              label="Local backup"
              description="Store backups locally on this device"
              checked={backupSettings?.localBackup}
              onChange={(e) => setBackupSettings(prev => ({
                ...prev,
                localBackup: e?.target?.checked
              }))}
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={handleBackupData}
              loading={isBackingUp}
              iconName="Shield"
              iconPosition="left"
            >
              {isBackingUp ? "Backing up..." : "Backup Now"}
            </Button>
          </div>
        </div>
      </div>
      {/* Privacy & Data Retention */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Lock" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Privacy & Retention</h3>
            <p className="text-sm text-muted-foreground">Control how your data is used and stored</p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Share anonymous analytics"
            description="Help improve FocusFlow by sharing usage statistics"
            checked={privacySettings?.shareAnalytics}
            onChange={(e) => setPrivacySettings(prev => ({
              ...prev,
              shareAnalytics: e?.target?.checked
            }))}
          />

          <Checkbox
            label="Allow cookies"
            description="Enable cookies for better user experience"
            checked={privacySettings?.allowCookies}
            onChange={(e) => setPrivacySettings(prev => ({
              ...prev,
              allowCookies: e?.target?.checked
            }))}
          />

          <Checkbox
            label="Usage tracking"
            description="Track feature usage to improve the application"
            checked={privacySettings?.trackUsage}
            onChange={(e) => setPrivacySettings(prev => ({
              ...prev,
              trackUsage: e?.target?.checked
            }))}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Data retention period
            </label>
            <select
              value={privacySettings?.dataRetention}
              onChange={(e) => setPrivacySettings(prev => ({
                ...prev,
                dataRetention: parseInt(e?.target?.value)
              }))}
              className="w-full max-w-xs px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={90}>3 months</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
              <option value={-1}>Forever</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              How long to keep your data before automatic deletion
            </p>
          </div>
        </div>
      </div>
      {/* Danger Zone */}
      <div className="bg-card rounded-lg border border-destructive p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Irreversible actions that affect your data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <div>
              <div className="text-sm font-medium text-foreground">Delete all data</div>
              <div className="text-xs text-muted-foreground">
                Permanently remove all tasks, sessions, and personal data
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAllData}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete All Data
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="inline mr-1" />
            This action cannot be undone. Make sure to export your data first if needed.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;