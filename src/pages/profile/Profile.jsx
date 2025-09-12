import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ui/theme-toggle';
import { User, Settings, LogOut, Phone, Mail, Wallet, Pencil, MapPin, Calendar, User2, Building2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/services/userApi';
import { staffApi } from '@/services/staffApi';
import { toast } from '@/utils/toast';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const role = useMemo(() => currentUser?.role || 'customer', [currentUser]);

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userApi.getProfile(role);
        setProfile(res?.data || currentUser || {});
        
        // Check if user needs to update profile
        if (res?.data?.is_need_update) {
          toast.warning('Vui lòng cập nhật đầy đủ thông tin cá nhân');
          navigate('/profile/edit');
          return;
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };

    const fetchBalance = async () => {
      try {
        const res = await userApi.getWalletBalance();
        setBalance(res?.data?.balance ?? null);
      } catch (e) {
        console.error('Error fetching balance:', e);
      }
    };

    const fetchRestaurant = async () => {
      if (role === 'owner' || role === 'staff') {
        try {
          const res = await staffApi.getRestaurant();
          setRestaurant(res.success ? res.data : null);
        } catch (e) {
          console.error('Error fetching restaurant:', e);
          setRestaurant(null);
        }
      }
    };

    fetchProfile();
    fetchBalance();
    fetchRestaurant();
  }, [role, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">{profile?.full_name || profile?.name || 'Hồ sơ'}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {role === 'customer' ? 'Khách hàng' : 'Chủ quán'}
                </p>
                {profile?.is_need_update && (
                  <p className="text-sm text-orange-600 font-medium">⚠️ Cần cập nhật thông tin</p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/profile/edit')}>
              <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
            {profile?.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
            )}
            {profile?.address && (
              <div className="flex items-start space-x-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{profile.address}</span>
              </div>
            )}
            {profile?.date_of_birth && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(profile.date_of_birth).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
            {profile?.gender && (
              <div className="flex items-center space-x-2">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{profile.gender === 'male' ? 'Nam' : 'Nữ'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" /> Ví của tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Số dư hiện tại: {balance == null ? '...' : `${new Intl.NumberFormat('vi-VN').format(balance)}₫`}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/payment/deposit')}>Nạp tiền</Button>
            {role === 'owner' && (
              <Button onClick={() => navigate('/payment/withdraw')}>Rút tiền</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Management (for owners/staff) */}
      {(role === 'owner' || role === 'staff') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Quản lý nhà hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {restaurant ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{restaurant.name}</div>
                    <div className="text-sm text-muted-foreground">{restaurant.address}</div>
                    {restaurant.approval_status && (
                      <div className="text-xs mt-1">
                        Trạng thái: <span className={`font-medium ${
                          restaurant.approval_status === 'approved' ? 'text-green-600' : 
                          restaurant.approval_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {restaurant.approval_status === 'approved' ? 'Đã duyệt' :
                           restaurant.approval_status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      restaurant.is_active ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {restaurant.is_active ? 'Đang hoạt động' : 'Tạm ngừng'}
                    </div>
                    {restaurant.rating && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate('/staff/restaurant')} className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Quản lý nhà hàng
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/staff/menu')} className="flex-1">
                    <User className="h-4 w-4 mr-2" />
                    Thực đơn
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="text-muted-foreground">Bạn chưa có nhà hàng được liên kết</div>
                <Button onClick={() => navigate('/staff/restaurant')}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Tạo/Liên kết nhà hàng
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

          {/* Account actions */}
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