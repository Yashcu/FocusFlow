"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/icons";
import { Loader2, Orbit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    if (provider === "google") {
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle();
        // Redirect will be handled by Firebase
      } catch (error: any) {
        toast({
          title: "Google Login Failed",
          description:
            error.message || "Could not log in with Google. Please try again.",
          variant: "destructive",
        });
        setIsGoogleLoading(false);
      }
    }
  };

  const handleFeatureNotImplemented = (feature: string) => {
    toast({
      title: "Feature Not Implemented",
      description: `The "${feature}" feature is not yet available.`,
    });
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
                onClick={() => handleSocialLogin("google")}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
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
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFeatureNotImplemented("Forgot Password");
                    }}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
