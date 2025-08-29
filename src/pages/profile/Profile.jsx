import React from 'react';
import useAuth from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ui/theme-toggle';
import { User, Settings, LogOut, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentUser?.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {currentUser?.role === 'customer' ? 'Khách hàng' : 
                 currentUser?.role === 'staff' ? 'Nhân viên' : 'Chủ quán'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser?.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{currentUser.phone}</span>
              </div>
            )}
            {currentUser?.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{currentUser.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Cài đặt</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Toggle for Mobile */}
          <div className="md:hidden">
            <h3 className="text-sm font-medium mb-2">Giao diện</h3>
            <ThemeToggle variant="full" />
          </div>

          <Separator className="md:hidden" />

          {/* Other settings can be added here */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tài khoản</h3>
            <Button 
              variant="destructive" 
              className="w-full md:w-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}