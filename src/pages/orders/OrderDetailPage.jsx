import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { orderApi } from '@/services/orderApi';
import useAuth from '@/hooks/useAuth';
import { paymentApi } from '@/services/paymentApi';
import { toast } from '@/utils/toast';
import { openPaymentPopupWithRefresh } from '@/utils/paymentPopup';
import { ArrowLeft, MapPin, Phone, Clock, Package, X, CreditCard, Wallet } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCustomer } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = isCustomer ? await orderApi.getOrderDetail(id) : await orderApi.getStaffOrderDetail(id);
        if (res.success) {
          setOrder(res.data);
        } else {
          toast.error('Không thể tải chi tiết đơn hàng');
          navigate('/orders');
        }
      } catch (e) {
        toast.error(e.message || 'Lỗi tải đơn hàng');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    // Load wallet balance for display
    (async () => {
      try {
        const res = await paymentApi.getWalletBalance();
        setWalletBalance(res?.data?.balance ?? null);
      } catch (_) {}
    })();
  }, []);

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setCancelling(true);
    try {
      await orderApi.cancelOrder(id, 'Khách yêu cầu hủy');
      toast.success('Đã hủy đơn hàng');
      navigate('/orders');
    } catch (e) {
      toast.error(e.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const handlePayment = async () => {
    if (!window.confirm('Bạn có chắc muốn thanh toán đơn hàng này?')) return;
    setPaying(true);
    try {
      // Store redirect info for payment return
      sessionStorage.setItem('paymentRedirect', JSON.stringify({
        type: 'order',
        orderId: id,
        timestamp: Date.now()
      }));

      const res = await paymentApi.payOrder(id);
      const redirectUrl = res?.data?.payment_url || res?.data?.redirect_url;
      // If backend says no redirectUrl and returns wallet paid info, handle accordingly
      if (!redirectUrl && res?.data?.amount_vnpay > 0) {
        // Not enough balance → prompt deposit dialog
        setShowInsufficientDialog(true);
        return;
      }
      if (redirectUrl) {
        // Open payment in popup window
        openPaymentPopupWithRefresh(redirectUrl, {
          refreshData: async () => {
            const orderRes = await orderApi.getOrderDetail(id);
            if (orderRes.success) {
              setOrder(orderRes.data);
            }
          },
          successMessage: 'Nạp tiền vào ví thành công! Vui lòng kiểm tra trạng thái đơn hàng.'
        });
      } else {
        toast.success('Thanh toán thành công');
        // Refresh order data
        const orderRes = await orderApi.getOrderDetail(id);
        if (orderRes.success) {
          setOrder(orderRes.data);
        }
      }
    } catch (e) {
      toast.error(e.message || 'Thanh toán thất bại');
    } finally {
      setPaying(false);
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

  // Customer: cancel when pending. Staff: cancel when accepted or done
  const canCancel = (isCustomer && order?.status === 'pending') || (!isCustomer && (order?.status === 'accepted' || order?.status === 'done'));
  const canPay = order?.status === 'pending';
  // Staff actions
  const canAccept = !isCustomer && order?.status === 'paid';
  const canMarkDone = !isCustomer && order?.status === 'accepted';
  const canComplete = !isCustomer && order?.status === 'done';

  const staffAction = async (type) => {
    try {
      if (type === 'accept') {
        await orderApi.acceptStaffOrder(id);
        toast.success('Đã nhận đơn');
      } else if (type === 'done') {
        await orderApi.markDoneStaffOrder(id);
        toast.success('Đã đánh dấu xong món');
      } else if (type === 'complete') {
        await orderApi.completeStaffOrder(id);
        toast.success('Đã hoàn tất đơn');
      }
      // Refresh
      const res = await orderApi.getStaffOrderDetail(id);
      if (res.success) setOrder(res.data);
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">
            Về danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <h1 className="text-lg font-semibold">Chi tiết đơn hàng #{order.id}</h1>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Nhà hàng</h4>
                <p className="text-sm text-muted-foreground">{order.restaurant_name}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tổng tiền</h4>
                <p className="text-lg font-semibold text-primary">
                  {new Intl.NumberFormat('vi-VN').format(order.total_amount)}₫
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Phí vận chuyển</h4>
                <p className="text-lg font-semibold">0₫</p>
                <p className="text-xs text-muted-foreground">Free ship</p>
              </div>
              {walletBalance != null && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Wallet className="h-4 w-4" /> Số dư ví</h4>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(walletBalance)}₫
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-2">Ngày đặt</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Trạng thái</h4>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Thông tin giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.delivery_address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.delivery_phone}</span>
            </div>
            {order.delivery_note && (
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{order.delivery_note}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Món đã đặt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <img
                  src={item.food_image}
                  alt={item.food_name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.food_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('vi-VN').format(item.price)}₫ × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat('vi-VN').format(item.subtotal)}₫
                  </p>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Tổng cộng</span>
              <span className="text-lg font-semibold text-primary">
                {new Intl.NumberFormat('vi-VN').format(order.total_amount)}₫
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {(canCancel || canPay || !isCustomer) && (
          <Card>
            <CardContent className="p-4 space-y-3">
              {canPay && (
                <Button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {paying ? 'Đang xử lý thanh toán...' : 'Thanh toán đơn hàng'}
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </Button>
              )}
              {!isCustomer && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button disabled={!canAccept} onClick={() => staffAction('accept')}>Nhận đơn</Button>
                  <Button disabled={!canMarkDone} onClick={() => staffAction('done')}>Đánh dấu xong món</Button>
                  <Button disabled={!canComplete} onClick={() => staffAction('complete')}>Hoàn tất</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Insufficient balance dialog */}
        <AlertDialog open={showInsufficientDialog} onOpenChange={setShowInsufficientDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Số dư không đủ</AlertDialogTitle>
              <AlertDialogDescription>
                Ví của bạn không đủ để thanh toán đơn hàng này. Vui lòng nạp thêm để tiếp tục.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Để sau</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setShowInsufficientDialog(false); navigate('/payment/deposit'); }}>Nạp tiền</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default OrderDetailPage;
