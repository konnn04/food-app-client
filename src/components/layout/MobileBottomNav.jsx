import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { cartApi } from '@/services/cartApi';
import { Badge } from '@/components/ui/badge';
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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isCustomer) {
        setCartCount(0);
        return;
      }
      try {
        const res = await cartApi.getCart();
        const count = res?.data?.items?.length || 0;
        setCartCount(count);
      } catch (_) {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [isCustomer]);

  useEffect(() => {
    const handler = () => {
      if (!isCustomer) return;
      cartApi.getCart().then((res) => {
        setCartCount(res?.data?.items?.length || 0);
      }).catch(() => setCartCount(0));
    };
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, [isCustomer]);

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
        { to: '/staff/menu', icon: Utensils, label: 'Thực đơn' },
        { to: '/orders', icon: ClipboardList, label: 'Đơn hàng', primary: true },
        { to: '/staff/reviews', icon: Star, label: 'Đánh giá' },
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
                `relative flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                  item.primary
                    ? 'text-white bg-orange-500'
                    : isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600'
                }`
              }
            >
              <Icon className="h-6 w-6 mb-1" />
              {item.to === '/cart' && isCustomer && cartCount > 0 && (
                <Badge className="absolute top-1 right-4 h-4 px-1 text-[10px]" variant="destructive">
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}