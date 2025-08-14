import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';
import Select from '../../../components/ui/Select';

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    username: "alexj_dev",
    bio: "Full-stack developer passionate about productivity and clean code. Building amazing web applications with React and Node.js.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    timezone: "America/New_York",
    language: "en"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Mock save functionality
    setIsEditing(false);
    // Show success message
  };

  const handleChangePassword = () => {
    // Mock password change functionality
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsChangingPassword(false);
    alert("Password changed successfully!");
  };

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Asia/Shanghai", label: "China Standard Time (CST)" }
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "zh", label: "Chinese" }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            iconName={isEditing ? "X" : "Edit"}
            iconPosition="left"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={profileData?.avatar}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Icon name="Camera" size={16} color="white" />
                </button>
              )}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{profileData?.fullName}</h4>
              <p className="text-sm text-muted-foreground">@{profileData?.username}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              value={profileData?.fullName}
              onChange={(e) => handleProfileChange('fullName', e?.target?.value)}
              disabled={!isEditing}
              required
            />

            <Input
              label="Username"
              type="text"
              value={profileData?.username}
              onChange={(e) => handleProfileChange('username', e?.target?.value)}
              disabled={!isEditing}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={profileData?.email}
              onChange={(e) => handleProfileChange('email', e?.target?.value)}
              disabled={!isEditing}
              required
              className="md:col-span-2"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                value={profileData?.bio}
                onChange={(e) => handleProfileChange('bio', e?.target?.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <Select
              label="Timezone"
              options={timezones}
              value={profileData.timezone}
              onChange={(value) => handleProfileChange('timezone', value)}
              disabled={!isEditing}
            />

            <Select
              label="Language"
              options={languages}
              value={profileData.language}
              onChange={(value) => handleProfileChange('language', value)}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveProfile}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Password Change */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Password & Security</h3>
            <p className="text-sm text-muted-foreground">Keep your account secure with a strong password</p>
          </div>
          <Button
            variant={isChangingPassword ? "outline" : "secondary"}
            size="sm"
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            iconName={isChangingPassword ? "X" : "Lock"}
            iconPosition="left"
          >
            {isChangingPassword ? "Cancel" : "Change Password"}
          </Button>
        </div>

        {isChangingPassword && (
          <div className="space-y-4 animate-fade-in">
            <Input
              label="Current Password"
              type="password"
              value={passwordData?.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
              placeholder="Enter your current password"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData?.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
              placeholder="Enter your new password"
              description="Password must be at least 8 characters long"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData?.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
              placeholder="Confirm your new password"
              required
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleChangePassword}
                iconName="Shield"
                iconPosition="left"
              >
                Update Password
              </Button>
            </div>
          </div>
        )}

        {!isChangingPassword && (
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Icon name="ShieldCheck" size={16} />
            <span>Password last changed on December 15, 2024</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
