/* eslint-disable no-unused-vars */
import React from 'react';
import useAuth from '@/hooks/useAuth';
import logoImg from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileHeader({ notificationCount = 0 }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="md:hidden bg-background shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={logoImg} alt="Logo" className="h-8 w-8" />
        <span className="text-lg font-bold text-foreground">FoodApp</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Cart prominent button on mobile */}
        <Button variant="default" size="icon" className="relative bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/cart')}>
          <ShoppingCart className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 px-1 h-5 min-w-[1.25rem] flex items-center justify-center" variant="secondary">0</Badge>
        </Button>
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
      </div>
    </header>
  );
}