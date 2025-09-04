import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  Home,
  Clock,
  ShoppingCart,
  User,
  BarChart3,
  ClipboardList,
  Utensils,
  Store,
  Bell,
  LogOut,
} from "lucide-react";

export default function DesktopNavbar({ notificationCount = 0 }) {
  const { currentUser, logout, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items cho từng role
  const getMenuItems = () => {
    if (!currentUser) return [];

    if (isCustomer) {
      return [
        { to: "/", icon: Home, label: "Trang chủ" },
        { to: "/orders", icon: ClipboardList, label: "Đơn hàng" },
        { to: "/collections", icon: BarChart3, label: "Bộ sưu tập" },
        { to: "/profile", icon: User, label: "Cá nhân" },
      ];
    } else {
      return [
        { to: "/", icon: BarChart3, label: "Trang chủ" },
        { to: "/menu", icon: Utensils, label: "Thực đơn" },
        { to: "/orders", icon: ClipboardList, label: "Đơn hàng" },
        { to: "/reviews", icon: Star, label: "Đánh giá" },
        { to: "/profile", icon: User, label: "Cá nhân" },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="hidden md:flex bg-background shadow-sm border-b px-6 py-4 items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img src={logoImg} alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-bold text-foreground">FoodApp</span>
      </div>

      {/* Menu Items */}
      <div className="flex items-center space-x-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Right Section: Cart + Theme + User */}
      <div className="flex items-center space-x-4">
        {/* Cart button (compact on desktop) */}
        <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
          <ShoppingCart className="h-5 w-5" />
          {/* Example badge placeholder, wire to cart count if available */}
          <Badge className="absolute -top-1 -right-1 px-1 h-5 min-w-[1.25rem] flex items-center justify-center" variant="secondary">0</Badge>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </Badge>
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>
              {currentUser?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{currentUser?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {currentUser?.role}
            </span>
          </div>
        </div>

        {/* Logout */}
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
