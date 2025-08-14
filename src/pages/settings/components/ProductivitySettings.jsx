import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductivitySettings = () => {
  const [settings, setSettings] = useState({
    dailyGoal: 8,
    workStartTime: "09:00",
    workEndTime: "17:00",
    pomodoroWorkDuration: 25,
    pomodoroShortBreak: 5,
    pomodoroLongBreak: 15,
    pomodoroLongBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    soundNotifications: true,
    desktopNotifications: true,
    emailDigest: true,
    weeklyReport: true,
    reminderFrequency: 30,
    idleDetection: true,
    idleThreshold: 5,
    trackWeekends: false,
    showProductivityScore: true
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const handleResetDefaults = () => {
    setSettings({
      dailyGoal: 8,
      workStartTime: "09:00",
      workEndTime: "17:00",
      pomodoroWorkDuration: 25,
      pomodoroShortBreak: 5,
      pomodoroLongBreak: 15,
      pomodoroLongBreakInterval: 4,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      soundNotifications: true,
      desktopNotifications: true,
      emailDigest: true,
      weeklyReport: true,
      reminderFrequency: 30,
      idleDetection: true,
      idleThreshold: 5,
      trackWeekends: false,
      showProductivityScore: true
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Daily Goals */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Daily Goals</h3>
            <p className="text-sm text-muted-foreground">Set your productivity targets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Daily Work Goal (hours)"
            type="number"
            value={settings?.dailyGoal}
            onChange={(e) => handleSettingChange('dailyGoal', parseInt(e?.target?.value))}
            min="1"
            max="16"
            description="Target hours of focused work per day"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Work Start Time"
                type="time"
                value={settings?.workStartTime}
                onChange={(e) => handleSettingChange('workStartTime', e?.target?.value)}
              />
              <Input
                label="Work End Time"
                type="time"
                value={settings?.workEndTime}
                onChange={(e) => handleSettingChange('workEndTime', e?.target?.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Checkbox
            label="Track weekends"
            description="Include Saturday and Sunday in productivity tracking"
            checked={settings?.trackWeekends}
            onChange={(e) => handleSettingChange('trackWeekends', e?.target?.checked)}
          />

          <Checkbox
            label="Show productivity score"
            description="Display daily productivity score based on goals achieved"
            checked={settings?.showProductivityScore}
            onChange={(e) => handleSettingChange('showProductivityScore', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Pomodoro Timer */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Timer" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pomodoro Timer</h3>
            <p className="text-sm text-muted-foreground">Configure your focus sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            label="Work Duration (min)"
            type="number"
            value={settings?.pomodoroWorkDuration}
            onChange={(e) => handleSettingChange('pomodoroWorkDuration', parseInt(e?.target?.value))}
            min="15"
            max="60"
          />

          <Input
            label="Short Break (min)"
            type="number"
            value={settings?.pomodoroShortBreak}
            onChange={(e) => handleSettingChange('pomodoroShortBreak', parseInt(e?.target?.value))}
            min="3"
            max="15"
          />

          <Input
            label="Long Break (min)"
            type="number"
            value={settings?.pomodoroLongBreak}
            onChange={(e) => handleSettingChange('pomodoroLongBreak', parseInt(e?.target?.value))}
            min="15"
            max="30"
          />

          <Input
            label="Long Break After"
            type="number"
            value={settings?.pomodoroLongBreakInterval}
            onChange={(e) => handleSettingChange('pomodoroLongBreakInterval', parseInt(e?.target?.value))}
            min="2"
            max="8"
            description="Pomodoros"
          />
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Auto-start breaks"
            description="Automatically start break timers after work sessions"
            checked={settings?.autoStartBreaks}
            onChange={(e) => handleSettingChange('autoStartBreaks', e?.target?.checked)}
          />

          <Checkbox
            label="Auto-start pomodoros"
            description="Automatically start work sessions after breaks"
            checked={settings?.autoStartPomodoros}
            onChange={(e) => handleSettingChange('autoStartPomodoros', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Notifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Stay informed about your progress</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Checkbox
              label="Sound notifications"
              description="Play sounds for timer completions and reminders"
              checked={settings?.soundNotifications}
              onChange={(e) => handleSettingChange('soundNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Desktop notifications"
              description="Show browser notifications for important events"
              checked={settings?.desktopNotifications}
              onChange={(e) => handleSettingChange('desktopNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Daily email digest"
              description="Receive a summary of your daily productivity"
              checked={settings?.emailDigest}
              onChange={(e) => handleSettingChange('emailDigest', e?.target?.checked)}
            />

            <Checkbox
              label="Weekly report"
              description="Get detailed weekly productivity insights"
              checked={settings?.weeklyReport}
              onChange={(e) => handleSettingChange('weeklyReport', e?.target?.checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Reminder Frequency (minutes)"
              type="number"
              value={settings?.reminderFrequency}
              onChange={(e) => handleSettingChange('reminderFrequency', parseInt(e?.target?.value))}
              min="5"
              max="120"
              description="How often to remind about inactive sessions"
            />
          </div>
        </div>
      </div>
      {/* Idle Detection */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="MousePointer" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Idle Detection</h3>
            <p className="text-sm text-muted-foreground">Automatically pause tracking when inactive</p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Enable idle detection"
            description="Pause time tracking when no activity is detected"
            checked={settings?.idleDetection}
            onChange={(e) => handleSettingChange('idleDetection', e?.target?.checked)}
          />

          {settings?.idleDetection && (
            <Input
              label="Idle Threshold (minutes)"
              type="number"
              value={settings?.idleThreshold}
              onChange={(e) => handleSettingChange('idleThreshold', parseInt(e?.target?.value))}
              min="1"
              max="30"
              description="Minutes of inactivity before pausing"
              className="max-w-xs"
            />
          )}
        </div>
      </div>
      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-between bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="AlertCircle" size={16} />
            <span>You have unsaved changes</span>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveSettings}
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivitySettings;