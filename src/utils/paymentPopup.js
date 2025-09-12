import { toast } from '@/utils/toast';

/**
 * Open VNPay payment in popup window
 * @param {string} paymentUrl - VNPay payment URL
 * @param {Object} options - Configuration options
 * @param {Function} options.onComplete - Callback when payment completes
 * @param {Function} options.onError - Callback when popup is blocked
 * @param {number} options.timeout - Auto close timeout in milliseconds (default: 10 minutes)
 * @param {string} options.windowName - Popup window name (default: 'vnpay_payment')
 */
export const openPaymentPopup = (paymentUrl, options = {}) => {
  const {
    onComplete = () => {},
    onError = () => {},
    timeout = 600000, // 10 minutes
    windowName = 'vnpay_payment'
  } = options;

  // Open popup window
  const popup = window.open(
    paymentUrl,
    windowName,
    'width=800,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
  );

  if (!popup) {
    const errorMsg = 'Popup bị chặn. Vui lòng cho phép popup và thử lại.';
    toast.error(errorMsg);
    onError(errorMsg);
    return null;
  }

  // Focus popup
  popup.focus();

  // Listen for popup close or payment completion
  const checkClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkClosed);
      onComplete();
    }
  }, 1000);

  // Auto close popup after timeout
  const timeoutId = setTimeout(() => {
    if (!popup.closed) {
      popup.close();
      clearInterval(checkClosed);
    }
  }, timeout);

  // Return cleanup function
  return () => {
    clearInterval(checkClosed);
    clearTimeout(timeoutId);
    if (!popup.closed) {
      popup.close();
    }
  };
};

/**
 * Open payment popup with automatic data refresh
 * @param {string} paymentUrl - VNPay payment URL
 * @param {Object} options - Configuration options
 * @param {Function} options.refreshData - Function to refresh data after payment
 * @param {string} options.successMessage - Success message to show
 * @param {Function} options.onNavigate - Function to navigate after payment
 */
export const openPaymentPopupWithRefresh = (paymentUrl, options = {}) => {
  const {
    refreshData = () => {},
    successMessage = 'Giao dịch đã hoàn tất.',
    onNavigate = null
  } = options;

  return openPaymentPopup(paymentUrl, {
    onComplete: async () => {
      try {
        await refreshData();
        toast.success(successMessage);
        if (onNavigate) {
          onNavigate();
        }
      } catch (error) {
        console.error('Error refreshing data after payment:', error);
        toast.error('Có lỗi xảy ra khi cập nhật dữ liệu.');
      }
    },
    onError: (errorMsg) => {
      toast.error(errorMsg);
    }
  });
};
