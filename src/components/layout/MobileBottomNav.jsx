import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Clock, 
  ShoppingCart, 
  User, 
  BarChart3, 
  ClipboardList, 
  Utensils, 
  Store
} from 'lucide-react';

export default function MobileBottomNav() {
  const { currentUser } = useAuth();

  // Menu items cho từng role
  const getMenuItems = () => {
    if (!currentUser) return [];

    const role = currentUser.role;

    if (role === 'customer') {
      return [
        { to: '/', icon: Home, label: 'Trang chủ' },
        { to: '/recent', icon: Clock, label: 'Gần đây' },
        { to: '/orders', icon: ShoppingCart, label: 'Đơn hàng' },
        { to: '/profile', icon: User, label: 'Cá nhân' }
      ];
    } else if (role === 'staff' || role === 'owner') {
      return [
        { to: '/', icon: BarChart3, label: 'Thống kê' },
        { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
        { to: '/menu', icon: Utensils, label: 'Menu' },
        { to: '/restaurant', icon: Store, label: 'Quán' },
        { to: '/profile', icon: User, label: 'Cá nhân' }
      ];
    }
    return [];
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
                  isActive
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