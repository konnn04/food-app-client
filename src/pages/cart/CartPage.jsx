import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Minus, Plus, Store, AlertCircle } from "lucide-react";
import { cartApi } from "../../services/cartApi";
import { useNavigate } from "react-router-dom";
import { toast } from "@/utils/toast";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
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

  useEffect(() => {
    fetchCart();
    (async () => {
      try {
        const res =
          (await (
            await import("@/services/paymentApi")
          ).paymentApi?.getWalletBalance?.()) || null;
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    // Load wallet balance separately to avoid dynamic import pitfalls
    (async () => {
      try {
        const { paymentApi } = await import("@/services/paymentApi");
        const res = await paymentApi.getWalletBalance();
        setWalletBalance(res?.data?.balance ?? null);
      } catch (_) {}
    })();
  }, []);

  const updateQty = async (item, delta) => {
    try {
      const newQty = Math.max(1, (item.quantity || 1) + delta);
      await cartApi.updateItem(item.id, newQty);
      fetchCart();
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (e) {
      toast.error(e.message || "Không thể cập nhật số lượng");
    }
  };

  const removeItem = async (item) => {
    try {
      await cartApi.removeItem(item.id);
      fetchCart();
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (e) {
      toast.error(e.message || "Không thể xóa món");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;
    try {
      await cartApi.clearCart();
      fetchCart();
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      toast.success("Đã xóa giỏ hàng");
    } catch (e) {
      toast.error(e.message || "Không thể xóa giỏ hàng");
    }
  };

  const total =
    cart?.items?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Giỏ hàng của bạn</h1>
        {cart?.items?.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearCart}>
            Xóa giỏ hàng
          </Button>
        )}
      </div>

      {loading && (
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Đang tải giỏ hàng...
            </p>
          </div>
        </div>
      )}
      {!loading && !cart && (
        <div className="text-sm text-destructive mb-2">
          Bạn cần đăng nhập lại để xem giỏ hàng.
        </div>
      )}

      {/* Restaurant Info & Balance */}
      {cart?.restaurant_name && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Store className="h-5 w-5 text-primary" />
              {cart.restaurant_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Giỏ hàng chỉ chứa món từ một nhà hàng
            </div>
            {walletBalance != null && (
              <div className="mt-2 text-sm">
                Số dư ví:{" "}
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN").format(walletBalance)}₫
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cart Items */}
      <div className="space-y-3">
        {(cart?.items || []).map((it) => (
          <Card key={it.food_id}>
            <CardContent className="flex items-center gap-4 p-4">
              <img
                src={it.food_image}
                alt={it.food_name}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.food_name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {it.restaurant_name}
                </div>
                <div className="text-sm font-medium text-primary">
                  {new Intl.NumberFormat("vi-VN").format(
                    it.price * it.quantity
                  )}
                  ₫
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQty(it, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{it.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQty(it, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" onClick={() => removeItem(it)}>
                Xóa
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 bg-background pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-muted-foreground">Tổng cộng:</div>
          <div className="text-lg font-semibold">
            {new Intl.NumberFormat("vi-VN").format(total)}₫
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => navigate("/checkout")}
          disabled={!cart || (cart.items || []).length === 0}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
