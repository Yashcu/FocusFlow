import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const AuthenticationLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Zap" size={24} color="white" />
            </div>
            <span className="text-2xl font-semibold text-foreground">FocusFlow</span>
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-xl shadow-elevation-2 p-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            &copy; 2025 FocusFlow. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLayout;
