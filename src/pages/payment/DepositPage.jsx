import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { paymentApi } from '@/services/paymentApi';
import { toast } from 'sonner';
import { openPaymentPopupWithRefresh } from '@/utils/paymentPopup';

export default function PaymentDepositPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    try {
      const res = await paymentApi.getWalletBalance();
      setBalance(res?.data?.balance ?? null);
    } catch (_) {}
  };

  useEffect(() => { fetchBalance(); }, []);

  const handleDeposit = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error('Số tiền không hợp lệ');
      return;
    }
    setLoading(true);
    try {
      // Store redirect info for payment return
      sessionStorage.setItem('paymentRedirect', JSON.stringify({
        type: 'deposit',
        timestamp: Date.now()
      }));

      const res = await paymentApi.createDeposit(value);
      // Backend expected to return a redirect URL for VNPay
      const url = res?.data?.payment_url || res?.data?.redirect_url;
      if (url) {
        // Open payment in popup window
        openPaymentPopupWithRefresh(url, {
          refreshData: fetchBalance,
          successMessage: 'Nạp tiền thành công! Vui lòng kiểm tra số dư.'
        });
      } else {
        toast.success('Tạo lệnh nạp thành công');
      }
    } catch (e) {
      toast.error(e.message || 'Không thể tạo lệnh nạp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Nạp tiền vào ví</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {balance != null && (
            <div className="text-sm text-muted-foreground">Số dư hiện tại: {new Intl.NumberFormat('vi-VN').format(balance)}₫</div>
          )}
          <Input type="number" placeholder="Nhập số tiền" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button className="w-full" onClick={handleDeposit} disabled={loading}>Tạo giao dịch</Button>
        </CardContent>
      </Card>
    </div>
  );
}
