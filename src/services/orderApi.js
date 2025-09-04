import { fetchApi } from './api.js';

export const orderApi = {
  createOrder: async (data) => {
    return await fetchApi('/api/customer/orders/', 'POST', data);
  },

  getOrders: async () => {
    return await fetchApi('/api/customer/orders/', 'GET');
  }
};
