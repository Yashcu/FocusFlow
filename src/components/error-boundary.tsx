"use client"; // This component needs to run on the client-side

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; //
import { Button } from "@/components/ui/button"; //
import { TriangleAlert } from "lucide-react"; // Icon for the alert

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // This method is called after an error has been thrown by a descendant component.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  // This method is called after an error has been thrown.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo }); // Store errorInfo for display/logging
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          <Alert variant="destructive" className="w-full max-w-lg">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Something went wrong!</AlertTitle>
            <AlertDescription>
              We're sorry, an unexpected error occurred. Please try refreshing
              the page.
              {/* Optional: Show error details in development */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              )}
            </AlertDescription>
            <div className="mt-4 text-right">
              <Button
                onClick={() =>
                  this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                  })
                }
              >
                Try again
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
