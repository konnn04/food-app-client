import { fetchApi } from './api.js';

export const cartApi = {
  getCart: async () => {
    return await fetchApi('/api/customer/cart/', 'GET');
  },

  addToCart: async (data) => {
    return await fetchApi('/api/customer/cart/add/', 'POST', data);
  },

  clearCart: async () => {
    return await fetchApi('/api/customer/cart/clear/', 'DELETE');
  },

  updateItem: async (itemId, quantity) => {
    return await fetchApi(`/api/customer/cart/update/${itemId}/`, 'PUT', { quantity });
  },

  removeItem: async (itemId) => {
    return await fetchApi(`/api/customer/cart/remove/${itemId}/`, 'DELETE');
  }
};
