import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MobileMenuOverlay = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and daily progress'
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: 'CheckSquare',
      description: 'Manage active tasks and time tracking'
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: 'BarChart3',
      description: 'Productivity insights and metrics'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings',
      description: 'Preferences and configuration'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location?.pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card shadow-elevation-3 animate-slide-in-from-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-foreground">FocusFlow</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close menu"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigationItems?.map((item) => {
              const isActive = isActivePath(item?.path);
              
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ease-out ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-subtle'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={24} 
                    className={`flex-shrink-0 ${isActive ? 'text-primary-foreground' : ''}`}
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-primary-foreground' : ''}`}>
                      {item?.label}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {item?.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center space-x-3 px-4 py-3 bg-muted rounded-lg">
              <Icon name="Clock" size={20} className="text-muted-foreground" />
              <div>
                <div className="font-medium text-sm text-foreground">Today's Focus</div>
                <div className="font-mono text-sm text-muted-foreground">4h 32m</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;