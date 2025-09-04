import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Minus, Plus } from 'lucide-react';
import { cartApi } from '../../services/cartApi';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (item, delta) => {
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    await cartApi.updateItem(item.id, newQty);
    fetchCart();
  };

  const removeItem = async (item) => {
    await cartApi.removeItem(item.id);
    fetchCart();
  };

  const total = cart?.items?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Giỏ hàng của bạn</h1>
      {loading && <div className="text-sm text-muted-foreground mb-2">Đang tải giỏ hàng...</div>}
      {!loading && !cart && (
        <div className="text-sm text-destructive mb-2">Bạn cần đăng nhập lại để xem giỏ hàng.</div>
      )}
      <div className="space-y-3">
        {(cart?.items || []).map((it) => (
          <Card key={it.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <img src={it.image_url} alt={it.name} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                <div className="text-sm text-muted-foreground truncate">{it.restaurant?.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => updateQty(it, -1)}><Minus className="h-4 w-4" /></Button>
                <span className="w-8 text-center">{it.quantity}</span>
                <Button size="icon" variant="outline" onClick={() => updateQty(it, 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="w-24 text-right">{new Intl.NumberFormat('vi-VN').format(it.price)}₫</div>
              <Button variant="ghost" onClick={() => removeItem(it)}>Xóa</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 bg-background pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-muted-foreground">Tổng cộng:</div>
          <div className="text-lg font-semibold">{new Intl.NumberFormat('vi-VN').format(total)}₫</div>
        </div>
        <Button className="w-full" size="lg" onClick={() => navigate('/checkout')} disabled={!cart || (cart.items || []).length === 0}>
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartPage;


