/* eslint-disable no-unused-vars */
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logoImg from '../../assets/logo.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

export default function MobileHeader({ notificationCount = 0 }) {
  const { currentUser } = useAuth();

  return (
    <header className="md:hidden bg-background shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={logoImg} alt="Logo" className="h-8 w-8" />
        <span className="text-lg font-bold text-foreground">FoodApp</span>
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </Badge>
        )}
      </Button>
    </header>
  );
}