import { fetchApi } from './api.js';

export const cartApi = {
  getCart: async () => {
    return await fetchApi('/api/customer/cart/', 'GET');
  },

  addToCart: async (data) => {
    return await fetchApi('/api/customer/cart/add/', 'POST', data, null, {
      toastError: true,
      errorMessage: 'Không thể thêm món vào giỏ hàng'
    });
  },

  clearCart: async () => {
    return await fetchApi('/api/customer/cart/clear/', 'DELETE', null, null, {
      toastSuccess: true,
      successMessage: 'Đã xóa giỏ hàng'
    });
  },

  updateItem: async (itemId, quantity) => {
    return await fetchApi(`/api/customer/cart/update/${itemId}/`, 'PUT', { quantity }, null, {
      toastError: true,
      errorMessage: 'Không thể cập nhật số lượng'
    });
  },

  removeItem: async (itemId) => {
    return await fetchApi(`/api/customer/cart/remove/${itemId}/`, 'DELETE', null, null, {
      toastSuccess: true,
      successMessage: 'Đã xóa món khỏi giỏ hàng'
    });
  }
};
