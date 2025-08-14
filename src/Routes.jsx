import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

// Layouts & Utilities
import AppLayout from "components/layout/AppLayout";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page Imports using React.lazy
const Dashboard = lazy(() => import('pages/dashboard'));
const TasksPage = lazy(() => import('pages/tasks'));
const Analytics = lazy(() => import('pages/analytics'));
const Settings = lazy(() => import('pages/settings'));
const LoginPage = lazy(() => import('pages/login'));
const Register = lazy(() => import('pages/register'));
const NotFound = lazy(() => import("pages/NotFound"));

// Loading Spinner Component
const FullPageSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<FullPageSpinner />}>
          <RouterRoutes>
            {/* Routes with the main AppLayout (Header and Sidebar) */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Routes without the main layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
