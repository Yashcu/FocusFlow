"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { updateUserProfile } from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { uploadImageToCloudinary } from "../actions";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, loading, profile, setProfile } = useAuth();
  if (loading || !user || !profile) {
    return <Skeleton />;
  }
  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const [timezone, setTimezone] = useState(
    profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [showUploadSuccessDialog, setShowUploadSuccessDialog] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setDailyGoal(profile.dailyGoal || 5);
      setTimezone(
        profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      );
    }
  }, [profile]);

  if (loading || (!loading && !profile)) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Separator />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-9 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Separator />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-36" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveChanges = async () => {
    if (!user || !profile) return;
    setIsSaving(true);
    try {
      const updatedProfileData = { name, dailyGoal, timezone };
      await updateUserProfile(user.uid, updatedProfileData);

      setProfile((p) => (p ? { ...p, ...updatedProfileData } : null));

      toast({
        title: "Profile Updated",
        description: "Your changes have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsUploading(true);

    try {
      // Create FormData to send the file to the server action
      const formData = new FormData();
      formData.append("file", file); // 'file' here matches the 'file' key in the server action

      // Call the server action to upload to Cloudinary
      const result = await uploadImageToCloudinary(formData); // <--- CHANGE IS HERE

      if (result.error) {
        throw new Error(result.error); // Propagate error from server action
      }

      const photoURL = result.url; // Get the URL from the server action's result

      // Update user profile in Firestore with the new Cloudinary URL
      if (photoURL) {
        await updateUserProfile(user.uid, { photoURL }); //
        setProfile((p) => (p ? { ...p, photoURL } : null));
        setShowUploadSuccessDialog(true);
      } else {
        throw new Error("Cloudinary URL not received.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload Failed",
        description:
          error.message || "Could not upload your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !profile || !profile.photoURL) return;

    setIsDeletingAvatar(true);
    try {
      await updateUserProfile(user.uid, { photoURL: null });
      setProfile((p) => (p ? { ...p, photoURL: null } : null));

      toast({
        title: "Profile Picture Removed",
        description: "Your profile picture has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast({
        title: "Deletion Failed",
        description: "Could not remove your profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Your new password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordChanging(true);
    try {
      if (user.email && currentPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      } else {
        toast({
          title: "Re-authentication Required",
          description: "Please provide your current password.",
          variant: "destructive",
        });
        setIsPasswordChanging(false);
        return;
      }

      await updatePassword(user, newPassword);

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      let errorMessage = "Failed to change password. Please try again.";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Your current password is incorrect.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found or credentials invalid.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please log out and log in again to change your password.";
      }
      toast({
        title: "Password Change Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

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
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profile.photoURL || "https://placehold.co/80x80.png"}
                    data-ai-hint="female avatar"
                  />
                  <AvatarFallback>{(name || "U").charAt(0)}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                {/* Modified: Use flex-col and adjust button width for alignment */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={triggerFileSelect}
                    disabled={isUploading || isDeletingAvatar}
                    className="w-full justify-start" // <--- ADD w-full justify-start for consistent width and left-alignment
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                  {profile.photoURL && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAvatar}
                      disabled={isDeletingAvatar || isUploading}
                      className="w-full justify-start" // <--- ADD w-full justify-start for consistent width and left-alignment
                    >
                      {isDeletingAvatar ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" /> // <--- NEW: Add Trash2 icon
                      )}
                      Remove Photo
                    </Button>
                  )}
                </div>
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
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
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
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password. You'll need your current password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isPasswordChanging}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPasswordChanging}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={isPasswordChanging}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleChangePassword}
                disabled={isPasswordChanging}
              >
                {isPasswordChanging ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPasswordChanging ? "Changing..." : "Change Password"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Timezone</CardTitle>
              <CardDescription>
                Ensure your activities and streaks are tracked correctly based
                on your local time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="timezone-select">Your Timezone</Label>
                <Select
                  value={timezone}
                  onValueChange={setTimezone}
                  disabled={isSaving} // Disable while saving
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add common timezones. For a real app, you'd use a more comprehensive list. */}
                    <SelectItem value="America/New_York">
                      (GMT-04:00) Eastern Daylight Time (America/New_York)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      (GMT-07:00) Pacific Daylight Time (America/Los_Angeles)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      (GMT+01:00) British Summer Time (Europe/London)
                    </SelectItem>
                    <SelectItem value="Europe/Paris">
                      (GMT+02:00) Central European Summer Time (Europe/Paris)
                    </SelectItem>
                    <SelectItem value="Asia/Kolkata">
                      (GMT+05:30) India Standard Time (Asia/Kolkata)
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">
                      (GMT+09:00) Japan Standard Time (Asia/Tokyo)
                    </SelectItem>
                    <SelectItem value="Australia/Sydney">
                      (GMT+10:00) Australian Eastern Standard Time
                      (Australia/Sydney)
                    </SelectItem>
                    {/* You can add more timezones or use a library to generate them */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>
      <AlertDialog
        open={showUploadSuccessDialog}
        onOpenChange={setShowUploadSuccessDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Profile Picture Updated!</AlertDialogTitle>
            <AlertDialogDescription>
              Your new profile picture has been successfully uploaded and saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowUploadSuccessDialog(false)}
            >
              Great!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
