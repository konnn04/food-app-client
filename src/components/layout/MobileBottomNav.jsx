import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { 
  Home, 
  ShoppingCart, 
  User, 
  BarChart3, 
  ClipboardList, 
  Utensils, 
  Star,
  Search
} from 'lucide-react';

export default function MobileBottomNav() {
  const { currentUser, isCustomer } = useAuth();

  // Menu items cho từng role
  const getMenuItems = () => {
    if (!currentUser) return [];

    if (isCustomer) {
      return [
        { to: '/', icon: Home, label: 'Trang chủ' },
        { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
        { to: '/cart', icon: ShoppingCart, label: 'Giỏ hàng', primary: true },
        { to: '/collections', icon: BarChart3, label: 'Bộ sưu tập' },
        { to: '/profile', icon: User, label: 'Cá nhân' }
      ];
    } else {
      return [
        { to: '/', icon: BarChart3, label: 'Trang chủ' },
        { to: '/menu', icon: Utensils, label: 'Thực đơn' },
        { to: '/orders', icon: ClipboardList, label: 'Đơn hàng', primary: true },
        { to: '/reviews', icon: Star, label: 'Đánh giá' },
        { to: '/profile', icon: User, label: 'Cá nhân' }
      ];
    }
  };

  const menuItems = getMenuItems();

  // Giới hạn 4-5 items cho mobile
  const displayItems = menuItems.slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg">
      <div className="flex">
        {displayItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                  item.primary
                    ? 'text-white bg-orange-500'
                    : isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600'
                }`
              }
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}