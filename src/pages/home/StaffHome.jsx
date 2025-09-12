import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Settings, Star, TrendingUp, Users, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import { staffApi } from '@/services/staffApi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StaffHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    revenue: null,
    restaurant: null,
    orders: null,
    reviews: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load current month revenue
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const [revenueRes, restaurantRes, ordersRes, reviewsRes] = await Promise.allSettled([
          staffApi.getRevenue({
            start_date: startOfMonth.toISOString().split('T')[0],
            end_date: endOfMonth.toISOString().split('T')[0]
          }),
          staffApi.getRestaurant(),
          staffApi.getOrders({ page: 1, per_page: 10 }),
          staffApi.getReviews({ page: 1, per_page: 10 })
        ]);

        setDashboardData({
          revenue: revenueRes.status === 'fulfilled' ? revenueRes.value.data : null,
          restaurant: restaurantRes.status === 'fulfilled' ? restaurantRes.value.data : null,
          orders: ordersRes.status === 'fulfilled' ? ordersRes.value.data : null,
          reviews: reviewsRes.status === 'fulfilled' ? reviewsRes.value.data : null,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getAverageRating = () => {
    if (!dashboardData.reviews?.items) return 0;
    const reviews = dashboardData.reviews.items;
    if (reviews.length === 0) return 0;
    return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  };

  const getTotalOrdersThisMonth = () => {
    return dashboardData.revenue?.order_count || 0;
  };

  const getTotalRevenueThisMonth = () => {
    return dashboardData.revenue?.total_revenue || 0;
  };

  const getChartData = () => {
    if (!dashboardData.revenue?.daily_revenue) return null;
    
    const dailyData = dashboardData.revenue.daily_revenue;
    const labels = dailyData.map(d => d.date);
    const revenueData = dailyData.map(d => d.revenue);
    const ordersData = dailyData.map(d => d.orders);

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (₫)',
          data: revenueData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          yAxisID: 'y',
        },
        {
          label: 'Số đơn hàng',
          data: ordersData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (₫)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số đơn hàng',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bảng điều khiển</h1>
        {dashboardData.restaurant && (
          <Badge variant={dashboardData.restaurant.is_active ? 'default' : 'secondary'}>
            {dashboardData.restaurant.is_active ? 'Đang hoạt động' : 'Tạm ngừng'}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Doanh thu tháng này</p>
                <p className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(getTotalRevenueThisMonth())}₫</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Đơn hàng tháng này</p>
                <p className="text-2xl font-bold">{getTotalOrdersThisMonth()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Đánh giá trung bình</p>
                <p className="text-2xl font-bold">{getAverageRating()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng đánh giá</p>
                <p className="text-2xl font-bold">{dashboardData.reviews?.items?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {getChartData() && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Doanh thu theo ngày
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={getChartData()} options={chartOptions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Đơn hàng theo ngày
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={getChartData()} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card onClick={() => navigate('/staff/menu')} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <Utensils className="h-6 w-6" />
                <div className="font-medium">Thực đơn</div>
                <div className="text-sm text-muted-foreground">Quản lý món ăn</div>
              </CardContent>
            </Card>
            <Card onClick={() => navigate('/staff/restaurant')} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <Settings className="h-6 w-6" />
                <div className="font-medium">Cài đặt nhà hàng</div>
                <div className="text-sm text-muted-foreground">Thông tin nhà hàng</div>
              </CardContent>
            </Card>
            <Card onClick={() => navigate('/staff/reviews')} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <Star className="h-6 w-6" />
                <div className="font-medium">Đánh giá</div>
                <div className="text-sm text-muted-foreground">Xem đánh giá khách hàng</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      {dashboardData.orders?.items && dashboardData.orders.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.orders.items.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Đơn #{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{new Intl.NumberFormat('vi-VN').format(order.total_amount)}₫</div>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate('/orders')} className="w-full">
                Xem tất cả đơn hàng
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffHome;