import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalHeader from '../ui/GlobalHeader';
import SidebarNavigation from '../ui/SidebarNavigation';
import MobileMenuOverlay from '../ui/MobileMenuOverlay';

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <SidebarNavigation
        isCollapsed={isSidebarCollapsed}
        onCollapse={handleSidebarToggle}
      />

      <main id="main-content" className={`pt-16 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <div className="p-6 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
