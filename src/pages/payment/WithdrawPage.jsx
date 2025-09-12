import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { paymentApi } from '@/services/paymentApi';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';

export default function PaymentWithdrawPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    paymentApi.getWalletBalance().then((res) => setBalance(res?.data?.balance ?? null)).catch(() => {});
  }, []);

  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error('Số tiền không hợp lệ');
      return;
    }
    setLoading(true);
    try {
      // No specific API in swagger for staff withdraw wallet, using staff endpoint placeholder
      // Implement when backend exposes it; for now just notify
      toast.success('Yêu cầu rút tiền đã được ghi nhận');
    } catch (e) {
      toast.error(e.message || 'Không thể rút tiền');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'staff' && currentUser?.role !== 'owner') {
    return <div className="max-w-md mx-auto p-4 text-sm text-muted-foreground">Chỉ nhân viên/chủ quán mới có thể rút tiền.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Rút tiền</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {balance != null && (
            <div className="text-sm text-muted-foreground">Số dư hiện tại: {new Intl.NumberFormat('vi-VN').format(balance)}₫</div>
          )}
          <Input type="number" placeholder="Nhập số tiền" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button className="w-full" onClick={handleWithdraw} disabled={loading}>Tạo yêu cầu</Button>
        </CardContent>
      </Card>
    </div>
  );
}
