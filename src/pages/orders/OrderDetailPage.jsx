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
import { ArrowLeft, MapPin, Phone, Clock, Package, X, CreditCard, Wallet, Check, Utensils, Truck, Home, Star } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { reviewApi } from '@/services/reviewApi';

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

        {/* Order Progress Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Trạng thái đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline track */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-muted" />
              
              <div className="relative flex justify-between">
                {/* Step 1: Pending */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    ['pending'].includes(order.status) ? 'bg-primary text-primary-foreground' : 
                    ['paid', 'accepted', 'done', 'completed'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    {['paid', 'accepted', 'done', 'completed'].includes(order.status) ? 
                      <Check className="h-5 w-5" /> : 
                      <CreditCard className="h-5 w-5" />
                    }
                  </div>
                  <span className="text-xs text-center mt-2 font-medium">Chờ thanh toán</span>
                </div>
                
                {/* Step 2: Accepted */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    ['accepted'].includes(order.status) ? 'bg-primary text-primary-foreground' : 
                    ['done', 'completed'].includes(order.status) ? 'bg-green-500 text-white' : 
                    ['pending', 'cancelled'].includes(order.status) ? 'bg-muted' : 'bg-blue-500 text-white'
                  }`}>
                    {['done', 'completed'].includes(order.status) ? 
                      <Check className="h-5 w-5" /> : 
                      <Utensils className="h-5 w-5" />
                    }
                  </div>
                  <span className="text-xs text-center mt-2 font-medium">Đã nhận đơn</span>
                </div>
                
                {/* Step 3: Done (cooking) */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    ['done'].includes(order.status) ? 'bg-primary text-primary-foreground' : 
                    ['completed'].includes(order.status) ? 'bg-green-500 text-white' : 
                    ['pending', 'paid', 'cancelled'].includes(order.status) ? 'bg-muted' : 'bg-blue-500 text-white'
                  }`}>
                    {['completed'].includes(order.status) ? 
                      <Check className="h-5 w-5" /> : 
                      <Truck className="h-5 w-5" />
                    }
                  </div>
                  <span className="text-xs text-center mt-2 font-medium">Đã nấu xong<br/>Đang giao</span>
                </div>
                
                {/* Step 4: Completed (delivered) */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    ['completed'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    <Home className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-center mt-2 font-medium">Đã giao hàng</span>
                </div>
              </div>
              
              {/* For cancelled orders */}
              {order.status === 'cancelled' && (
                <div className="mt-8 p-3 border border-red-200 bg-red-50 rounded-lg text-center">
                  <p className="text-red-600 font-medium">Đơn hàng đã bị hủy</p>
                </div>
              )}
            </div>
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
            
            {/* Make sure the cancel button is always visible when conditions are met */}
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

        {/* Review Section - Only for completed orders and customers */}
        {isCustomer && order.status === 'completed' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" /> Đánh giá món ăn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(order.items || []).map((item) => (
                <ReviewItemCard key={item.id} item={item} />
              ))}
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

// Review Item Card Component
const ReviewItemCard = ({ item }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(item.has_reviewed);

  const handleSubmitReview = async () => {
    try {
      setSubmitting(true);
      await reviewApi.createCustomerReview({
        food_id: item.food_id,
        rating: Number(rating),
        comment: comment,
      });
      toast.success('Đánh giá thành công!');
      setHasReviewed(true);
      setIsReviewing(false);
    } catch (e) {
      toast.error(e.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  if (hasReviewed) {
    return (
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src={item.food_image}
            alt={item.food_name}
            className="w-16 h-16 rounded object-cover"
          />
          <div>
            <h4 className="font-medium">{item.food_name}</h4>
            <div className="text-green-600 flex items-center mt-1">
              <Check className="h-4 w-4 mr-1" />
              <span className="text-sm">Đã đánh giá</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={item.food_image}
          alt={item.food_name}
          className="w-16 h-16 rounded object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium">{item.food_name}</h4>
          {!isReviewing && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsReviewing(true)}
            >
              <Star className="h-4 w-4 mr-1" />
              Đánh giá món này
            </Button>
          )}
        </div>
      </div>

      {isReviewing && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Đánh giá:</span>
            <Select value={rating.toString()} onValueChange={(value) => setRating(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Chọn sao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 sao ★★★★★</SelectItem>
                <SelectItem value="4">4 sao ★★★★☆</SelectItem>
                <SelectItem value="3">3 sao ★★★☆☆</SelectItem>
                <SelectItem value="2">2 sao ★★☆☆☆</SelectItem>
                <SelectItem value="1">1 sao ★☆☆☆☆</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Nhận xét:</label>
            <Textarea 
              placeholder="Chia sẻ cảm nhận của bạn về món ăn này..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsReviewing(false)}
            >
              Hủy
            </Button>
            <Button 
              size="sm"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
