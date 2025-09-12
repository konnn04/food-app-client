import { fetchApi } from './api.js';

export const paymentApi = {
  createDeposit: async (amount) => {
    return await fetchApi('/api/payment/deposit/create/', 'POST', { amount });
  },
  payOrder: async (orderId) => {
    return await fetchApi('/api/payment/order/pay/', 'POST', { order_id: orderId });
  },
  getWalletBalance: async () => {
    return await fetchApi('/api/payment/wallet/balance/', 'GET');
  },
  vnpayReturn: async (params) => {
    // Proxy to backend return endpoint (GET)
    return await fetchApi('/api/payment/vnpay/return/', 'GET', null, params);
  }
};

export default paymentApi;
