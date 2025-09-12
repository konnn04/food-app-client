import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { paymentApi } from '@/services/paymentApi';
import { staffApi } from '@/services/staffApi';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import InfiniteScroller from '../../components/common/InfiniteScroller';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isCustomer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    has_next: false,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [walletBalance, setWalletBalance] = useState(null);
  const [hasRestaurant, setHasRestaurant] = useState(null);

  const loadOrders = async (page = 1, status = 'all') => {
    try {
      setLoading(true);
      const params = { page };
      const res = isCustomer ? await orderApi.getOrders(params) : await orderApi.getStaffOrders(params);
      
      if (res.success) {
        let items = res?.data?.items || [];
        // Backend does not support status filter in customer orders; filter client-side
        if (status !== 'all') {
          items = items.filter((o) => o.status === status);
        }
        const p = res?.data?.pagination || {};
        const normalized = {
          page: p.page || page,
          total: p.total || items.length,
          pages: p.pages || p.total_pages || 1,
          has_next: typeof p.has_next === 'boolean' ? p.has_next : ((p.page || page) < (p.pages || p.total_pages || 1)),
        };

        if (page === 1) {
          setOrders(items);
        } else {
          setOrders(prev => [...prev, ...items]);
        }
        
        setPagination(normalized);
      }
    } catch (e) {
      console.error(e);
      // If staff without linked restaurant, show CTA
      if (!isCustomer && /liên kết|link|liên kết với nhà hàng/i.test(e.message || '')) {
        setOrders([]);
        setPagination({ page: 1, has_next: false, total: 0, pages: 1 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!isCustomer) {
      setWalletBalance(null);
      // Check if staff has restaurant linked
      (async () => {
        try {
          const res = await staffApi.getRestaurant();
          setHasRestaurant(res.success && res.data);
        } catch (_) {
          setHasRestaurant(false);
        }
      })();
      return;
    }
    (async () => {
      try {
        const res = await paymentApi.getWalletBalance();
        setWalletBalance(res?.data?.balance ?? null);
      } catch (_) {
        setWalletBalance(null);
      }
    })();
  }, [isCustomer]);

  const handleLoadMore = () => {
    if (pagination.has_next && !loading) {
      loadOrders((pagination.page || 1) + 1, activeTab);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-orange-100 text-orange-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán/duyệt';
      case 'paid': return 'Đã thanh toán';
      case 'accepted': return 'Đã nhận đơn';
      case 'done': return 'Đã xong món';
      case 'completed': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-1">Đơn hàng của tôi</h1>
      {isCustomer && walletBalance != null && (
        <div className="text-sm text-muted-foreground mb-3">
          Số dư ví: <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(walletBalance)}₫</span>
        </div>
      )}
      
      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(isCustomer
          ? [
              { key: 'all', label: 'Tất cả' },
              { key: 'pending', label: 'Chờ thanh toán/duyệt' },
              { key: 'paid', label: 'Đã thanh toán' },
              { key: 'accepted', label: 'Đã nhận đơn' },
              { key: 'done', label: 'Đã xong món' },
              { key: 'completed', label: 'Đã giao' },
              { key: 'cancelled', label: 'Đã hủy' }
            ]
          : [
              { key: 'all', label: 'Tất cả' },
              // Pending is hidden from staff by default per new policy
              { key: 'paid', label: 'Đã thanh toán' },
              { key: 'accepted', label: 'Đã nhận đơn' },
              { key: 'done', label: 'Đã xong món' },
              { key: 'completed', label: 'Đã giao' },
              { key: 'cancelled', label: 'Đã hủy' }
            ]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {orders.length === 0 && !loading && (
        <div className="text-center text-muted-foreground">
          {isCustomer ? 'Bạn chưa có đơn hàng nào' : (
            hasRestaurant === false ? (
              <div className="space-y-3">
                <div>Chưa có quyền xem đơn. Có thể bạn chưa liên kết nhà hàng.</div>
                <Button onClick={() => navigate('/staff/restaurant')}>Tạo/Liên kết nhà hàng</Button>
              </div>
            ) : (
              <div>Chưa có đơn hàng nào</div>
            )
          )}
        </div>
      )}
      
      <InfiniteScroller onLoadMore={handleLoadMore} hasMore={pagination.has_next}>
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/orders/${o.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Mã đơn: #{o.id}</div>
                  <Badge className={getStatusColor(o.status)}>
                    {getStatusText(o.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {o.restaurant_name} • {new Date(o.created_at).toLocaleString('vi-VN')}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    Tổng tiền: <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(o.total_amount ?? o.total ?? 0)}₫</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {o.items?.length || 0} món
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {loading && (
            <div className="text-center py-4 text-muted-foreground">Đang tải...</div>
          )}
        </div>
      </InfiniteScroller>
    </div>
  );
};

export default OrdersPage;
