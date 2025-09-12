import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { paymentApi } from '@/services/paymentApi';
import { toast } from '@/utils/toast';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function VNPayReturnPage() {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Đang xử lý giao dịch...');
  const [redirectInfo, setRedirectInfo] = useState(null);
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const params = Object.fromEntries(query.entries());
    
    // Get redirect info from session storage
    const storedRedirect = sessionStorage.getItem('paymentRedirect');
    if (storedRedirect) {
      try {
        setRedirectInfo(JSON.parse(storedRedirect));
      } catch (e) {
        console.error('Error parsing redirect info:', e);
      }
    }

    paymentApi.vnpayReturn(params).then((res) => {
      const ok = res?.success !== false;
      setStatus(ok ? 'success' : 'failed');
      // Prefer clearer success message depending on context
      if (ok) {
        if (storedRedirect) {
          try {
            const info = JSON.parse(storedRedirect);
            if (info?.type === 'deposit') {
              setMessage('Đã nạp tiền vào ví thành công');
            } else if (info?.type === 'order') {
              setMessage('Thanh toán thành công');
            } else {
              setMessage('Giao dịch thành công');
            }
          } catch {
            setMessage('Giao dịch thành công');
          }
        } else {
          setMessage('Giao dịch thành công');
        }
      } else {
        setMessage(res?.message || 'Thanh toán thất bại');
      }
      
      if (ok) {
        toast.success('Thanh toán thành công!');
      } else {
        toast.error('Thanh toán thất bại!');
      }
    }).catch(() => {
      setStatus('failed');
      setMessage('Không thể xác minh kết quả thanh toán');
      toast.error('Không thể xác minh kết quả thanh toán');
    });
  }, []);

  const handleRedirect = () => {
    // Clear session storage
    sessionStorage.removeItem('paymentRedirect');
    
    if (redirectInfo?.type === 'deposit') {
      navigate('/profile');
    } else if (redirectInfo?.type === 'order' && redirectInfo?.orderId) {
      navigate(`/orders/${redirectInfo.orderId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Kết quả thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : ''}>{message}</div>
          
          {status === 'success' && redirectInfo && (
            <div className="text-sm text-muted-foreground">
              {redirectInfo.type === 'deposit' 
                ? 'Nạp tiền thành công! Bạn có thể quay lại trang profile.'
                : 'Thanh toán thành công! Bạn có thể quay lại đơn hàng để tiếp tục.'
              }
            </div>
          )}
          
          <div className="flex gap-2">
            {redirectInfo && (
              <Button onClick={handleRedirect} className="flex-1">
                {redirectInfo.type === 'deposit' ? 'Về trang profile' : 'Về đơn hàng'}
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
