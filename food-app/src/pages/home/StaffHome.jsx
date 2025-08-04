import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

// Mock data
const statsData = {
  revenue: 2500000,
  orders: 156,
  customers: 89,
  growth: 12.5
};

const recentOrders = [
  {
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    items: 3,
    total: 125000,
    status: 'pending',
    time: '10:30'
  },
  {
    id: 'ORD002',
    customer: 'Trần Thị B',
    items: 2,
    total: 80000,
    status: 'completed',
    time: '10:15'
  },
  {
    id: 'ORD003',
    customer: 'Lê Văn C',
    items: 4,
    total: 200000,
    status: 'preparing',
    time: '10:00'
  },
];

export default function StaffHome() {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', label: 'Chờ xử lý' },
      preparing: { variant: 'default', label: 'Đang chuẩn bị' },
      completed: { variant: 'outline', label: 'Hoàn thành' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard Nhà Hàng</h1>
        <p className="text-gray-600">Tổng quan hoạt động kinh doanh hôm nay</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.revenue.toLocaleString('vi-VN')}₫
            </div>
            <p className="text-xs text-muted-foreground">
              +{statsData.growth}% so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.orders}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng hôm nay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.customers}</div>
            <p className="text-xs text-muted-foreground">Khách hàng mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tăng trưởng</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{statsData.growth}%</div>
            <p className="text-xs text-muted-foreground">So với tuần trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-gray-500">
                      {order.items} món • {order.total.toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{order.time}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}