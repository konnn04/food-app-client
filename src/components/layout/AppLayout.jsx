import React from 'react';
import useAuth from '@/hooks/useAuth';
import DesktopNavbar from './DesktopNavbar';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';

export default function AppLayout({ children, notificationCount = 5 }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return children; // Không có layout cho trang auth
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Navigation */}
      <DesktopNavbar notificationCount={notificationCount} />
      
      {/* Mobile Header */}
      <MobileHeader notificationCount={notificationCount} />
      
      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}