'use client';

import { Button } from '@/components/ui/button';
import NextTopLoader from 'nextjs-toploader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  LineChart,
  Orbit,
  PanelLeft,
  Settings,
  Square,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import UserNav from '@/components/layout/user-nav';
import NavLink from '@/components/layout/nav-link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useAuth } from '@/context/auth-context';
import { TimerProvider, useTimer } from '@/context/timer-context';
import ErrorBoundary from '@/components/error-boundary';

function GlobalTimer() {
  const {
    isTimerActive,
    timerElapsedTime,
    activeTask,
    stopGlobalTimer,
    resetGlobalTimer,
    isTimerSaving,
  } = useTimer();

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  if (!isTimerActive || !activeTask) {
    return (
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          Start a focus session from the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-primary hidden md:inline">
          Focusing on:
        </span>
        <span className="font-medium truncate text-sm" title={activeTask.text}>
          {activeTask.text}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold font-headline tabular-nums text-primary">
          {formatTime(timerElapsedTime)}
        </span>
        <Button onClick={stopGlobalTimer} size="icon" disabled={isTimerSaving}>
          {isTimerSaving ? <Loader2 className="animate-spin" /> : <Square />}
          <span className="sr-only">Stop Timer</span>
        </Button>
        <Button
          onClick={resetGlobalTimer}
          variant="outline"
          size="icon"
          disabled={isTimerSaving}
        >
          <RotateCcw />
          <span className="sr-only">Reset Timer</span>
        </Button>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const navLinks = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Orbit className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <TimerProvider>
      <NextTopLoader color="#yourPrimaryColor" showSpinner={false} />
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Orbit className="h-6 w-6 text-primary" />
                <span className="font-headline">FocusFlow</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                {navLinks.map((link) => (
                  <NavLink
                    href={link.href}
                    icon={link.icon}
                    key={link.href}
                    isActive={isLinkActive(link.href)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <ErrorBoundary>
          <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <SheetHeader>
                    <SheetTitle>
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold"
                      >
                        <Orbit className="h-6 w-6 text-primary" />
                        <span className="">FocusFlow</span>
                      </Link>
                    </SheetTitle>
                    <SheetDescription>
                      Navigate through the app sections.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="grid gap-2 text-lg font-medium mt-4">
                    {navLinks.map((link) => (
                      <NavLink
                        href={link.href}
                        icon={link.icon}
                        key={link.href}
                        isActive={isLinkActive(link.href)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <GlobalTimer />

              <ThemeToggle />
              <UserNav />
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
              {children}
            </main>
          </div>
        </ErrorBoundary>
      </div>
    </TimerProvider>
  );
}
