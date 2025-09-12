import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cartApi } from '@/services/cartApi';
import { orderApi } from '@/services/orderApi';
import { paymentApi } from '@/services/paymentApi';
import { userApi } from '@/services/userApi';
import { couponApi } from '@/services/couponApi';
import { toast } from '@/utils/toast';
import { openPaymentPopupWithRefresh } from '@/utils/paymentPopup';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = useMemo(() => cart?.items?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0, [cart]);
  const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [cartRes, profileRes] = await Promise.all([
          cartApi.getCart(),
          userApi.getProfile('customer').catch(() => ({ data: {} })),
        ]);
        const cartData = cartRes?.data || null;
        setCart(cartData);
        const p = profileRes?.data || {};
        
        // Try to get address from localStorage first, then profile
        const userLocation = localStorage.getItem('userLocation');
        let defaultAddress = '';
        if (userLocation) {
          try {
            const location = JSON.parse(userLocation);
            defaultAddress = location.address || '';
          } catch (e) {
            console.error('Error parsing userLocation:', e);
          }
        }
        
        setAddress(defaultAddress || p.address || '');
        setPhone(p.phone || '');
      } catch (e) {
        toast.error(e.message || 'Không thể tải dữ liệu thanh toán');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    if (!cart || (cart.items || []).length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    setApplying(true);
    try {
      const payload = {
        code: couponCode.trim(),
        order_amount: subtotal,
        restaurant_id: cart.restaurant_id,
        food_ids: (cart.items || []).map(i => i.food_id).filter(Boolean),
      };
      const res = await couponApi.apply(payload);
      const discount = res?.data?.discount ?? 0;
      const payable = res?.data?.payable;
      setDiscountAmount(discount);
      if (typeof payable === 'number') {
        setDiscountAmount(Math.max(0, subtotal - payable));
      }
      setAppliedCoupon({ code: payload.code, info: res?.data || {} });
      toast.success('Áp dụng mã giảm giá thành công');
    } catch (e) {
      setDiscountAmount(0);
      setAppliedCoupon(null);
      toast.error(e.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const handlePay = async () => {
    if (!cart || (cart.items || []).length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    if (!address || !phone) {
      toast.error('Vui lòng nhập địa chỉ và số điện thoại');
      return;
    }
    setCreating(true);
    try {
      const body = { delivery_address: address, delivery_phone: phone };
      if (note) body.delivery_note = note;
      if (appliedCoupon?.code) body.coupon_code = appliedCoupon.code;
      const createRes = await orderApi.createOrder(body);
      const orderId = createRes?.data?.order?.id || createRes?.data?.id;
      if (!orderId) {
        throw new Error('Không thể tạo đơn hàng');
      }
      const payRes = await paymentApi.payOrder(orderId);
      const redirectUrl = payRes?.data?.payment_url || payRes?.data?.redirect_url;
      if (redirectUrl) {
        // Open payment in popup window
        openPaymentPopupWithRefresh(redirectUrl, {
          refreshData: () => Promise.resolve(), // No need to refresh data here
          successMessage: 'Nạp tiền vào ví thành công!',
          onNavigate: () => navigate('/orders')
        });
      } else {
        toast.success('Thanh toán thành công');
        navigate('/orders');
      }
    } catch (e) {
      toast.error(e.message || 'Thanh toán thất bại');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">Thanh toán</h1>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {loading && <div className="text-sm text-muted-foreground">Đang tải giỏ hàng...</div>}
          {!loading && (!cart || (cart.items || []).length === 0) && (
            <div className="text-sm text-muted-foreground">Giỏ hàng trống</div>
          )}
          {!loading && cart && (cart.items || []).map((it) => (
            <div key={it.id} className="flex items-center justify-between text-sm">
              <div className="truncate">{it.food_name} × {it.quantity}</div>
              <div>{new Intl.NumberFormat('vi-VN').format(it.price * it.quantity)}₫</div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t mt-2 text-sm">
            <div className="text-muted-foreground">Tạm tính</div>
            <div>{new Intl.NumberFormat('vi-VN').format(subtotal)}₫</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Giảm giá</div>
            <div className="text-green-600">-{new Intl.NumberFormat('vi-VN').format(discountAmount)}₫</div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t mt-2">
            <div className="text-muted-foreground">Tổng cộng</div>
            <div className="font-semibold">{new Intl.NumberFormat('vi-VN').format(total)}₫</div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin giao hàng</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ" className="w-full border rounded px-3 py-2 bg-transparent" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" className="w-full border rounded px-3 py-2 bg-transparent" />
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú cho cửa hàng" className="w-full border rounded px-3 py-2 bg-transparent min-h-[80px]" />
        </CardContent>
      </Card>

      {/* Coupon */}
      <Card>
        <CardHeader>
          <CardTitle>Mã giảm giá</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {!appliedCoupon ? (
            <div className="flex gap-2">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Nhập mã giảm giá" className="flex-1 border rounded px-3 py-2 bg-transparent" />
              <Button onClick={handleApplyCoupon} disabled={applying || !couponCode}>Áp dụng</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <div>Mã <span className="font-medium">{appliedCoupon.code}</span> đã được áp dụng</div>
              <Button variant="outline" onClick={handleRemoveCoupon}>Hủy</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button className="w-full" size="lg" onClick={handlePay} disabled={creating || !cart || (cart.items || []).length === 0}>Thanh toán</Button>
    </div>
  );
};

export default CheckoutPage;


