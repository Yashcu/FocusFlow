import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SidebarNavigation = ({ isCollapsed = false, onCollapse }) => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Tasks', path: '/tasks', icon: 'CheckSquare' },
    { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ];

  const isActivePath = (path) => location.pathname === path || (path === '/dashboard' && location.pathname === '/');

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-sidebar border-r border-border/10 transition-all duration-300 ease-in-out hidden lg:flex flex-col ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`flex items-center border-b border-border/10 h-16 px-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold">FocusFlow</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="text-sidebar-foreground hover:bg-white/10 hover:text-white"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={isCollapsed ? "PanelRightOpen" : "PanelLeftOpen"} size={18} />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2" aria-label="Main Navigation">
        {navigationItems.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-white/10 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon name={item.icon} size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/10">
        <div className={`p-3 rounded-lg bg-white/5 text-sidebar-foreground ${isCollapsed ? 'text-center' : 'flex items-center space-x-3'}`}>
          <Icon name="Clock" size={isCollapsed ? 24 : 18} className={`${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && (
            <div className="text-xs">
              <div className="font-medium">Today's Focus</div>
              <div className="font-mono">4h 32m</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
