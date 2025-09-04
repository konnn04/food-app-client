import React, { useEffect, useState } from 'react';
import { orderApi } from '../../services/orderApi';
import { Card, CardContent } from '../../components/ui/card';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await orderApi.getOrders();
        setOrders(res.data || []);
      } catch (e) {}
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-xl font-semibold mb-2">Đơn hàng của tôi</h1>
      {orders.map((o) => (
        <Card key={o.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Mã đơn: #{o.id}</div>
              <div className="text-sm text-muted-foreground">Tổng tiền: {new Intl.NumberFormat('vi-VN').format(o.total)}₫</div>
            </div>
            <div className="text-sm capitalize">{o.status}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersPage;


