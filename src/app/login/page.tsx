'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/icons';
import { Loader2, Orbit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
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
} from '@/components/ui/alert-dialog';

import { auth } from '@/lib/firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { z } from 'zod';

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password cannot be empty.'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validatedData = loginSchema.parse({
        email,
        password,
      });

      await login(validatedData.email, validatedData.password);
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Input Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: isErrorWithMessage(error)
            ? error.message
            : 'Please check your credentials and try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    if (provider === 'google') {
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle();
        // Redirect will be handled by Firebase
      } catch (error: unknown) {
        toast({
          title: 'Google Login Failed',
          description: isErrorWithMessage(error)
            ? error.message
            : 'Could not log in with Google. Please try again.',
          variant: 'destructive',
        });
        setIsGoogleLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      const validatedData = forgotPasswordSchema.parse({
        email: forgotPasswordEmail,
      });

      setIsResettingPassword(true);
      await sendPasswordResetEmail(auth, validatedData.email);
      toast({
        title: 'Password Reset Email Sent',
        description:
          'Please check your inbox (and spam folder) for instructions.',
      });
      setShowForgotPasswordDialog(false);
      setForgotPasswordEmail('');
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        // Zod validation error
        toast({
          title: 'Input Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error Sending Reset Email',
          description: isErrorWithMessage(error)
            ? error.message
            : 'Could not send reset email. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Orbit className="h-8 w-8 mx-auto mb-2 text-primary" />
          <CardTitle className="text-2xl font-headline">
            Welcome to FocusFlow
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <AlertDialog
                    open={showForgotPasswordDialog}
                    onOpenChange={setShowForgotPasswordDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          setShowForgotPasswordDialog(true); // Open the dialog
                          setForgotPasswordEmail(email); // Pre-fill with login email if available
                        }}
                      >
                        Forgot your password?
                      </Link>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Password</AlertDialogTitle>
                        <AlertDialogDescription>
                          Enter the email address associated with your account,
                          and we&apos;ll send you a link to reset your password.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-2 py-4">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your-email@example.com"
                          value={forgotPasswordEmail}
                          onChange={(e) =>
                            setForgotPasswordEmail(e.target.value)
                          }
                          disabled={isResettingPassword}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isResettingPassword}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleForgotPassword}
                          disabled={isResettingPassword}
                        >
                          {isResettingPassword ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {isResettingPassword
                            ? 'Sending...'
                            : 'Send Reset Email'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
