'use client';

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
// --- FIXED: Imported UserProfile from the correct file ---
import { updateUserProfile, UserProfile } from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { uploadImageToCloudinary } from '@/server/actions/actions';

// --- Main Settings Page Component ---
export default function SettingsPage() {
  const { user, profile, setProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    dailyGoal: 5,
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        dailyGoal: profile.dailyGoal || 5,
      });
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: profileData.name,
        dailyGoal: profileData.dailyGoal,
      });
      setProfile((p) => (p ? { ...p, ...profileData } : null));
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been successfully saved.',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user || !profile) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard
            profile={profile}
            name={profileData.name}
            setName={(name) => setProfileData((prev) => ({ ...prev, name }))}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <GoalCard
            dailyGoal={profileData.dailyGoal}
            setDailyGoal={(dailyGoal) =>
              setProfileData((prev) => ({ ...prev, dailyGoal }))
            }
          />
          <PasswordCard />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}

// --- Sub-components for better organization ---
const SettingsSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Separator />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Skeleton className="h-[350px]" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-[180px]" />
        <Skeleton className="h-[320px]" />
      </div>
    </div>
  </div>
);

const ProfileCard = ({
  profile,
  name,
  setName,
}: {
  // --- FIXED: Explicitly typed the profile prop ---
  profile: UserProfile;
  name: string;
  setName: (name: string) => void;
}) => {
  const { user, setProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImageToCloudinary(formData);
      if (result.error) throw new Error(result.error);
      const photoURL = result.url;
      if (photoURL) {
        await updateUserProfile(user.uid, { photoURL });
        setProfile((p) => (p ? { ...p, photoURL } : null));
        toast({ title: 'Avatar updated!' });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Upload Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.photoURL || undefined} />
            <AvatarFallback>{(name || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email || ''} disabled />
        </div>
      </CardContent>
    </Card>
  );
};

const GoalCard = ({
  dailyGoal,
  setDailyGoal,
}: {
  dailyGoal: number;
  setDailyGoal: (value: number) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Daily Goal</CardTitle>
      <CardDescription>
        Set your daily coding target to stay motivated.
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="daily-goal" className="text-sm">
          Hours per day
        </Label>
        <span className="w-12 rounded-md bg-muted px-2 py-1 text-center text-lg font-bold font-headline">
          {dailyGoal}
        </span>
      </div>
      <Slider
        id="daily-goal"
        min={1}
        max={12}
        step={1}
        value={[dailyGoal]}
        onValueChange={(value) => setDailyGoal(value[0])}
      />
    </CardContent>
  </Card>
);

const PasswordCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({ title: 'Passwords Do Not Match', variant: 'destructive' });
      return;
    }
    setIsPasswordChanging(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      toast({ title: 'Password Changed Successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Password Change Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsPasswordChanging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your account password. Requires current password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handlePasswordChange}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((p) => ({
                  ...p,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData((p) => ({
                  ...p,
                  confirmNewPassword: e.target.value,
                }))
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPasswordChanging}>
            {isPasswordChanging && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Change Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
