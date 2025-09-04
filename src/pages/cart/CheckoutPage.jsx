import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  // This is a mockup page; integration to orderApi can be added later
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">Thanh toán</h1>
      <Card>
        <CardContent className="p-4">
          <div className="font-medium mb-2">Tổng quan đơn hàng</div>
          <div className="text-sm text-muted-foreground">Chi tiết giỏ hàng sẽ hiển thị ở đây</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="font-medium">Thông tin giao hàng</div>
          <input placeholder="Địa chỉ" className="w-full border rounded px-3 py-2 bg-transparent" />
          <input placeholder="Số điện thoại" className="w-full border rounded px-3 py-2 bg-transparent" />
        </CardContent>
      </Card>
      <Button className="w-full" size="lg" onClick={() => navigate('/orders')}>Thanh toán</Button>
    </div>
  );
};

export default CheckoutPage;


